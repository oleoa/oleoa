"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Github,
  Database,
  FileText,
  Link as LinkIcon,
  Triangle,
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
import { addProjectLink, updateProjectLink } from "../../actions";

export const KINDS: { value: ProjectLinkKind; label: string }[] = [
  { value: "vercel", label: "Vercel" },
  { value: "neon", label: "Neon" },
  { value: "github", label: "GitHub" },
  { value: "docs", label: "Docs" },
  { value: "other", label: "Outro" },
];

export function iconFor(kind: ProjectLinkKind | null, className = "h-6 w-6") {
  switch (kind) {
    case "vercel":
      return <Triangle className={className} />;
    case "github":
      return <Github className={className} />;
    case "neon":
      return <Database className={className} />;
    case "docs":
      return <FileText className={className} />;
    default:
      return <LinkIcon className={className} />;
  }
}

export function AddLinkDialog({
  projectId,
  trigger,
  defaultKind = "other",
}: {
  projectId: string;
  trigger: ReactNode;
  defaultKind?: ProjectLinkKind;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<{
    label: string;
    url: string;
    kind: ProjectLinkKind;
  }>({ label: "", url: "", kind: defaultKind });

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) setState({ label: "", url: "", kind: defaultKind });
  };

  const handleAdd = async () => {
    if (!state.label.trim() || !state.url.trim()) return;
    await addProjectLink(projectId, {
      label: state.label,
      url: state.url,
      kind: state.kind,
    });
    setState({ label: "", url: "", kind: defaultKind });
    setOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
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

export function EditLinkDialog({
  link,
  trigger,
}: {
  link: ProjectLink;
  trigger: ReactNode;
}) {
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
      <DialogTrigger asChild>{trigger}</DialogTrigger>
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
