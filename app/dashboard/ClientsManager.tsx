/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Field from "@/components/editorial/Field";
import Chip from "@/components/editorial/Chip";
import { Plus, UserCircle2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type {
  ClientProjectSummary,
  ClientWithProjects,
  ProjectStatus,
} from "@/db/types";
import { createClient } from "./actions";

const STATUS_VARIANT: Record<ProjectStatus, "strong" | "soft" | "outline"> = {
  active: "strong",
  paused: "soft",
  complete: "outline",
};

const MAX_VISIBLE_PROJECTS = 4;

export default function ClientsManager({
  initialClients,
}: {
  initialClients: ClientWithProjects[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {initialClients.map((c) => (
        <ClientCard client={c} key={c._id} />
      ))}
      <AddClient />
    </div>
  );
}

function AddClient() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState({
    name: "",
    email: "",
    company: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!state.name.trim()) return;
    setSaving(true);
    try {
      const { id } = await createClient({
        name: state.name,
        email: state.email || null,
        company: state.company || null,
        notes: state.notes || null,
      });
      setState({ name: "", email: "", company: "", notes: "" });
      setOpen(false);
      router.push(`/dashboard/clients/${id}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="rounded-lg min-h-[180px] border-2 border-dashed flex items-center justify-center gap-2 text-stone-500 hover:bg-neutral-200 hover:text-stone-900 transition-all duration-300 cursor-pointer"
        >
          <Plus className="h-5 w-5" />
          <span className="mono text-[11px] uppercase tracking-widest">
            Adicionar cliente
          </span>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo cliente</DialogTitle>
          <DialogDescription className="sr-only">
            Formulário para criar novo cliente
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Field label="Nome">
            <Input
              value={state.name}
              onChange={(e) =>
                setState((s) => ({ ...s, name: e.target.value }))
              }
              autoFocus
            />
          </Field>
          <Field label="Empresa">
            <Input
              value={state.company}
              onChange={(e) =>
                setState((s) => ({ ...s, company: e.target.value }))
              }
            />
          </Field>
          <Field label="Email">
            <Input
              type="email"
              value={state.email}
              onChange={(e) =>
                setState((s) => ({ ...s, email: e.target.value }))
              }
            />
          </Field>
          <Field label="Notas">
            <textarea
              value={state.notes}
              onChange={(e) =>
                setState((s) => ({ ...s, notes: e.target.value }))
              }
              className="w-full border border-stone-300 px-3 py-2 text-sm min-h-20"
              rows={3}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={saving || !state.name.trim()}>
              {saving ? "Criando…" : "Criar e abrir"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ClientCard({ client }: { client: ClientWithProjects }) {
  const visibleProjects = client.projects.slice(0, MAX_VISIBLE_PROJECTS);
  const overflow = client.projects.length - visibleProjects.length;

  return (
    <div className="rounded-lg border-2 p-5 min-h-[180px] flex flex-col gap-4 bg-white">
      <Link
        href={`/dashboard/clients/${client._id}`}
        className="flex items-start gap-3 group"
      >
        {client.avatar ? (
          <img
            src={client.avatar}
            alt=""
            className="h-12 w-12 rounded-full object-cover border border-stone-300 shrink-0"
          />
        ) : (
          <div className="h-12 w-12 rounded-full border border-stone-300 flex items-center justify-center text-stone-400 shrink-0">
            <UserCircle2 className="h-7 w-7" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-base truncate group-hover:underline">
            {client.name}
          </p>
          {client.company && (
            <p className="text-xs text-stone-500 truncate mt-0.5">
              {client.company}
            </p>
          )}
          {client.email && (
            <p className="mono text-[11px] text-stone-600 truncate mt-1">
              {client.email}
            </p>
          )}
        </div>
      </Link>

      {client.notes && (
        <p className="line-clamp-2 text-sm text-stone-600">{client.notes}</p>
      )}

      <div className="mt-auto pt-2 border-t border-stone-100 space-y-2">
        <p className="mono text-[10px] uppercase tracking-widest text-stone-500">
          {client.projects.length === 0
            ? "Sem projetos"
            : `${client.projects.length} ${
                client.projects.length === 1 ? "projeto" : "projetos"
              }`}
        </p>
        {visibleProjects.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {visibleProjects.map((p) => (
              <ProjectChip key={p._id} project={p} />
            ))}
            {overflow > 0 && (
              <Link
                href={`/dashboard/clients/${client._id}`}
                className="mono text-[10px] uppercase tracking-widest text-stone-500 hover:text-stone-900 self-center"
              >
                +{overflow}
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectChip({ project }: { project: ClientProjectSummary }) {
  return (
    <Link
      href={`/dashboard/projects/${project._id}`}
      className="hover:opacity-80 transition-opacity"
      title={project.name}
    >
      <Chip variant={STATUS_VARIANT[project.status]} className="normal-case tracking-normal">
        <span className="truncate inline-block max-w-[10rem] align-bottom">
          {project.name}
        </span>
      </Chip>
    </Link>
  );
}
