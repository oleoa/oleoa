"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpDown, List } from "lucide-react";
import { buildColumns } from "./columns";
import { DataTable } from "./data-table";
import AddProject from "./AddProject";
import Chip from "@/components/editorial/Chip";
import { Button } from "@/components/ui/button";
import ProjectOrderEditor from "./projects/ProjectOrderEditor";
import type { Project, ProjectStatus } from "@/db/types";

type Filter = "all" | ProjectStatus;
type View = "table" | "order";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Ativos" },
  { value: "paused", label: "Pausados" },
  { value: "complete", label: "Concluídos" },
];

export default function ProjectsManager({
  initialProjects,
}: {
  initialProjects: Project[];
}) {
  const router = useRouter();
  const [view, setView] = useState<View>("table");
  const [filter, setFilter] = useState<Filter>("all");
  const columns = useMemo(() => buildColumns(), []);
  const openProject = (p: Project) =>
    router.push(`/dashboard/projects/${p._id}`);
  const filtered = useMemo(
    () =>
      filter === "all"
        ? initialProjects
        : initialProjects.filter((p) => p.status === filter),
    [initialProjects, filter]
  );
  const commercial = useMemo(
    () => filtered.filter((p) => p.type === "commercial"),
    [filtered]
  );
  const personal = useMemo(
    () => filtered.filter((p) => p.type === "personal"),
    [filtered]
  );

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        {view === "table" ? (
          <div className="flex items-center gap-2 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className="cursor-pointer"
              >
                <Chip variant={filter === f.value ? "strong" : "outline"}>
                  {f.label}
                </Chip>
              </button>
            ))}
          </div>
        ) : (
          <p className="mono text-xs uppercase tracking-widest text-stone-500">
            Ordem do grid público
          </p>
        )}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setView(view === "table" ? "order" : "table")}
          >
            {view === "table" ? (
              <>
                <ArrowUpDown className="h-4 w-4" /> Reordenar
              </>
            ) : (
              <>
                <List className="h-4 w-4" /> Voltar pra lista
              </>
            )}
          </Button>
          {view === "table" && <AddProject />}
        </div>
      </div>
      {view === "table" ? (
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="mono-label uppercase tracking-widest text-xs text-stone-500">
              Comercial
            </h3>
            <DataTable columns={columns} data={commercial} onRowClick={openProject} />
          </div>
          <div className="space-y-2">
            <h3 className="mono-label uppercase tracking-widest text-xs text-stone-500">
              Pessoal
            </h3>
            <DataTable columns={columns} data={personal} onRowClick={openProject} />
          </div>
        </div>
      ) : (
        <ProjectOrderEditor
          projects={initialProjects}
          onSaved={() => setView("table")}
        />
      )}
    </section>
  );
}
