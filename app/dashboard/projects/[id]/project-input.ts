import type { Project } from "@/db/types";
import type { ProjectInput } from "../../actions";

/**
 * Pulls the full ProjectInput shape off a Project so partial editors
 * (budget card, client picker, etc) can submit updateProject without
 * clobbering unrelated fields.
 */
export function toProjectInput(project: Project): ProjectInput {
  return {
    name: project.name,
    description: project.description,
    type: project.type,
    link: project.link,
    source: project.source,
    year: project.year,
    position: project.position,
    status: project.status,
    isPublic: project.isPublic,
    budgetAmount: project.budgetAmount,
    budgetCurrency: project.budgetCurrency,
    budgetStatus: project.budgetStatus,
    clientId: project.clientId,
  };
}
