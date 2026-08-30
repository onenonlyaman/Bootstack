import nodemailer from "nodemailer";

/**
 * POST /api/schedule-call — the Schedule a Call enquiry endpoint.
 *
 * Runs server-side only. The SMTP credentials are read from the environment
 * and never leave this file: nothing here is imported by the browser bundle,
 * and the client only ever sees `{ ok: true }` or an error message.
 *
 * Delivery is SMTP (Hostinger), through nodemailer — Node has no built-in SMTP
 * client, so this is the one dependency the feature needs. Swapping providers
 * means changing only `transport()` and `send()` below.
 *
 * Signature is the plain (req, res) one Vercel/Netlify functions use; the Vite
 * dev server mounts the same handler so `npm run dev` behaves like production.
 */

const MAX = { name: 120, company: 160, email: 160, phone: 40, service: 160, message: 4000, time: 80 };

/** Vercel parses JSON bodies; the dev middleware and raw hosts may not. */
async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return {};
  }
}

const clean = (value, limit) =>
  typeof value === "string" ? value.trim().slice(0, limit) : "";

/** Everything that reaches the email body is escaped — the fields are public input. */
const escape = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(body) {
  const data = {
    name: clean(body.name, MAX.name),
    company: clean(body.company, MAX.company),
    email: clean(body.email, MAX.email),
    phone: clean(body.phone, MAX.phone),
    service: clean(body.service, MAX.service),
    message: clean(body.message, MAX.message),
    preferredTime: clean(body.preferredTime, MAX.time),
  };

  const errors = {};
  if (!data.name) errors.name = "Please tell us your name.";
  if (!data.email) errors.email = "Please add an email address.";
  else if (!EMAIL_RE.test(data.email)) errors.email = "That email does not look right.";
  if (!data.service) errors.service = "Missing service.";

  return { data, errors };
}

function compose(data) {
  const stamp = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "short",
  });

  const rows = [
    ["Service", data.service],
    ["Name", data.name],
    ["Business / Company", data.company || "—"],
    ["Email", data.email],
    ["WhatsApp / Phone", data.phone || "—"],
    ["Preferred Call Time", data.preferredTime || "—"],
    ["Project Requirement", data.message || "—"],
    ["Submitted", `${stamp} IST`],
  ];

  const text =
    "New Project Enquiry\n\n" +
    rows.map(([k, v]) => `${k}:\n${v}`).join("\n\n") +
    "\n";

  const html =
    `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#08161f;line-height:1.55">` +
    `<h2 style="margin:0 0 18px;font-size:18px">New Project Enquiry</h2>` +
    rows
      .map(
        ([k, v]) =>
          `<p style="margin:0 0 14px"><strong style="display:block;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#235784">${escape(
            k,
          )}</strong>${escape(v).replace(/\n/g, "<br>")}</p>`,
      )
      .join("") +
    `</div>`;

  return { text, html };
}

/**
 * One transporter per cold start. Port 465 is implicit TLS, so `secure` is
 * true there; 587 would be STARTTLS and secure:false. Credentials come from
 * the environment and are never sent to the browser.
 */
let cached = null;

function transport() {
  if (cached) return cached;

  const port = Number(process.env.SMTP_PORT || 465);
  cached = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return cached;
}

async function send({ from, to, replyTo, subject, text, html }) {
  await transport().sendMail({ from, to, replyTo, subject, text, html });
}

/** Connection + auth check that sends nothing. Used by the smoke test. */
export async function verify() {
  return transport().verify();
}

export default async function handler(req, res) {
  // Minimal res shims so the same handler works on hosts that give a bare
  // Node response (and under the Vite dev middleware).
  const json = (status, payload) => {
    if (typeof res.status === "function") return res.status(status).json(payload);
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify(payload));
  };

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(405, { error: "Method not allowed." });
  }

  const to = process.env.BOOTSTACK_CONTACT_EMAIL;
  // The envelope sender must be the authenticated mailbox, or the server will
  // refuse it as a relay attempt.
  const from =
    process.env.BOOTSTACK_FROM_EMAIL ||
    `Bootstack <${process.env.SMTP_USER || ""}>`;

  const missing = ["SMTP_HOST", "SMTP_USER", "SMTP_PASS"].filter(
    (key) => !process.env[key],
  );
  if (missing.length || !to) {
    console.error(
      `[schedule-call] Missing ${[...missing, to ? null : "BOOTSTACK_CONTACT_EMAIL"]
        .filter(Boolean)
        .join(", ")}.`,
    );
    return json(500, { error: "Email is not configured on the server yet." });
  }

  let body;
  try {
    body = await readBody(req);
  } catch {
    return json(400, { error: "Could not read the submission." });
  }

  const { data, errors } = validate(body);
  if (Object.keys(errors).length) return json(400, { errors });

  const { text, html } = compose(data);

  try {
    await send({
      from,
      to,
      replyTo: data.email,
      subject: `New Bootstack Project Enquiry - ${data.service}`,
      text,
      html,
    });
  } catch (error) {
    console.error("[schedule-call]", error);
    return json(502, { error: "We could not send that just now." });
  }

  return json(200, { ok: true });
}
