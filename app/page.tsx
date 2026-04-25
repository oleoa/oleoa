import PageFrame from "@/components/editorial/PageFrame";
import Hero from "@/app/sections/Hero";
import Sobre from "@/app/sections/Sobre";
import Trabalhos from "@/app/sections/Trabalhos";
import Experimentos from "@/app/sections/Experimentos";
import Contato from "@/app/sections/Contato";
import { listProjects, listStacks } from "@/db/queries";
import { auth } from "@/auth";

export default async function Home() {
  const [stacks, projects, session] = await Promise.all([
    listStacks(),
    listProjects(),
    auth(),
  ]);
  const commercialProjects = projects.filter((p) => p.type === "commercial");
  const personalProjects = projects.filter((p) => p.type === "personal");
  return (
    <PageFrame session={session?.user ? { email: session.user.email ?? null } : null}>
      <Hero />
      <Sobre stacks={stacks} />
      <Trabalhos projects={commercialProjects} />
      <Experimentos projects={personalProjects} />
      <Contato />
    </PageFrame>
  );
}
