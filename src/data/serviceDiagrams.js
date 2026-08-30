/**
 * The system each service describes, as a node model.
 *
 * `hub` is a system with one core and several subsystems feeding an outcome;
 * `chain` is a linear journey. ServiceDiagram lays either out and draws it.
 *
 * A slug with no entry here is not left blank: `diagramFor` builds a chain from
 * that service's own `process` stages, so every service gets a real diagram
 * derived from its real data rather than a placeholder.
 */

export const serviceDiagrams = {
  "erp-solutions": {
    kind: "hub",
    source: "Operations",
    hub: "ERP",
    branches: ["Finance", "Inventory", "HR", "CRM"],
    sink: "Business",
  },
  "mobile-app-development": {
    kind: "chain",
    nodes: ["Idea", "UX", "Design", "Development", "Testing", "App Store"],
  },
  "high-performing-websites": {
    kind: "chain",
    nodes: ["Strategy", "UX", "Design", "Development", "SEO", "Conversion"],
  },
  "lead-generation": {
    kind: "chain",
    nodes: ["Traffic", "Landing Page", "Lead", "Qualification", "Sales", "Customer"],
  },
  "brand-identity-branding": {
    kind: "chain",
    nodes: ["Research", "Positioning", "Identity", "Visual System", "Brand", "Audience"],
  },
  "marketing-automation": {
    kind: "chain",
    nodes: ["Lead", "Trigger", "Workflow", "Personalisation", "Conversion", "Retention"],
  },
};

/** Two words is as much as a node can hold without wrapping awkwardly. */
const shorten = (stage) => stage.split(/\s+/).slice(0, 2).join(" ");

export function diagramFor(slug, service) {
  const explicit = serviceDiagrams[slug];
  if (explicit) return explicit;

  const stages = service?.process ?? [];
  if (stages.length < 2) return null;
  return { kind: "chain", nodes: stages.map(shorten) };
}

/**
 * Conceptual indicators — counts of what the engagement actually contains, not
 * invented percentages. Each returns a real number taken from the service data.
 */
export function serviceSignals(service) {
  if (!service) return [];
  return [
    { label: "Focus areas", count: service.highlights?.length ?? 0 },
    { label: "Deliverables", count: service.build?.length ?? 0 },
    { label: "Stages", count: service.process?.length ?? 0 },
  ].filter((signal) => signal.count > 0);
}
