import { UserButton } from "@clerk/nextjs";
import ProjectsManager from "./ProjectsManager";

export default async function Dashboard() {
  return (
    <main className="py-14 margin">
      <div className="fixed top-0 right-0 w-full h-14 p-4 flex justify-end">
        <UserButton />
      </div>
      <ProjectsManager />
    </main>
  );
}
