"use client";

import { columns } from "./columns";
import { DataTable } from "./data-table";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import AddProject from "./AddProject";

export default function ProjectsManager() {
  const projects = useQuery(api.projects.get);
  return (
    <div>
      <DataTable columns={columns} data={projects ?? []} />
      <AddProject />
    </div>
  );
}
