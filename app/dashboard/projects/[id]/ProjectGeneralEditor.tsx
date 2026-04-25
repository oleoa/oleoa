"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Field from "@/components/editorial/Field";
import Chip from "@/components/editorial/Chip";
import SectionCard from "@/components/editorial/SectionCard";
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

const STATUS_LABEL: Record<ProjectStatus, string> = {
  active: "ativo",
  paused: "pausado",
  complete: "concluído",
};

const STATUS_VARIANT: Record<ProjectStatus, "strong" | "soft" | "outline"> = {
  active: "strong",
  paused: "soft",
  complete: "outline",
};

const TYPE_LABEL: Record<ProjectType, string> = {
  personal: "pessoal",
  commercial: "comercial",
};

export default function ProjectGeneralEditor({
  project,
}: {
  project: ProjectDetail;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [state, setState] = useState(() => toState(project));
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof typeof state>(k: K, v: (typeof state)[K]) =>
    setState((prev) => ({ ...prev, [k]: v }));

  const handleEdit = () => {
    setState(toState(project));
    setMode("edit");
  };

  const handleCancel = () => {
    setState(toState(project));
    setMode("view");
  };

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
      setMode("view");
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <SectionCard
      title="Geral"
      mode={mode}
      onEdit={handleEdit}
      onCancel={handleCancel}
    >
      {mode === "view" ? (
        <dl className="divide-y divide-stone-100">
          <ViewRow label="Nome" value={project.name} />
          <ViewRow label="Descrição" value={project.description} multiline />
          <ViewRow
            label="Tipo"
            render={<Chip variant="soft">{TYPE_LABEL[project.type]}</Chip>}
          />
          <ViewRow
            label="Status"
            render={
              <Chip variant={STATUS_VARIANT[project.status]}>
                {STATUS_LABEL[project.status]}
              </Chip>
            }
          />
          <ViewRow label="Ano" value={project.year} />
          <ViewRow
            label="Link"
            render={
              project.link ? (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm underline truncate block"
                >
                  {project.link}
                </a>
              ) : null
            }
          />
          <ViewRow
            label="Repositório"
            render={
              project.source ? (
                <a
                  href={project.source}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm underline truncate block"
                >
                  {project.source}
                </a>
              ) : null
            }
          />
          <ViewRow
            label="Visibilidade"
            render={
              <Chip variant={project.isPublic ? "soft" : "outline"}>
                {project.isPublic ? "público" : "privado"}
              </Chip>
            }
          />
        </dl>
      ) : (
        <>
          <Field label="Nome">
            <Input value={state.name} onChange={(e) => set("name", e.target.value)} />
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
              <Input value={state.year} onChange={(e) => set("year", e.target.value)} />
            </Field>
            <Field label="Status">
              <select
                value={state.status}
                onChange={(e) => set("status", e.target.value as ProjectStatus)}
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
              <Input value={state.link} onChange={(e) => set("link", e.target.value)} />
            </Field>
            <Field label="Repositório">
              <Input value={state.source} onChange={(e) => set("source", e.target.value)} />
            </Field>
          </div>
          <div className="flex gap-6 pt-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={state.isPublic}
                onChange={(e) => set("isPublic", e.target.checked)}
              />
              <span>Visível no portfólio público</span>
            </label>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Salvando…" : "Salvar"}
            </Button>
          </div>
        </>
      )}
    </SectionCard>
  );
}

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

function ViewRow({
  label,
  value,
  render,
  multiline,
}: {
  label: string;
  value?: string | null;
  render?: React.ReactNode;
  multiline?: boolean;
}) {
  const content =
    render !== undefined
      ? render ?? <span className="text-stone-400 text-sm">—</span>
      : value && value.trim()
        ? value
        : null;
  return (
    <div
      className={
        multiline
          ? "py-2 space-y-1"
          : "grid grid-cols-[7rem_1fr] gap-3 py-2 items-baseline"
      }
    >
      <dt className="mono text-[10px] uppercase tracking-widest text-stone-500">
        {label}
      </dt>
      <dd
        className={
          multiline
            ? "text-sm whitespace-pre-wrap text-stone-800"
            : "text-sm text-stone-800 min-w-0"
        }
      >
        {content ?? <span className="text-stone-400">—</span>}
      </dd>
    </div>
  );
}
