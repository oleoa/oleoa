"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Github,
  Figma,
  Database,
  FileText,
  Link as LinkIcon,
  Triangle,
  Trash2,
  Pencil,
  Plus,
  ExternalLink,
} from "lucide-react";
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
import SectionCard from "@/components/editorial/SectionCard";
import type { ProjectLink, ProjectLinkKind } from "@/db/types";
import {
  addProjectLink,
  updateProjectLink,
  deleteProjectLink,
} from "../../actions";

const KINDS: { value: ProjectLinkKind; label: string }[] = [
  { value: "vercel", label: "Vercel" },
  { value: "neon", label: "Neon" },
  { value: "github", label: "GitHub" },
  { value: "figma", label: "Figma" },
  { value: "docs", label: "Docs" },
  { value: "other", label: "Outro" },
];

function iconFor(kind: ProjectLinkKind | null) {
  const cls = "h-4 w-4";
  switch (kind) {
    case "vercel":
      return <Triangle className={cls} />;
    case "github":
      return <Github className={cls} />;
    case "figma":
      return <Figma className={cls} />;
    case "neon":
      return <Database className={cls} />;
    case "docs":
      return <FileText className={cls} />;
    default:
      return <LinkIcon className={cls} />;
  }
}

export default function ProjectLinksList({
  projectId,
  links,
}: {
  projectId: string;
  links: ProjectLink[];
}) {
  return (
    <SectionCard
      title="Links externos"
      action={<AddLinkDialog projectId={projectId} />}
    >
      <ul className="divide-y divide-stone-200 border border-stone-200">
        {links.length === 0 && (
          <li className="px-3 py-4 text-sm text-stone-500">
            Nenhum link adicionado.
          </li>
        )}
        {links.map((link) => (
          <LinkRow key={link._id} link={link} />
        ))}
      </ul>
    </SectionCard>
  );
}

function LinkRow({ link }: { link: ProjectLink }) {
  const router = useRouter();
  const handleDelete = async () => {
    await deleteProjectLink(link._id);
    router.refresh();
  };
  return (
    <li className="flex items-center gap-2 px-3 py-2 text-sm">
      <span className="text-stone-600">{iconFor(link.kind)}</span>
      <a
        href={link.url}
        target="_blank"
        rel="noreferrer"
        className="flex-1 truncate hover:underline"
      >
        {link.label}
      </a>
      <ExternalLink className="h-3 w-3 text-stone-400" />
      <EditLinkDialog link={link} />
      <button
        type="button"
        onClick={handleDelete}
        aria-label={`Remover ${link.label}`}
      >
        <Trash2 className="h-3.5 w-3.5 text-red-500 cursor-pointer" />
      </button>
    </li>
  );
}

function AddLinkDialog({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<{
    label: string;
    url: string;
    kind: ProjectLinkKind;
  }>({ label: "", url: "", kind: "other" });

  const handleAdd = async () => {
    if (!state.label.trim() || !state.url.trim()) return;
    await addProjectLink(projectId, {
      label: state.label,
      url: state.url,
      kind: state.kind,
    });
    setState({ label: "", url: "", kind: "other" });
    setOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <Plus className="h-4 w-4" /> Adicionar link
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar link externo</DialogTitle>
          <DialogDescription className="sr-only">
            Formulário para adicionar link externo do projeto
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Field label="Rótulo">
            <Input
              value={state.label}
              onChange={(e) =>
                setState((s) => ({ ...s, label: e.target.value }))
              }
              placeholder="Dashboard Vercel"
            />
          </Field>
          <Field label="URL">
            <Input
              value={state.url}
              onChange={(e) =>
                setState((s) => ({ ...s, url: e.target.value }))
              }
              placeholder="https://..."
            />
          </Field>
          <Field label="Tipo">
            <select
              value={state.kind}
              onChange={(e) =>
                setState((s) => ({
                  ...s,
                  kind: e.target.value as ProjectLinkKind,
                }))
              }
              className="w-full border border-stone-300 px-3 py-2 text-sm"
            >
              {KINDS.map((k) => (
                <option key={k.value} value={k.value}>
                  {k.label}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAdd}>Adicionar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditLinkDialog({ link }: { link: ProjectLink }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState({
    label: link.label,
    url: link.url,
    kind: link.kind ?? ("other" as ProjectLinkKind),
  });

  const handleSave = async () => {
    await updateProjectLink(link._id, state);
    setOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" aria-label={`Editar ${link.label}`}>
          <Pencil className="h-3.5 w-3.5 text-stone-500 cursor-pointer" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar link</DialogTitle>
          <DialogDescription className="sr-only">
            Formulário para editar o link externo
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Field label="Rótulo">
            <Input
              value={state.label}
              onChange={(e) =>
                setState((s) => ({ ...s, label: e.target.value }))
              }
            />
          </Field>
          <Field label="URL">
            <Input
              value={state.url}
              onChange={(e) =>
                setState((s) => ({ ...s, url: e.target.value }))
              }
            />
          </Field>
          <Field label="Tipo">
            <select
              value={state.kind}
              onChange={(e) =>
                setState((s) => ({
                  ...s,
                  kind: e.target.value as ProjectLinkKind,
                }))
              }
              className="w-full border border-stone-300 px-3 py-2 text-sm"
            >
              {KINDS.map((k) => (
                <option key={k.value} value={k.value}>
                  {k.label}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
