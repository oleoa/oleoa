"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Field from "@/components/editorial/Field";
import SectionCard from "@/components/editorial/SectionCard";
import type {
  BudgetCurrency,
  BudgetStatus,
  Project,
  ProjectDetail,
} from "@/db/types";
import { updateProject } from "../../actions";
import { toProjectInput } from "./project-input";

const CURRENCIES: BudgetCurrency[] = ["BRL", "USD", "EUR"];
const STATUSES: { value: BudgetStatus; label: string }[] = [
  { value: "pending", label: "Pendente" },
  { value: "partial", label: "Parcial" },
  { value: "paid", label: "Pago" },
  { value: "none", label: "Sem cobrança" },
];

export function formatBudget(amount: number | null, currency: string): string {
  if (amount === null) return "—";
  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export default function BudgetCard({ project }: { project: ProjectDetail }) {
  const router = useRouter();
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [amount, setAmount] = useState(
    project.budgetAmount !== null ? String(project.budgetAmount) : ""
  );
  const [currency, setCurrency] = useState(project.budgetCurrency);
  const [status, setStatus] = useState<BudgetStatus>(project.budgetStatus);
  const [saving, setSaving] = useState(false);

  const handleEdit = () => {
    setAmount(project.budgetAmount !== null ? String(project.budgetAmount) : "");
    setCurrency(project.budgetCurrency);
    setStatus(project.budgetStatus);
    setMode("edit");
  };

  const handleCancel = () => {
    handleEdit();
    setMode("view");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const parsed = amount.trim() ? Number(amount) : null;
      await updateProject(project._id, {
        ...toProjectInput(project as Project),
        budgetAmount: parsed,
        budgetCurrency: currency,
        budgetStatus: status,
      });
      setMode("view");
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const statusLabel = STATUSES.find((s) => s.value === project.budgetStatus)?.label;

  return (
    <SectionCard
      title="Orçamento"
      mode={mode}
      onEdit={handleEdit}
      onCancel={handleCancel}
    >
      <div className="flex items-baseline justify-between">
        <span className="display text-3xl font-semibold">
          {formatBudget(project.budgetAmount, project.budgetCurrency)}
        </span>
        <span className="mono text-[10px] uppercase tracking-widest text-stone-500">
          {statusLabel}
        </span>
      </div>
      {mode === "edit" && (
        <>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Valor">
              <Input
                type="number"
                inputMode="decimal"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
              />
            </Field>
            <Field label="Moeda">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as BudgetCurrency)}
                className="w-full border border-stone-300 px-3 py-2 text-sm"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Status">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as BudgetStatus)}
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
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Salvando…" : "Salvar orçamento"}
            </Button>
          </div>
        </>
      )}
    </SectionCard>
  );
}
