/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserCircle2, Pencil, X, Plus, ExternalLink } from "lucide-react";
import SectionCard from "@/components/editorial/SectionCard";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import type { Client, ProjectDetail } from "@/db/types";
import {
  createClient,
  updateClient,
  updateProject,
  setClientAvatar,
  removeClientAvatar,
} from "../../actions";
import { toProjectInput } from "./project-input";

export default function ClientPicker({
  project,
  allClients,
}: {
  project: ProjectDetail;
  allClients: Client[];
}) {
  const router = useRouter();
  const selected = project.clientRef;
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleSelect = async (clientId: string | null) => {
    setOpen(false);
    await updateProject(project._id, {
      ...toProjectInput(project),
      clientId,
    });
    router.refresh();
  };

  return (
    <SectionCard
      title="Cliente"
      action={
        selected && (
          <Link
            href={`/dashboard/clients/${selected._id}`}
            className="mono text-[10px] uppercase tracking-widest text-stone-500 hover:text-stone-900 inline-flex items-center gap-1"
          >
            ver <ExternalLink className="h-3 w-3" />
          </Link>
        )
      }
    >
      <div className="flex items-center gap-3">
        {selected?.avatar ? (
          <img
            src={selected.avatar}
            alt=""
            className="h-12 w-12 rounded-full object-cover border border-stone-300"
          />
        ) : (
          <div className="h-12 w-12 rounded-full border border-stone-300 flex items-center justify-center text-stone-400">
            <UserCircle2 className="h-7 w-7" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">
            {selected?.name ?? (
              <span className="text-stone-500 italic">
                Nenhum cliente associado
              </span>
            )}
          </p>
          {selected?.company && (
            <p className="text-xs text-stone-500 truncate">
              {selected.company}
            </p>
          )}
          {selected?.email && (
            <p className="text-xs text-stone-500 truncate">{selected.email}</p>
          )}
        </div>
        {selected && <EditClientDialog client={selected} />}
      </div>
      <div className="flex items-center flex-wrap gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              {selected ? "Trocar cliente" : "Selecionar cliente"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" side="bottom" align="start">
            <Command>
              <CommandInput placeholder="Buscar cliente..." />
              <CommandList>
                <CommandEmpty>Nenhum cliente.</CommandEmpty>
                <CommandGroup>
                  {allClients.map((c) => (
                    <CommandItem
                      key={c._id}
                      value={c.name}
                      onSelect={() => handleSelect(c._id)}
                    >
                      {c.name}
                      {c.company && (
                        <span className="ml-2 text-stone-500 text-xs">
                          {c.company}
                        </span>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setCreating(true)}
        >
          <Plus className="h-4 w-4" /> Novo cliente
        </Button>
        {selected && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleSelect(null)}
          >
            <X className="h-4 w-4" /> Remover
          </Button>
        )}
      </div>
      <CreateClientDialog
        open={creating}
        onOpenChange={setCreating}
        onCreated={handleSelect}
      />
    </SectionCard>
  );
}

function CreateClientDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: (id: string) => void;
}) {
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
      onOpenChange(false);
      onCreated(id);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={saving}>
              {saving ? "Criando…" : "Criar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditClientDialog({ client }: { client: Client }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState({
    name: client.name,
    email: client.email ?? "",
    company: client.company ?? "",
    notes: client.notes ?? "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleSave = async () => {
    if (avatarFile) {
      const fd = new FormData();
      fd.append("avatar", avatarFile);
      await setClientAvatar(client._id, fd);
      setAvatarFile(null);
    }
    await updateClient(client._id, {
      name: state.name,
      email: state.email || null,
      company: state.company || null,
      notes: state.notes || null,
    });
    setOpen(false);
    router.refresh();
  };

  const handleRemoveAvatar = async () => {
    await removeClientAvatar(client._id);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" aria-label="Editar cliente">
          <Pencil className="h-3.5 w-3.5 text-stone-500 cursor-pointer" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar cliente</DialogTitle>
          <DialogDescription className="sr-only">
            Formulário para editar o cliente
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Field label="Avatar">
            <div className="flex items-center gap-3">
              {client.avatar && (
                <img
                  src={client.avatar}
                  alt=""
                  className="h-12 w-12 rounded-full object-cover border border-stone-300"
                />
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
              />
              {client.avatar && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveAvatar}
                >
                  Remover
                </Button>
              )}
            </div>
          </Field>
          <Field label="Nome">
            <Input
              value={state.name}
              onChange={(e) =>
                setState((s) => ({ ...s, name: e.target.value }))
              }
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
            <Button onClick={handleSave}>Salvar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
