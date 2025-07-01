import Banner from "@/lib/components/Banner";

export default async function Home() {
  const projects = (await import("@/lib/assets/projects.json")).default;
  const stack = (await import("@/lib/assets/stack.json")).default;

  return (
    <main>
      <Banner />
    </main>
  );
}
