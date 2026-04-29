"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Field from "@/components/editorial/Field";
import type {
  ProjectDetail,
  ProjectStatus,
  ProjectType,
} from "@/db/types";
import { updateProject } from "../../actions";
import { toProjectInput } from "./project-input";

const STATUSES: { value: ProjectStatus; label: string }[] = [
  { value: "active", label: "Ativo" },
  { value: "paused", label: "Pausado" },
  { value: "complete", label: "Concluído" },
];

const TYPES: { value: ProjectType; label: string }[] = [
  { value: "personal", label: "Pessoal" },
  { value: "commercial", label: "Comercial" },
];

function toState(project: ProjectDetail) {
  return {
    name: project.name,
    description: project.description,
    type: project.type,
    year: project.year ?? "",
    link: project.link ?? "",
    source: project.source ?? "",
    status: project.status,
    isPublic: project.isPublic,
  };
}

export default function ProjectDetailsDialog({
  project,
  open,
  onOpenChange,
}: {
  project: ProjectDetail;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const router = useRouter();
  const [state, setState] = useState(() => toState(project));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setState(toState(project));
  }, [open, project]);

  const set = <K extends keyof typeof state>(k: K, v: (typeof state)[K]) =>
    setState((prev) => ({ ...prev, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProject(project._id, {
        ...toProjectInput(project),
        name: state.name,
        description: state.description,
        type: state.type,
        year: state.year || null,
        link: state.link || null,
        source: state.source || null,
        status: state.status,
        isPublic: state.isPublic,
      });
      onOpenChange(false);
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar detalhes</DialogTitle>
          <DialogDescription className="sr-only">
            Formulário para editar os detalhes gerais do projeto
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Field label="Nome">
            <Input
              value={state.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </Field>
          <Field label="Descrição (intro)">
            <Input
              value={state.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Tipo">
              <select
                value={state.type}
                onChange={(e) => set("type", e.target.value as ProjectType)}
                className="w-full border border-stone-300 px-3 py-2 text-sm"
              >
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Ano">
              <Input
                value={state.year}
                onChange={(e) => set("year", e.target.value)}
              />
            </Field>
            <Field label="Status">
              <select
                value={state.status}
                onChange={(e) =>
                  set("status", e.target.value as ProjectStatus)
                }
                className="w-full border border-stone-300 px-3 py-2 text-sm"
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Link ao vivo">
              <Input
                value={state.link}
                onChange={(e) => set("link", e.target.value)}
              />
            </Field>
            <Field label="Repositório">
              <Input
                value={state.source}
                onChange={(e) => set("source", e.target.value)}
              />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm pt-1">
            <input
              type="checkbox"
              checked={state.isPublic}
              onChange={(e) => set("isPublic", e.target.checked)}
            />
            <span>Visível no portfólio público</span>
          </label>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Salvando…" : "Salvar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
