/**
 * Which visual object stands for each service.
 *
 * `kind` picks the composition ServicePanel builds — a control surface, a
 * device, a browser, a funnel or an identity board. A slug with no entry falls
 * back to `system`, so every service gets a composition rather than a gap.
 *
 * Nothing here is copy: the labels inside every panel are read from the
 * service's own `highlights` and `build` arrays.
 */

export const servicePanels = {
  "erp-solutions": { kind: "system", caption: "Operating system" },
  "mobile-app-development": { kind: "device", caption: "Product surface" },
  "high-performing-websites": { kind: "browser", caption: "Digital front door" },
  "lead-generation": { kind: "funnel", caption: "Demand engine" },
  "brand-identity-branding": { kind: "board", caption: "Identity system" },
  "marketing-automation": { kind: "workflow", caption: "Automation layer" },
};

export const panelFor = (slug) =>
  servicePanels[slug] ?? { kind: "system", caption: "System" };

/**
 * The four things Bootstack puts together, and what they add up to. This is the
 * studio's own positioning — the same four words the homepage About section
 * runs full-bleed — not a claim about any one service.
 */
export const ADVANTAGE = ["Strategy", "Creativity", "Technology", "Automation"];
export const ADVANTAGE_RESULT = "Growth";
