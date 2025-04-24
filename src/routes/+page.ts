export const ssr = false;

export async function load() {
  const stacks = (await import("$lib/assets/stacks.json")).default;
  const projects = (await import("$lib/assets/projects.json")).default;
  return {
    stacks,
    projects,
  };
}
