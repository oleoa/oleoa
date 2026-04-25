/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Chip from "@/components/editorial/Chip";
import type { ProjectDetail, ProjectStatus } from "@/db/types";
import { deleteProject } from "../../actions";

const STATUS_LABELS: Record<ProjectStatus, string> = {
  active: "ativo",
  paused: "pausado",
  complete: "concluído",
};

const STATUS_VARIANT: Record<ProjectStatus, "strong" | "soft" | "outline"> = {
  active: "strong",
  paused: "soft",
  complete: "outline",
};

export default function ProjectHeader({ project }: { project: ProjectDetail }) {
  const router = useRouter();
  const handleDelete = async () => {
    await deleteProject(project._id);
    router.push("/dashboard/projects");
  };

  return (
    <header className="flex items-start justify-between gap-6">
      <div className="flex-1 min-w-0 space-y-3">
        <Link
          href="/dashboard/projects"
          className="mono text-[10px] uppercase tracking-widest text-stone-500 inline-flex items-center gap-1 hover:text-stone-900"
        >
          <ChevronLeft className="h-3 w-3" /> Projetos
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <Chip variant={STATUS_VARIANT[project.status]}>
            {STATUS_LABELS[project.status]}
          </Chip>
          <Chip variant={project.type === "commercial" ? "strong" : "outline"}>
            {project.type === "commercial" ? "comercial" : "pessoal"}
          </Chip>
          {!project.isPublic && <Chip variant="outline">privado</Chip>}
        </div>
        <h1 className="display text-4xl md:text-5xl font-black tracking-tight leading-none break-words">
          {project.name}
        </h1>
        {project.clientRef && (
          <div className="flex items-center gap-2 text-sm text-stone-600">
            {project.clientRef.avatar ? (
              <img
                src={project.clientRef.avatar}
                alt=""
                className="h-6 w-6 rounded-full object-cover border border-stone-300"
              />
            ) : (
              <UserCircle2 className="h-6 w-6 text-stone-400" />
            )}
            <span>{project.clientRef.name}</span>
            {project.clientRef.company && (
              <span className="text-stone-400">· {project.clientRef.company}</span>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              Apagar projeto
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Essa ação não pode ser desfeita. {`"${project.name}"`}, seus
                TODOs, links e capa serão removidos permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button variant="destructive" onClick={handleDelete}>
                  Apagar
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </header>
  );
}
