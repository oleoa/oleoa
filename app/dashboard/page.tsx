import StacksManager from "./StacksManager";
import ProjectsManager from "./ProjectsManager";
import Navbar from "@/components/Navbar";

export default function Dashboard() {
  return (
    <main className="py-18 margin space-y-4">
      <Navbar />
      <StacksManager />
      <ProjectsManager />
    </main>
  );
}
