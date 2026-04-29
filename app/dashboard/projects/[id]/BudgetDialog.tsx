"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Field from "@/components/editorial/Field";
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

export default function BudgetDialog({
  project,
  open,
  onOpenChange,
}: {
  project: ProjectDetail;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const router = useRouter();
  const [amount, setAmount] = useState(
    project.budgetAmount !== null ? String(project.budgetAmount) : ""
  );
  const [currency, setCurrency] = useState<BudgetCurrency>(
    project.budgetCurrency
  );
  const [status, setStatus] = useState<BudgetStatus>(project.budgetStatus);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setAmount(
        project.budgetAmount !== null ? String(project.budgetAmount) : ""
      );
      setCurrency(project.budgetCurrency);
      setStatus(project.budgetStatus);
    }
  }, [open, project]);

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
      onOpenChange(false);
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar orçamento</DialogTitle>
          <DialogDescription className="sr-only">
            Formulário para editar o orçamento do projeto
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
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
                onChange={(e) =>
                  setCurrency(e.target.value as BudgetCurrency)
                }
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
                onChange={(e) =>
                  setStatus(e.target.value as BudgetStatus)
                }
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
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Salvando…" : "Salvar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
