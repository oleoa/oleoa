/* eslint-disable @next/next/no-img-element */
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Project, Stack } from "@/db/types";
import {
  updateProject,
  setProjectCover,
  removeProjectCover,
  addStackToProject,
  removeStackFromProject,
  deleteProject,
} from "./actions";

export function UpdateProjectDialog({
  project,
  allStacks,
  children,
}: {
  project: Project;
  allStacks: Stack[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [state, setState] = useState({
    name: project.name,
    description: project.description,
    link: project.link ?? "",
    source: project.source ?? "",
    slug: project.slug ?? "",
    client: project.client ?? "",
    role: project.role ?? "",
    year: project.year ?? "",
    summary: project.summary ?? "",
    problem: project.problem ?? "",
    approach: project.approach ?? "",
    outcome: project.outcome ?? "",
    featured: project.featured,
    order: project.order?.toString() ?? "",
  });

  useEffect(() => {
    setState({
      name: project.name,
      description: project.description,
      link: project.link ?? "",
      source: project.source ?? "",
      slug: project.slug ?? "",
      client: project.client ?? "",
      role: project.role ?? "",
      year: project.year ?? "",
      summary: project.summary ?? "",
      problem: project.problem ?? "",
      approach: project.approach ?? "",
      outcome: project.outcome ?? "",
      featured: project.featured,
      order: project.order?.toString() ?? "",
    });
  }, [project]);

  const [coverFile, setCoverFile] = useState<File | null>(null);

  const handleUpdate = async () => {
    if (coverFile) {
      const formData = new FormData();
      formData.append("cover", coverFile);
      await setProjectCover(project._id, formData);
      setCoverFile(null);
    }
    await updateProject(project._id, {
      name: state.name,
      description: state.description,
      link: state.link || null,
      source: state.source || null,
      slug: state.slug || null,
      client: state.client || null,
      role: state.role || null,
      year: state.year || null,
      summary: state.summary || null,
      problem: state.problem || null,
      approach: state.approach || null,
      outcome: state.outcome || null,
      featured: state.featured,
      order: state.order ? Number(state.order) : null,
    });
    router.refresh();
  };

  const handleRemoveCover = async () => {
    await removeProjectCover(project._id);
    router.refresh();
  };

  const set = <K extends keyof typeof state>(
    key: K,
    value: (typeof state)[K],
  ) => setState((prev) => ({ ...prev, [key]: value }));

  return (
    <Dialog>
      {children}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="pb-4">Editar {project.name}</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-3">
              <Field label="Nome">
                <Input
                  value={state.name}
                  onChange={(e) => set("name", e.target.value)}
                />
              </Field>
              <Field label="Slug (URL)">
                <Input
                  value={state.slug}
                  onChange={(e) => set("slug", e.target.value)}
                  placeholder="strutura-crm"
                />
              </Field>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Cliente">
                  <Input
                    value={state.client}
                    onChange={(e) => set("client", e.target.value)}
                  />
                </Field>
                <Field label="Função">
                  <Input
                    value={state.role}
                    onChange={(e) => set("role", e.target.value)}
                  />
                </Field>
                <Field label="Ano">
                  <Input
                    value={state.year}
                    onChange={(e) => set("year", e.target.value)}
                  />
                </Field>
              </div>
              <Field label="Resumo editorial">
                <Input
                  value={state.summary}
                  onChange={(e) => set("summary", e.target.value)}
                />
              </Field>
              <Field label="Descrição (intro)">
                <Input
                  value={state.description}
                  onChange={(e) => set("description", e.target.value)}
                />
              </Field>
              <Field label="O problema">
                <textarea
                  value={state.problem}
                  onChange={(e) => set("problem", e.target.value)}
                  className="w-full border border-stone-300 px-3 py-2 text-sm min-h-24"
                  rows={4}
                />
              </Field>
              <Field label="A abordagem">
                <textarea
                  value={state.approach}
                  onChange={(e) => set("approach", e.target.value)}
                  className="w-full border border-stone-300 px-3 py-2 text-sm min-h-24"
                  rows={4}
                />
              </Field>
              <Field label="O resultado">
                <textarea
                  value={state.outcome}
                  onChange={(e) => set("outcome", e.target.value)}
                  className="w-full border border-stone-300 px-3 py-2 text-sm min-h-24"
                  rows={4}
                />
              </Field>
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
              <div className="grid grid-cols-2 gap-3 items-end">
                <Field label="Ordem">
                  <Input
                    type="number"
                    value={state.order}
                    onChange={(e) => set("order", e.target.value)}
                  />
                </Field>
                <label className="flex items-center gap-2 pb-2">
                  <input
                    type="checkbox"
                    checked={state.featured}
                    onChange={(e) => set("featured", e.target.checked)}
                  />
                  <span className="text-sm">Destaque (case-study)</span>
                </label>
              </div>
              <Field label="Capa (cover)">
                <div className="flex items-center gap-3">
                  {project.cover && (
                    <img
                      src={project.cover}
                      alt=""
                      className="w-16 h-12 object-cover border border-stone-300"
                    />
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
                  />
                  {project.cover && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveCover}
                    >
                      Remover
                    </Button>
                  )}
                </div>
              </Field>
              <div className="pt-2 space-y-3">
                <AddStackPopover project={project} allStacks={allStacks} />
                <StackList
                  stacks={project.stacks}
                  projectId={project._id}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <DialogTrigger asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogTrigger>
                <DialogTrigger asChild>
                  <Button onClick={handleUpdate}>Atualizar</Button>
                </DialogTrigger>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="mono text-[10px] uppercase tracking-widest text-stone-500">
        {label}
      </p>
      {children}
    </div>
  );
}

function StackList({
  stacks,
  projectId,
}: {
  stacks: Stack[];
  projectId: string;
}) {
  const router = useRouter();
  const handleRemove = async (stackId: string) => {
    await removeStackFromProject(projectId, stackId);
    router.refresh();
  };
  return (
    <div className="flex flex-wrap gap-2">
      {stacks.map((stack) => (
        <div
          key={stack._id}
          className="px-3 py-1 border border-stone-300 text-xs flex items-center gap-2"
        >
          {stack.name}
          <button onClick={() => handleRemove(stack._id)}>
            <Trash2 className="h-3 w-3 text-red-500 cursor-pointer" />
          </button>
        </div>
      ))}
    </div>
  );
}

function AddStackPopover({
  project,
  allStacks,
}: {
  project: Project;
  allStacks: Stack[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const handleSelect = async (stackId: string) => {
    await addStackToProject(project._id, stackId);
    setOpen(false);
    router.refresh();
  };
  return (
    <div className="flex items-center space-x-4">
      <p className="mono text-[10px] uppercase tracking-widest text-stone-500">
        Stack
      </p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            + Adicionar
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="right" align="start">
          <Command>
            <CommandInput placeholder="Adicionar stack..." />
            <CommandList>
              <CommandEmpty>Nenhum resultado.</CommandEmpty>
              <CommandGroup>
                {allStacks.map((stack) => (
                  <CommandItem
                    key={stack._id}
                    value={stack.name}
                    onSelect={() => handleSelect(stack._id)}
                  >
                    {stack.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function DeleteProjectDialog({
  project,
  children,
}: {
  project: Project;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const handleDelete = async () => {
    await deleteProject(project._id);
    router.refresh();
  };

  return (
    <AlertDialog>
      {children}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não pode ser desfeita. O projeto{" "}
            {"'" + project.name + "'"} será removido permanentemente.
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
  );
}
