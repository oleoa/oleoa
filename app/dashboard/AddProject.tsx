"use client";

import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Field from "@/components/editorial/Field";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addProject } from "./actions";

export default function AddProject() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const { id } = await addProject({
        name,
        description: description || name,
        type: "personal",
        link: null,
        source: null,
        year: null,
        position: null,
        status: "active",
        isPublic: true,
        budgetAmount: null,
        budgetCurrency: "BRL",
        budgetStatus: "pending",
        clientId: null,
      });
      setName("");
      setDescription("");
      setOpen(false);
      router.push(`/dashboard/projects/${id}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4" /> Novo projeto
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo projeto</DialogTitle>
          <DialogDescription>
            Você preenche o resto na página do projeto.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Field label="Nome">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Strutura CRM"
              autoFocus
            />
          </Field>
          <Field label="Descrição curta">
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Uma frase sobre o que é."
            />
          </Field>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAdd} disabled={saving || !name.trim()}>
              {saving ? "Criando…" : "Criar e abrir"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
