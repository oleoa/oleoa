import Banner from "@/components/sections/Banner";
import Stack from "@/components/sections/Stack";
import Projects from "@/components/sections/Projects";

export default async function Home() {
  const projects = (await import("@/lib/assets/projects.json")).default;
  const stack = (await import("@/lib/assets/stack.json")).default;

  return (
    <main>
      <Banner />
      <Stack stacks={stack} />
      <Projects projects={projects} />
    </main>
  );
}
