import PageFrame from "@/components/editorial/PageFrame";
import StacksManager from "./StacksManager";
import ProjectsManager from "./ProjectsManager";
import { listProjects, listStacks } from "@/db/queries";
import { auth } from "@/auth";

export default async function Dashboard() {
  const [stacks, projects, session] = await Promise.all([
    listStacks(),
    listProjects(),
    auth(),
  ]);
  return (
    <PageFrame session={session?.user ? { email: session.user.email ?? null } : null}>
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        <header>
          <p className="mono-label mb-3">§ Ω · Console</p>
          <h1 className="display text-4xl md:text-5xl font-black tracking-tight leading-none">
            Dashboard
          </h1>
          <p className="mt-3 text-stone-500">
            Edições da Volume IV. Altere projetos e stacks aqui.
          </p>
        </header>
        <StacksManager initialStacks={stacks} />
        <ProjectsManager initialProjects={projects} allStacks={stacks} />
      </div>
    </PageFrame>
  );
}
