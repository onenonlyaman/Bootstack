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
  { label: "Work", href: "/#work" },
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
 * Footer service list. The label is the marketing name; `to` is the real route
 * it opens, so the footer never has to hardcode a path. Every slug below exists
 * in data/serviceExperiences.js.
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
  { label: "Success Stories", to: "/#work" },
  { label: "FAQs", to: "/#faq" },
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms & Conditions", to: "/terms-and-conditions" },
];
