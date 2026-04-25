import { listProjectsForDashboard } from "@/db/queries";
import ProjectsManager from "../ProjectsManager";

export default async function ProjectsListPage() {
  const projects = await listProjectsForDashboard();
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
      <header>
        <p className="mono-label mb-3">§ Ω · Console</p>
        <h1 className="display text-4xl md:text-5xl font-black tracking-tight leading-none">
          Projetos
        </h1>
        <p className="mt-3 text-stone-500">
          {projects.length} {projects.length === 1 ? "projeto" : "projetos"} no total.
        </p>
      </header>
      <ProjectsManager initialProjects={projects} />
    </div>
  );
}
