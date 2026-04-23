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
  return (
    <PageFrame session={session?.user ? { email: session.user.email ?? null } : null}>
      <Hero />
      <Sobre stacks={stacks} />
      <Trabalhos projects={projects} />
      <Experimentos />
      <Contato />
    </PageFrame>
  );
}
