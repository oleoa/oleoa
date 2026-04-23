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

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addProject } from "./actions";

type FormState = {
  name: string;
  description: string;
  link: string;
  source: string;
  slug: string;
  client: string;
  role: string;
  year: string;
  summary: string;
  problem: string;
  approach: string;
  outcome: string;
  featured: boolean;
  order: string;
};

const empty: FormState = {
  name: "",
  description: "",
  link: "",
  source: "",
  slug: "",
  client: "",
  role: "",
  year: "",
  summary: "",
  problem: "",
  approach: "",
  outcome: "",
  featured: false,
  order: "",
};

export default function AddProject() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(empty);

  const handleAdd = async () => {
    await addProject({
      name: form.name,
      description: form.description,
      link: form.link || null,
      source: form.source || null,
      slug: form.slug || null,
      client: form.client || null,
      role: form.role || null,
      year: form.year || null,
      summary: form.summary || null,
      problem: form.problem || null,
      approach: form.approach || null,
      outcome: form.outcome || null,
      featured: form.featured,
      order: form.order ? Number(form.order) : null,
    });
    setForm(empty);
    router.refresh();
  };

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="py-2 w-full">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full" variant="outline">
            <Plus /> Novo projeto
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="pb-4">Adicionar projeto</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-3">
                <Field label="Nome">
                  <Input
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                  />
                </Field>
                <Field label="Slug (URL)">
                  <Input
                    value={form.slug}
                    onChange={(e) => set("slug", e.target.value)}
                    placeholder="strutura-crm"
                  />
                </Field>
                <div className="grid grid-cols-3 gap-3">
                  <Field label="Cliente">
                    <Input
                      value={form.client}
                      onChange={(e) => set("client", e.target.value)}
                    />
                  </Field>
                  <Field label="Função">
                    <Input
                      value={form.role}
                      onChange={(e) => set("role", e.target.value)}
                    />
                  </Field>
                  <Field label="Ano">
                    <Input
                      value={form.year}
                      onChange={(e) => set("year", e.target.value)}
                    />
                  </Field>
                </div>
                <Field label="Resumo editorial">
                  <Input
                    value={form.summary}
                    onChange={(e) => set("summary", e.target.value)}
                    placeholder="Uma linha que vende o projeto."
                  />
                </Field>
                <Field label="Descrição (intro)">
                  <Input
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                  />
                </Field>
                <Field label="O problema">
                  <textarea
                    value={form.problem}
                    onChange={(e) => set("problem", e.target.value)}
                    className="w-full border border-stone-300 px-3 py-2 text-sm min-h-20"
                    rows={3}
                  />
                </Field>
                <Field label="A abordagem">
                  <textarea
                    value={form.approach}
                    onChange={(e) => set("approach", e.target.value)}
                    className="w-full border border-stone-300 px-3 py-2 text-sm min-h-20"
                    rows={3}
                  />
                </Field>
                <Field label="O resultado">
                  <textarea
                    value={form.outcome}
                    onChange={(e) => set("outcome", e.target.value)}
                    className="w-full border border-stone-300 px-3 py-2 text-sm min-h-20"
                    rows={3}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Link ao vivo">
                    <Input
                      value={form.link}
                      onChange={(e) => set("link", e.target.value)}
                      placeholder="https://…"
                    />
                  </Field>
                  <Field label="Repositório">
                    <Input
                      value={form.source}
                      onChange={(e) => set("source", e.target.value)}
                      placeholder="https://github.com/…"
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Ordem">
                    <Input
                      type="number"
                      value={form.order}
                      onChange={(e) => set("order", e.target.value)}
                      placeholder="1"
                    />
                  </Field>
                  <label className="flex items-end gap-2 pb-2">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => set("featured", e.target.checked)}
                    />
                    <span className="text-sm">Destaque (case-study page)</span>
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <DialogTrigger asChild>
                    <Button variant="outline">Cancelar</Button>
                  </DialogTrigger>
                  <DialogTrigger asChild>
                    <Button onClick={handleAdd}>Criar</Button>
                  </DialogTrigger>
                </div>
                <p className="text-xs text-stone-500 pt-2">
                  Adicione a capa e a stack editando o projeto após criá-lo.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
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
