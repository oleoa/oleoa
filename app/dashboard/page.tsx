import { UserButton } from "@clerk/nextjs";

import StacksManager from "./StacksManager";
import ProjectsManager from "./ProjectsManager";

export default async function Dashboard() {
  return (
    <main className="py-14 margin space-y-4">
      <div className="fixed top-0 right-0 w-full h-14 py-4 flex justify-end margin">
        <UserButton />
      </div>
      <StacksManager />
      <ProjectsManager />
    </main>
  );
}
