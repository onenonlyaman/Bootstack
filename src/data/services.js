/**
 * Service detail pages (route: /services/:slug).
 *
 * Content is the real Bootstack service copy carried over from the previous
 * site. Two entries there had copy-paste errors which are corrected here and
 * noted inline — nothing else is rewritten.
 *
 * Shape matches what a CMS/API would return, so wiring this to an endpoint
 * later is a drop-in change (same contract as data/work.js and data/approach.js).
 */

export const services = [
  {
    slug: "erp-solutions",
    /** The line as it appears in Section 02. */
    label: "ERP Solutions",
    title: "ERP Solutions that run the whole operation",
    subtitle:
      "Streamline your operations with custom ERP systems designed to manage sales, inventory, projects, finance, HR and business workflows all in one platform.",
    highlights: [
      "Sales & Inventory Management",
      "Finance & HR Workflows",
      "Project & Operations Tracking",
      "Custom ERP Integrations",
    ],
    about: {
      heading: "About the service",
      description:
        "Every business works differently, so your software should too. We build custom ERP solutions that bring your sales, inventory, finance, HR and operations together in one easy-to-use system.",
    },
    whyItMatters: {
      heading: "Why it matters",
      statements: [
        "Managing multiple tools and spreadsheets can slow your team down. A custom ERP keeps everything organised, saves time and helps you make better business decisions.",
        "A single source of truth turns guesswork into decisions you can defend.",
      ],
    },
    whyBootstack: {
      heading: "Why Bootstack",
      description:
        "We don't believe in one-size-fits-all software. We understand your business, design the right solution and build an ERP that grows with you.",
    },
    build: [
      "Custom ERP Development",
      "CRM Integration",
      "Inventory Management",
      "HR & Payroll",
      "Finance & Reports",
    ],
    process: [
      "Understand your business",
      "Plan the solution",
      "Develop the software",
      "Test everything carefully",
      "Launch & support",
    ],
    // The old site shipped the mobile-app CTA on this page by mistake; replaced
    // with one that matches the service.
    cta: {
      title:
        "Ready to discuss your ERP Solutions that run the whole operation project?",
      body: "Tell us what you're building and let's explore how Bootstack can help.",
    },
  },
  {
    slug: "mobile-app-development",
    label: "Mobile App Development",
    title: "Mobile apps people keep on the home screen",
    subtitle:
      "Build fast, secure and user-friendly Android and iOS applications that deliver seamless customer experiences and support your business growth.",
    highlights: [
      "iOS & Android Apps",
      "Custom App Development",
      "API & Backend Integration",
      "Scalable App Architecture",
    ],
    about: {
      heading: "About the service",
      description:
        "We create mobile apps that are fast, easy to use and built around your business goals. Whether it's for your customers or your team, we make apps that deliver real value.",
    },
    whyItMatters: {
      heading: "Why it matters",
      statements: [
        "People expect everything to be available on their phones. A mobile app helps you stay connected with customers, improve services and grow your business.",
        "A great mobile experience keeps your brand within reach every day.",
      ],
    },
    whyBootstack: {
      heading: "Why Bootstack",
      description:
        "We focus on building reliable, user-friendly apps that not only look great but also perform smoothly across devices.",
    },
    build: [
      "Android Apps",
      "iOS Apps",
      "Cross-Platform Apps",
      "Business Applications",
      "API Integration",
    ],
    process: [
      "Discuss your business needs",
      "Design the user experience",
      "Build the application",
      "Test every feature",
      "Launch & support",
    ],
    cta: {
      title: "Got an app in mind?",
      body: "Bring the idea. We'll turn it into a scoped, shippable plan.",
    },
  },
  {
    slug: "high-performing-websites",
    label: "High-Performing Websites",
    title: "Websites engineered for speed and trust",
    subtitle:
      "Create fast, responsive and conversion-focused websites that showcase your brand, engage visitors and generate more business.",
    highlights: [
      "High-Converting Websites",
      "Responsive Web Development",
      "SEO-Friendly Architecture",
      "Performance Optimisation",
    ],
    about: {
      heading: "About the service",
      description:
        "Your website is often the first impression of your business. We build modern, responsive websites that look professional, load quickly and help turn visitors into customers.",
    },
    whyItMatters: {
      heading: "Why it matters",
      statements: [
        "A great website builds trust, improves your online presence and works as a powerful tool to generate leads and sales.",
        "Your website should work as your best salesperson, 24 hours a day.",
      ],
    },
    whyBootstack: {
      heading: "Why Bootstack",
      description:
        "We combine clean design, strong performance and SEO best practices to create websites that support your business growth.",
    },
    build: [
      "Business Websites",
      "Corporate Websites",
      "E-Commerce Stores",
      "Landing Pages",
      "Website Optimisation",
    ],
    process: [
      "Understand your business",
      "Design the website",
      "Develop every page",
      "Optimise for performance",
      "Launch & support",
    ],
    cta: {
      title: "Ready to discuss your Websites engineered for speed and trust project?",
      body: "Tell us what you're building and let's explore how Bootstack can help.",
    },
  },
  {
    slug: "lead-generation",
    label: "Lead Generation",
    title: "Pipeline built on signal, not spray",
    subtitle:
      "Attract high-quality leads through performance marketing, SEO, landing pages and data-driven campaigns that turn prospects into customers.",
    highlights: [
      "Targeted Lead Campaigns",
      "Landing Page Optimisation",
      "Meta & Google Ads",
      "Lead Tracking & Automation",
    ],
    about: {
      heading: "About the service",
      description:
        "We help businesses reach the right audience through digital marketing strategies that generate quality leads and create new business opportunities.",
    },
    whyItMatters: {
      heading: "Why it matters",
      statements: [
        "Getting more visitors is only part of the journey. The right lead generation strategy brings people who are genuinely interested in your products or services.",
        "The companies that win aren't shouting louder, they're targeting sharper.",
      ],
    },
    whyBootstack: {
      heading: "Why Bootstack",
      description:
        "We create data-led campaigns focused on delivering real leads, measurable growth and a better return on your marketing investment.",
    },
    build: [
      "Meta Ads",
      "Google Ads",
      "SEO",
      "Landing Pages",
      "Marketing Automation",
    ],
    process: [
      "Research your audience",
      "Create a marketing strategy",
      "Launch campaigns",
      "Optimise performance",
      "Continuously improve results",
    ],
    cta: {
      title: "Ready to discuss your Pipeline built on signal, not spray project?",
      body: "Tell us what you're building and let's explore how Bootstack can help.",
    },
  },
  {
    slug: "brand-identity-branding",
    label: "Brand Identity & Branding",
    title: "Brand identity with a point of view",
    subtitle:
      "Build a memorable brand with a strong identity, compelling messaging and consistent visuals that inspire trust and leave a lasting impression.",
    highlights: [
      "Brand Strategy",
      "Visual Identity",
      "Brand Guidelines",
      "Marketing Assets",
    ],
    // The old site's "About" on this page was real-estate boilerplate left in by
    // mistake; written here from the service's own material instead.
    about: {
      heading: "About the service",
      description:
        "A brand is more than a logo. We define what you stand for, then build the identity, messaging and visual system that carries it consistently across every place a customer meets you.",
    },
    whyItMatters: {
      heading: "Why it matters",
      statements: [
        "A consistent brand builds trust, creates recognition and helps customers remember your business over competitors.",
        "Strong branding turns first impressions into lasting relationships.",
      ],
    },
    whyBootstack: {
      heading: "Why Bootstack",
      description:
        "We create brands with purpose — combining strategy, creativity and consistency to give your business a professional and lasting identity.",
    },
    build: [
      "Logo Design",
      "Brand Strategy",
      "Visual Identity",
      "Brand Guidelines",
      "Marketing Assets",
    ],
    process: [
      "Understand your business",
      "Define your brand strategy",
      "Design your identity",
      "Create all brand assets",
      "Ensure consistency everywhere",
    ],
    cta: {
      title: "Ready to discuss your Brand identity with a point of view project?",
      body: "Tell us what you're building and let's explore how Bootstack can help.",
    },
  },
];

/** Lookup used by the route and by Section 02's links. */
export const serviceBySlug = Object.fromEntries(
  services.map((s) => [s.slug, s]),
);
