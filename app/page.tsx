import Banner from "@/components/Banner";
import Information from "@/components/Information";

export default async function Home() {
  const projects = (await import("@/lib/assets/projects.json")).default;
  const stack = (await import("@/lib/assets/stack.json")).default;
  console.log(projects, stack);

  return (
    <main>
      <Banner />
      <Information stacks={stack} />
    </main>
  );
}
