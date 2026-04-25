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
import { Plus, UserCircle2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Client } from "@/db/types";
import { createClient } from "./actions";

export default function ClientsManager({
  initialClients,
}: {
  initialClients: Client[];
}) {
  return (
    <div className="flex flex-wrap md:justify-start justify-center gap-4">
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
        <div className="rounded-lg w-40 h-24 border-2 flex items-center justify-center hover:bg-neutral-200 transition-all duration-300 cursor-pointer">
          <Plus />
        </div>
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

function ClientCard({ client }: { client: Client }) {
  return (
    <Link
      href={`/dashboard/clients/${client._id}`}
      className="rounded-lg w-40 h-24 border-2 flex items-center gap-3 px-3 hover:bg-neutral-200 transition-all duration-300 cursor-pointer"
    >
      {client.avatar ? (
        <img
          src={client.avatar}
          alt=""
          className="h-10 w-10 rounded-full object-cover border border-stone-300 shrink-0"
        />
      ) : (
        <div className="h-10 w-10 rounded-full border border-stone-300 flex items-center justify-center text-stone-400 shrink-0">
          <UserCircle2 className="h-6 w-6" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{client.name}</p>
        {client.company && (
          <p className="text-xs text-stone-500 truncate">{client.company}</p>
        )}
      </div>
    </Link>
  );
}
