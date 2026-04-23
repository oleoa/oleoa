"use client";

import { useMemo } from "react";
import { buildColumns } from "./columns";
import { DataTable } from "./data-table";
import AddProject from "./AddProject";
import type { Project, Stack } from "@/db/types";

export default function ProjectsManager({
  initialProjects,
  allStacks,
}: {
  initialProjects: Project[];
  allStacks: Stack[];
}) {
  const columns = useMemo(() => buildColumns({ allStacks }), [allStacks]);
  return (
    <div>
      <DataTable columns={columns} data={initialProjects} />
      <AddProject />
    </div>
  );
}
