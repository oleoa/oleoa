import { notFound } from "next/navigation";
import { getProjectById, listClients, listStacks } from "@/db/queries";

import ProjectHeader from "./ProjectHeader";
import ProjectGeneralEditor from "./ProjectGeneralEditor";
import TodoList from "./TodoList";
import ProjectLinksList from "./ProjectLinksList";
import BudgetCard from "./BudgetCard";
import ClientPicker from "./ClientPicker";
import StacksOnProject from "../../StacksOnProject";

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ProjectGeneralEditor project={project} />
          <TodoList projectId={project._id} todos={project.todos} />
        </div>

        <div className="space-y-6">
          <ClientPicker project={project} allClients={clients} />
          <BudgetCard project={project} />
          <ProjectLinksList projectId={project._id} links={project.links} />
          <StacksOnProject
            projectId={project._id}
            projectStacks={project.stacks}
            allStacks={stacks}
          />
        </div>
      </div>
    </div>
  );
}
