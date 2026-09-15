/**
 * Global site content. Everything here is presentation-agnostic so it can be
 * swapped for a CMS/API response later without touching components.
 */

export const brand = {
  name: "Bootstack",
  blurb:
    "Marketing + technology agency helping businesses build, grow and scale with smart systems.",
};

// Root-relative hashes so these also work from /services/:slug. On the
// homepage only the hash differs, so they still scroll without a reload.
export const nav = [
  { label: "Home", href: "/#top" },
  { label: "Services", href: "/#capabilities" },
  // Featured Work is off the homepage for now, so there is no #work to land on.
  // Restore this with the section: { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
];

export const contact = {
  email: "info@thebootstack.io",
  phone: "+91 99754 99956",
  location: "Nashik, India",
};

export const socials = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/bootstack.io/",
    handle: "@bootstack.io",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/bootstack-io/",
    handle: "/bootstack-io",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61584987734034",
    handle: "/bootstack",
  },
  { label: "X", href: "https://x.com/TheBootstack", handle: "@TheBootstack" },
];

/**
 * Footer quick links: the homepage's own chapters. Root-relative, like `nav`,
 * so they work from a service page too.
 */
export const footerQuickLinks = [
  { label: "Home", to: "/#top" },
  { label: "About", to: "/#about" },
  { label: "Services", to: "/#capabilities" },
  { label: "Contact", to: "/#contact" },
];

/**
 * Footer service list. The label is the marketing name; `to` is the real route
 * it opens, so the footer never has to hardcode a path. Every slug below exists
 * in data/serviceExperiences.js.
 *
 * Not in the current three-column footer; kept for when a service list returns.
 */
export const footerServices = [
  { label: "Performance Marketing", to: "/services/performance-marketing" },
  { label: "Social Media Magement", to: "/services/social-media" },
  { label: "UI/UX Design", to: "/services/branding-uiux" },
  { label: "Brand Consultation", to: "/services/brand-consultation" },
  { label: "Web Development", to: "/services/website-development" },
  { label: "Software Development", to: "/services/software-development" },
  { label: "App Development", to: "/services/app-development" },
  { label: "Marketing Automation", to: "/services/marketing-automation" },
];

/**
 * Footer resources. An entry with no `to` has no route yet and renders as plain
 * text — a link to a path with no route renders a blank page, which is worse
 * than an item that is visibly not ready. Add a route and a `to` and it becomes
 * a link.
 *
 * Cookie Settings is not listed here: it opens the consent panel rather than
 * navigating, so Footer.jsx renders it as a button.
 */
export const footerResources = [
  { label: "What We Build", to: "/#idea" },
  { label: "Our Process", to: "/#process" },
  { label: "FAQs", to: "/#faq" },
  // Pointed at the Featured Work section, which is off the homepage for now.
  // Restore with it: { label: "Success Stories", to: "/#work" },
  // No page exists for these yet (there is no route, so the link opened a blank
  // page). Restore each once its page is built:
  // { label: "Privacy Policy", to: "/privacy-policy" },
  // { label: "Terms & Conditions", to: "/terms-and-conditions" },
];
