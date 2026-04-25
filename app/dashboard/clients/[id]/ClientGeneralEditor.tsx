/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Field from "@/components/editorial/Field";
import SectionCard from "@/components/editorial/SectionCard";
import type { Client } from "@/db/types";
import {
  updateClient,
  setClientAvatar,
  removeClientAvatar,
} from "../../actions";

export default function ClientGeneralEditor({ client }: { client: Client }) {
  const router = useRouter();
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [state, setState] = useState({
    name: client.name,
    email: client.email ?? "",
    company: client.company ?? "",
    notes: client.notes ?? "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof typeof state>(k: K, v: (typeof state)[K]) =>
    setState((prev) => ({ ...prev, [k]: v }));

  const handleEdit = () => setMode("edit");

  const handleCancel = () => {
    setState({
      name: client.name,
      email: client.email ?? "",
      company: client.company ?? "",
      notes: client.notes ?? "",
    });
    setAvatarFile(null);
    setMode("view");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
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
      setMode("view");
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveAvatar = async () => {
    await removeClientAvatar(client._id);
    router.refresh();
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
          <ViewRow label="Nome" value={client.name} />
          <ViewRow label="Empresa" value={client.company} />
          <ViewRow label="Email" value={client.email} />
          <ViewRow label="Notas" value={client.notes} multiline />
        </dl>
      ) : (
        <>
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
              onChange={(e) => set("name", e.target.value)}
            />
          </Field>
          <Field label="Empresa">
            <Input
              value={state.company}
              onChange={(e) => set("company", e.target.value)}
            />
          </Field>
          <Field label="Email">
            <Input
              type="email"
              value={state.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </Field>
          <Field label="Notas">
            <textarea
              value={state.notes}
              onChange={(e) => set("notes", e.target.value)}
              className="w-full border border-stone-300 px-3 py-2 text-sm min-h-24"
              rows={4}
            />
          </Field>
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

function ViewRow({
  label,
  value,
  multiline,
}: {
  label: string;
  value: string | null;
  multiline?: boolean;
}) {
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
            : "text-sm text-stone-800 truncate"
        }
      >
        {value && value.trim() ? value : <span className="text-stone-400">—</span>}
      </dd>
    </div>
  );
}
