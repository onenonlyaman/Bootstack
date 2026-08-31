/**
 * Service detail experiences (route: /services/:slug).
 *
 * One schema, eight entries, one component. Every slug here matches an `id` in
 * data/capabilities.js, so Section 03's "Explore" links resolve straight to the
 * matching entry. Editing an object below is the only thing needed to change
 * what that service's page says — the layout, motion and colour rhythm are all
 * driven off this shape.
 *
 * Shape (every field is required):
 *   slug       matches a capabilities.js id, and is the URL segment
 *   number     chapter number shown on the page; kept in step with Section 03
 *   title      service name, as it reads in Section 03
 *   category   one word placing the service — Brand / Marketing / Technology / …
 *   tone       accent key: 'yellow' | 'cyan' | 'blue'. Carried over from
 *              capabilities.js so a service reads the same in both places.
 *   hero       { theme, label, signals[], readouts[] } - drives the hero visual.
 *              `readouts` are the four tiles inside the interface frame, each
 *              { value, label }. They state what the work includes, not what a
 *              client measured - same rule as businessImpact below. `theme` is
 *              one of interface | identity | campaign | system | automation and
 *              picks the composition variant; `label` names the artefact in the
 *              window chrome; `signals` are the chips under the title. The
 *              floating stat panels are read from businessImpact.metrics.
 *   whatItIs   { title, description }
 *   importance { title, points: string[] }  — renders as the scrubbed spine
 *   consultationProcess  [{ number, title, description }] — any length
 *   whyItMatters   { title, description }
 *   businessImpact { title, statement, metrics: [{ value, label }] }
 *
 * NOTE on businessImpact.metrics: `value` is written as it should read ("70%").
 * The page parses the leading number for the counter and keeps the rest as a
 * suffix, and sizes the ratio bar from those numbers — so for the bar to read
 * correctly they should add up to 100.
 */

