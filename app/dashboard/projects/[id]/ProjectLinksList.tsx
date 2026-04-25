"use client";

import { useState, type ReactNode } from "react";
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
  const cls = "h-6 w-6";
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
    <section>
      <div className="mono text-[10px] uppercase tracking-widest text-stone-500 mb-3">
        Links externos
      </div>
      <div className="flex flex-wrap gap-3">
        {links.map((link) => (
          <LinkTile key={link._id} link={link} />
        ))}
        <AddLinkDialog
          projectId={projectId}
          trigger={
            <button
              type="button"
              aria-label="Adicionar link"
              className="h-20 w-56 border border-dashed border-stone-300 flex items-center justify-center text-stone-400 hover:text-stone-700 hover:border-stone-500 transition-colors cursor-pointer"
            >
              <Plus className="h-5 w-5" />
            </button>
          }
        />
      </div>
    </section>
  );
}

function LinkTile({ link }: { link: ProjectLink }) {
  const router = useRouter();
  const handleDelete = async () => {
    await deleteProjectLink(link._id);
    router.refresh();
  };
  return (
    <div className="group relative h-20 w-56">
      <a
        href={link.url}
        target="_blank"
        rel="noreferrer"
        className="h-full w-full bg-white border border-stone-300 flex items-center gap-3 px-4 text-stone-700 hover:border-stone-500 hover:text-stone-900 transition-colors"
        title={link.label}
      >
        <span className="shrink-0">{iconFor(link.kind)}</span>
        <span className="mono text-[11px] uppercase tracking-widest text-stone-600 truncate flex-1 min-w-0">
          {link.label}
        </span>
      </a>
      <div className="absolute top-1 right-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <EditLinkDialog link={link} />
        <button
          type="button"
          onClick={handleDelete}
          aria-label={`Remover ${link.label}`}
          className="bg-white/80 backdrop-blur-sm p-0.5 rounded cursor-pointer"
        >
          <Trash2 className="h-3 w-3 text-red-500" />
        </button>
      </div>
    </div>
  );
}

function AddLinkDialog({
  projectId,
  trigger,
}: {
  projectId: string;
  trigger?: ReactNode;
}) {
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
        {trigger ?? (
          <Button type="button" variant="outline" size="sm">
            <Plus className="h-4 w-4" /> Adicionar link
          </Button>
        )}
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
        <button
          type="button"
          aria-label={`Editar ${link.label}`}
          className="bg-white/80 backdrop-blur-sm p-0.5 rounded cursor-pointer"
        >
          <Pencil className="h-3 w-3 text-stone-600" />
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
