import { notFound } from "next/navigation";
import { getProjectById, listClients, listStacks } from "@/db/queries";

import ProjectHeader from "./ProjectHeader";
import ProjectLinksHub from "./ProjectLinksHub";
import ProjectTodoBoard from "./ProjectTodoBoard";
import ProjectSummaryStrip from "./ProjectSummaryStrip";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [project, stacks, clients] = await Promise.all([
    getProjectById(id),
    listStacks(),
    listClients(),
  ]);
  if (!project) notFound();

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      <ProjectHeader project={project} />
      <ProjectLinksHub projectId={project._id} links={project.links} />
      <ProjectTodoBoard projectId={project._id} todos={project.todos} />
      <ProjectSummaryStrip
        project={project}
        allClients={clients}
        allStacks={stacks}
      />
    </div>
  );
}