export const serviceExperiences = [
  {
  slug: "branding-uiux",
  number: "01",
  title: "Branding & UI/UX",
  description:
    "Create memorable brand identities and intuitive user experiences that connect with your audience.",
  category: "Brand",

    /* Drives the hero visual. `theme` picks the composition variant;
       the floating panels come from businessImpact.metrics below. */
    hero: {
      theme: "identity",
      label: "brand-system.fig",
      signals: [
        "Distinctive",
        "Consistent",
        "Documented",
      ],
      readouts: [
        { value: "Identity", label: "Designed" },
        { value: "Visual", label: "System" },
        { value: "Guidelines", label: "Delivered" },
        { value: "Assets", label: "Handed over" },
      ],
    },

    whatItIs: {
      title: "What It Is",
      description:
        "Branding is the process of creating a unique identity that makes your business recognizable, memorable and valuable in the market.",
    },

    importance: {
      title: "Importance In Business",
      points: [
        "Differentiates you from competitors.",
        "Builds customer loyalty",
        "Create emotional connection",
        "Increases perceived value",
        "Strengthens market positioning.",
      ],
    },

    consultationProcess: [
      {
        number: "01",
        title: "Brand Discovery",
        description:
          "Understanding your vision and business goals.",
      },
      {
        number: "02",
        title: "Brand Positioning",
        description: "Defining your unique market identity and messaging.",
      },
      {
        number: "03",
        title: "Visual Identity Creation",
        description: "Developing a logo, colours, design language and brand guidelines.",
      },
      {
        number: "04",
        title: "Brand Growth Strategy",
        description: "Planning communication across digital platforms.",
      },
    ],

    whyItMatters: {
      title: "Why This Matters",
      description:
        "People don't just buy products; they buy brands they trust and connect with.",
    },

    businessImpact: {
      title: "Business Impact",
      statement: "Strong Brand = Strong Business Value",
      metrics: [
        { value: "40%", label: "Recognition" },
        { value: "35%", label: "Trust" },
        { value: "20%", label: "Customer Loyalty" },
        { value: "10%", label: "Market Growth" },
      ],
    },
  },

  {
  slug: "social-media",
  number: "02",
  title: "Social Media Management",
  description:
    "Build a strong online presence with engaging content, consistent branding and strategic social media management.",
  category: "Marketing",

    /* Drives the hero visual. `theme` picks the composition variant;
       the floating panels come from businessImpact.metrics below. */
    hero: {
      theme: "campaign",
      label: "content.plan",
      signals: [
        "Planned",
        "Published",
        "Measured",
      ],
      readouts: [
        { value: "Content", label: "Scheduled" },
        { value: "Reels", label: "Produced" },
        { value: "Community", label: "Managed" },
        { value: "Live", label: "Campaign" },
      ],
    },

    whatItIs: {
      title: "What It Is",
      description:
        "Social media marketing helps businesses build online communities, increase visibility and connect with potential customers through strategic content.",
    },

    importance: {
      title: "Importance In Business",
      points: [
        "Builds brand awareness",
        "Creates customer engagement",
        "Generate organic growth",
        "Improve customer relationship",
        "Support sales growth",
      ],
    },

    consultationProcess: [
      {
        number: "01",
        title: "Social Media Audit",
        description:
          "Analyzing your current presence and competitors.",
      },
      {
        number: "02",
        title: "Content Strategy",
        description: "Creating content pillars, themes and posting plans.",
      },
      {
        number: "03",
        title: "Creative Production",
        description: "Designing reels, posts, campaigns and storytelling content..",
      },
      {
        number: "04",
        title: "Performance Analysis",
        description: "Tracking insights and improving strategies.",
      },
    ],

    whyItMatters: {
      title: "Why This Matters",
      description:
        "Your customers are already online. The right strategy helps your brand stay visible and relevant.",
    },

    businessImpact: {
      title: "Business Impact",
      statement: "Social Media Growth Formula",
      metrics: [
        { value: "50%", label: "Content Quality" },
        { value: "30%", label: "Consisteny" },
        { value: "20%", label: "Audience Engagement" },
      ],
    },
  },

  {
  slug: "performance-marketing",
  number: "03",
  title: "Performance Marketing",
  description:
    "Generate quality leads and grow your business with data driven advertising on Google, Meta and other digital platforms.",
  category: "Marketing",

    /* Drives the hero visual. `theme` picks the composition variant;
       the floating panels come from businessImpact.metrics below. */
    hero: {
      theme: "campaign",
      label: "campaigns.csv",
      signals: [
        "Targeted",
        "Tracked",
        "Optimised",
      ],
      readouts: [
        { value: "Meta", label: "Ads" },
        { value: "Google", label: "Ads" },
        { value: "Leads", label: "Tracked" },
        { value: "Live", label: "Campaign" },
      ],
    },

    whatItIs: {
      title: "What It Is",
      description:
        "Performance marketing uses data driven advertising strategies to generate measurable results like leads, sales and conversions.",
    },

    importance: {
      title: "Importance In Business",
      points: [
        "Generates targeted leads",
        "Provides measurable ROI",
        "Helps scale faster",
        "Reaches the right audience",
        "Optimises marketing budget",
      ],
    },

    consultationProcess: [
      {
        number: "01",
        title: "Business & Audience Research",
        description:
          "Understanding your customers and market.",
      },
      {
        number: "02",
        title: "Campaign Strategy",
        description: "Creating ad structure, targeting, and creative direction.",
      },
      {
        number: "03",
        title: "Launch & Monitiring",
        description: "Managing campaigns and tracking performance.",
      },
      {
        number: "04",
        title: "Optimisation & Scaling",
        description: "Improving results through continuous testing.",
      },
    ],

    whyItMatters: {
      title: "Why This Matters",
      description:
        "Marketing without measurement is guesswork. Performance marketing turns investment into measurable growth.",
    },

    businessImpact: {
      title: "Business Impact",
      statement: "Ad Success Depends On",
      metrics: [
        { value: "40%", label: "Targeting" },
        { value: "30%", label: "Creative" },
        { value: "20%", label: "Strategy" },
        { value: "10%", label: "Optimisation" },
      ],
    },
  },

  {
  slug: "brand-consultation",
  number: "04",
  title: "Brand Consultation",
  description:
    "Get expert guidance to define your brand strategy, strengthen your positioning and unlock new growth opportunities",
  category: "Strategy",

    /* Drives the hero visual. `theme` picks the composition variant;
       the floating panels come from businessImpact.metrics below. */
    hero: {
      theme: "identity",
      label: "strategy.pdf",
      signals: [
        "Researched",
        "Positioned",
        "Actionable",
      ],
      readouts: [
        { value: "Strategy", label: "Mapped" },
        { value: "Audience", label: "Defined" },
        { value: "Competitors", label: "Audited" },
        { value: "Roadmap", label: "Delivered" },
      ],
    },

    whatItIs: {
      title: "What It Is",
      description:
        "Brand consultation helps businesses define their identity, positioning, messaging and long-term strategy to create a memorable brand.",
    },

    importance: {
      title: "Importance In Business",
      points: [
        "Creates a clear brand identity",
        "Improves market positioning",
        "Builds customer trust",
        "Differentiates from competitors",
        "Supports long-term business growth",
      ],
    },

    consultationProcess: [
      {
        number: "01",
        title: "Business Discovery",
        description:
          "Understanding your business goals, vision and target audience.",
      },
      {
        number: "02",
        title: "Brand Research",
        description: "Analyzing competitors, market trends and customer perception.",
      },
      {
        number: "03",
        title: "Brand Strategy",
        description: "Defining positioning, messaging, voice and brand direction.",
      },
      {
        number: "04",
        title: "Implementation Roadmap",
        description: "Creating a practical plan for consistent brand execution.",
      },
    ],

    whyItMatters: {
      title: "Why This Matters",
      description:
        "A strong brand creates trust, attracts customers and builds lasting business value beyond products and services.",
    },

    businessImpact: {
      title: "Business Impact",
      statement: "Strong Brand Formula",
      metrics: [
        { value: "45%", label: "Brand Positioning" },
        { value: "35%", label: "Customer Trust" },
        { value: "20%", label: "Consistency" },
      ],
    },
  },

  {
 slug: "website-development",
number: "05",
title: "Website Development",
description:
  "Build fast, responsive and SEO-friendly websites that convert visitors into customers.",
category: "Technology",
tone: "yellow",

    /* Drives the hero visual. `theme` picks the composition variant;
       the floating panels come from businessImpact.metrics below. */
    hero: {
      theme: "interface",
      label: "index.html",
      signals: [
        "Responsive",
        "Secure",
        "Optimised",
      ],
      readouts: [
        { value: "100%", label: "Responsive" },
        { value: "SEO", label: "Ready" },
        { value: "HTTPS", label: "Secure" },
        { value: "Live", label: "Deployment" },
      ],
    },

    whatItIs: {
      title: "What It Is",
      description:
        "A website is more than an online presence. It is your digital identity. We design and develop high-performance websites that communicate your brand value, build trust and convert visitors into customers.",
    },

    importance: {
      title: "Importance In Business",
      points: [
        "Creates a strong first impression",
        "Builds brand credibility and trust",
        "Helps generate leads 24/7",
        "Improves customer experience",
        "Provides a foundation for digital growth",
      ],
    },

    consultationProcess: [
      {
        number: "01",
        title: "Business Understanding",
        description:
          "We analyse your goals, audience, competitors, and industry requirements.",
      },
      {
        number: "02",
        title: "Strategy & Planning",
        description:
          "We create a website structure, user journey, and technology roadmap.",
      },
      {
        number: "03",
        title: "Design & Development",
        description:
          "Our team builds a modern, responsive, and scalable website.",
      },
      {
        number: "04",
        title: "Testing & Optimisation",
        description:
          "We ensure speed, security, performance, and a smooth user experience.",
      },
    ],

    whyItMatters: {
      title: "Why This Matters",
      description:
        "A poorly designed website can cost potential customers. A strategic website turns your brand into a powerful digital asset.",
    },

    businessImpact: {
      title: "Business Impact Ratio",
      statement: "Website = 24/7 Sales Representative",
      metrics: [
        { value: "70%", label: "Trust Building" },
        { value: "20%", label: "Lead Generation" },
        { value: "10%", label: "Brand Visibility" },
      ],
    },
  },

  {
  slug: "software-development",
  number: "06",
  title: "Software Development",
  description:
    "Develop custom software solutions that simplify operations, improve efficiency and support your business goals.",
  category: "Technology",

    /* Drives the hero visual. `theme` picks the composition variant;
       the floating panels come from businessImpact.metrics below. */
    hero: {
      theme: "system",
      label: "server.ts",
      signals: [
        "Scalable",
        "Secure",
        "Maintained",
      ],
      readouts: [
        { value: "REST", label: "APIs" },
        { value: "Database", label: "Managed" },
        { value: "HTTPS", label: "Secure" },
        { value: "Live", label: "Deployment" },
      ],
    },

    whatItIs: {
      title: "What It Is",
      description:
        "Software development focuses on creating custom applications that improve efficiency, automate workflows and solve business challenges.",
    },

    importance: {
      title: "Importance In Business",
      points: [
        "Automates business operations",
        "Improves productivity",
        "Reduces manual work",
        "Supports business scalability",
        "Enhances customer experience",
      ],
    },

    consultationProcess: [
      {
        number: "01",
        title: "Requirement Analysis",
        description:
          "Understanding your business processes and software requirements.",
      },
      {
        number: "02",
        title: "Solution Planning",
        description: "Designing the right software architecture and workflow.",
      },
      {
        number: "03",
        title: "Development & Testing",
        description: "Building secure software with continuous quality testing.",
      },
      {
        number: "04",
        title: "Deployment & Support",
        description: "Launching your software and providing ongoing maintenance.",
      },
    ],

    whyItMatters: {
      title: "Why This Matters",
      description:
        "Custom software streamlines operations, improves efficiency and helps businesses scale without limitations.",
    },

    businessImpact: {
      title: "Business Impact",
      statement: "Software Success Formula",
      metrics: [
        { value: "40%", label: "Automation" },
        { value: "35%", label: "Efficiency" },
        { value: "25%", label: "Scalability" },
      ],
    },
  },

  {
  slug: "app-development",
  number: "07",
  title: "App Development",
  description:
    "Create secure, high-performance mobile applications that deliver seamless experiences on Android and iOS.",
  category: "Technology",

    /* Drives the hero visual. `theme` picks the composition variant;
       the floating panels come from businessImpact.metrics below. */
    hero: {
      theme: "system",
      label: "App.tsx",
      signals: [
        "Native",
        "Fast",
        "Supported",
      ],
      readouts: [
        { value: "iOS", label: "Native" },
        { value: "Android", label: "Native" },
        { value: "Releases", label: "Managed" },
        { value: "Live", label: "Store" },
      ],
    },

    whatItIs: {
      title: "What It Is",
      description:
        "App development focuses on designing and building mobile applications that improve customer engagement and business accessibility.",
    },

    importance: {
      title: "Importance In Business",
      points: [
        "Improves customer experience",
        "Expands business reach",
        "Increases customer engagement",
        "Supports digital transformation",
        "Creates new revenue opportunities",
      ],
    },

   consultationProcess: [
  {
    number: "01",
    title: "Requirement Discovery",
    description:
      "Understanding business goals, target users, and app requirements.",
  },
  {
    number: "02",
    title: "UI/UX Design",
    description:
      "Designing intuitive and user-friendly mobile experiences.",
  },
  {
    number: "03",
    title: "Development & Testing",
    description:
      "Building secure, high-performance mobile applications and testing every key feature.",
  },
  {
    number: "04",
    title: "Launch & Maintenance",
    description:
      "Publishing the app and providing continuous updates, improvements, and support.",
  },
],

    whyItMatters: {
      title: "Why This Matters",
      description:
        "Mobile apps keep your business closer to customers while improving engagement, convenience and loyalty.",
    },

    businessImpact: {
      title: "Business Impact",
      statement: "App Growth Formula",
      metrics: [
        { value: "45%", label:"User Experience" },
        { value: "35%", label: "Performance" },
        { value: "20%", label: "Customer Retention" },
      ],
    },
  },

 {
  slug: "marketing-automation",
  number: "08",
  title: "Marketing Automation",
  description:
    "Automate repetitive marketing tasks, nurture leads and improve customer engagement with smart workflows.",
  category: "Automation",

    /* Drives the hero visual. `theme` picks the composition variant;
       the floating panels come from businessImpact.metrics below. */
    hero: {
      theme: "automation",
      label: "workflow.json",
      signals: [
        "Connected",
        "Automated",
        "Measured",
      ],
      readouts: [
        { value: "Workflows", label: "Automated" },
        { value: "CRM", label: "Integrated" },
        { value: "Email", label: "Connected" },
        { value: "WhatsApp", label: "Connected" },
      ],
    },

    whatItIs: {
      title: "What It Is",
      description:
        "Marketing automation uses technology to automate emails, lead nurturing, customer communication and marketing workflows.",
    },

    importance: {
  title: "Importance In Business",
  points: [
    "Saves valuable time",
    "Improves lead nurturing",
    "Increases customer engagement",
    "Boosts marketing efficiency",
    "Improves conversion rates",
  ],
},

    consultationProcess: [
  {
    number: "01",
    title: "Workflow Analysis",
    description:
      "Understanding your marketing process and customer journey.",
  },
  {
    number: "02",
    title: "Automation Planning",
    description:
      "Designing efficient automated marketing workflows.",
  },
  {
    number: "03",
    title: "Integration & Setup",
    description:
      "Connecting CRM, email, WhatsApp and marketing platforms.",
  },
  {
    number: "04",
    title: "Monitoring & Optimisation",
    description:
      "Tracking performance and improving automation continuously.",
  },
],

    whyItMatters: {
      title: "Why This Matters",
      description:
        "Marketing automation allows businesses to deliver personalized customer experiences while reducing manual effort and increasing efficiency.",
    },

    businessImpact: {
      title: "Business Impact",
      statement: "Automation Growth Formula",
      metrics: [
        { value: "50%", label: "Workflow Automation" },
        { value: "30%", label: "Lead Nurturing" },
        { value: "20%", label: "Conversion Optimisation" },
      ],
    },
  },
];

/** Lookup used by the route and by Section 03's Explore links. */
export const serviceExperienceBySlug = Object.fromEntries(
  serviceExperiences.map((s) => [s.slug, s]),
);

/**
 * Position of a slug in the list, so a detail page can offer previous/next
 * without the caller needing to know the ordering.
 */
export const serviceNeighbours = (slug) => {
  const i = serviceExperiences.findIndex((s) => s.slug === slug);
  if (i === -1) return { previous: null, next: null };
  const count = serviceExperiences.length;
  return {
    previous: serviceExperiences[(i - 1 + count) % count],
    next: serviceExperiences[(i + 1) % count],
  };
};
