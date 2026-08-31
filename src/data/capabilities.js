/** Section 03 — the six services. */

export const capabilities = [
  {
    id: "branding-uiux",
    index: "01",
    title: "Branding & UI/UX",
    verb: "We decide what you stand for.",
    blurb:
      "Create memorable brand identities and intuitive user experiences that connect with your audience.",
    items: [
      "Brand identity",
      "Visual identity",
      "UI/UX design",
      "Brand guidelines",
      "Marketing assets",
    ],
    tone: "yellow",
  },
  {
    id: "social-media",
    index: "02",
    title: "Social Media Management",
    verb: "We make the work people remember.",
    blurb:
      "Build a strong online presence with engaging content, consistent branding and strategic social media management.",
    items: [
      "Content strategy",
      "Creative production",
      "Reels & campaigns",
      "Community management",
      "Performance analysis",
    ],
    tone: "cyan",
  },
  {
    id: "performance-marketing",
    index: "03",
    title: "Performance Marketing",
    verb: "We turn attention into pipeline.",
    blurb:
      "Generate quality leads and grow your business with data driven advertising on Google, Meta and other digital platforms.",
    items: [
      "Meta Ads",
      "Google Ads",
      "Landing pages",
      "Lead tracking",
      "Campaign optimisation",
    ],
    tone: "blue",
  },
  {
    id: "brand-consultation",
    index: "04",
    title: "Brand Consultation",
    verb: "We decide the order of moves.",
    blurb:
      "Get expert guidance to define your brand strategy, strengthen your positioning and unlock new growth opportunities.",
    items: [
      "Business discovery",
      "Brand research",
      "Brand positioning",
      "Messaging & voice",
      "Implementation roadmap",
    ],
    tone: "cyan",
  },
  {
    id: "website-development",
    index: "05",
    title: "Website Development",
    verb: "We ship the digital front door.",
    blurb:
      "Build fast, responsive and SEO-friendly websites that create great first impressions and convert visitors into customers.",
    items: [
      "Business websites",
      "E-commerce stores",
      "Landing pages",
      "SEO-friendly architecture",
      "Performance optimisation",
    ],
    tone: "yellow",
  },
  {
    id: "software-development",
    index: "06",
    title: "Software Development",
    verb: "We build what runs the business.",
    blurb:
      "Develop custom software solutions that simplify operations, improve efficiency and support your business goals.",
    items: [
      "Custom ERP development",
      "CRM integration",
      "Android & iOS apps",
      "API & backend integration",
      "Scalable architecture",
    ],
    tone: "blue",
  },
  {
    id: "app-development",
    index: "07",
    title: "App Development",
    verb: "We put you on the home screen.",
    blurb:
      "Create secure, high-performance mobile applications that deliver seamless experiences on Android and iOS.",
    items: [
      "iOS & Android apps",
      "Cross-platform apps",
      "Custom app development",
      "API & backend integration",
      "Scalable app architecture",
    ],
    tone: "cyan",
  },
  {
    id: "marketing-automation",
    index: "08",
    title: "Marketing Automation",
    verb: "We remove the manual work.",
    blurb:
      "Automate repetitive marketing tasks, nurture leads and improve customer engagement with smart workflows.",
    items: [
      "Workflow automation",
      "Lead nurturing",
      "WhatsApp & email flows",
      "CRM integration",
      "Conversion optimisation",
    ],
    tone: "yellow",
  },
];

/** Section 04 — the chain that connects the capabilities. */
export const growthChain = [
  {
    id: "strategy",
    label: "Strategy",
    note: "The decision about where to play and what winning looks like.",
  },
  {
    id: "brand",
    label: "Brand",
    note: "A position, a name and a look that earn a second glance.",
  },
  {
    id: "content",
    label: "Content",
    note: "Proof of the promise, published on a rhythm.",
  },
  {
    id: "marketing",
    label: "Marketing",
    note: "Distribution with a number attached to it.",
  },
  {
    id: "technology",
    label: "Technology",
    note: "The site, the software, the place it all lands.",
  },
  {
    id: "automation",
    label: "Automation",
    note: "The follow-through that never gets forgotten.",
  },
  {
    id: "growth",
    label: "Growth",
    note: "A business that compounds instead of restarting.",
  },
];

/**
 * Section 03 — the five disciplines Bootstack brings under one roof, and the
 * services that sit inside each.
 *
 * `services` holds capability ids, so a pillar and the service index below it
 * are always the same eight records — nothing is restated. A service can belong
 * to more than one pillar (Branding & UI/UX is both a Branding and a Creativity
 * discipline), which is the point the section is making.
 *
 * The groupings come from the categories the previous site carried on its
 * services list (Marketing / Branding / Development / Automation), with
 * Creativity separated out from Branding as its own discipline.
 */
export const pillars = [
  {
    id: "branding",
    index: "01",
    label: "Branding",
    note: "A position, a name and a look that earn a second glance.",
    services: ["brand-consultation", "branding-uiux"],
  },
  {
    id: "creativity",
    index: "02",
    label: "Creativity",
    note: "The work people actually remember seeing.",
    services: ["branding-uiux", "social-media"],
  },
  {
    id: "technology",
    index: "03",
    label: "Technology",
    note: "The site, the software and the place it all lands.",
    services: ["website-development", "software-development", "app-development"],
  },
  {
    id: "marketing",
    index: "04",
    label: "Marketing",
    note: "Distribution with a number attached to it.",
    services: ["performance-marketing", "social-media"],
  },
  {
    id: "automation",
    index: "05",
    label: "Automation",
    note: "The follow-through that never gets forgotten.",
    services: ["marketing-automation"],
  },
];
