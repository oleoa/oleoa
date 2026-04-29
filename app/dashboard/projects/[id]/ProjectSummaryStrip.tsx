/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Pencil, UserCircle2 } from "lucide-react";
import Chip from "@/components/editorial/Chip";
import type {
  BudgetStatus,
  Client,
  ProjectDetail,
  ProjectType,
  Stack,
} from "@/db/types";
import { formatBudget } from "@/lib/budget";
import ProjectDetailsDialog from "./ProjectDetailsDialog";
import BudgetDialog from "./BudgetDialog";
import ClientDialog from "./ClientDialog";
import StacksDialog from "./StacksDialog";

const TYPE_LABEL: Record<ProjectType, string> = {
  personal: "pessoal",
  commercial: "comercial",
};

const BUDGET_STATUS_LABEL: Record<BudgetStatus, string> = {
  pending: "pendente",
  partial: "parcial",
  paid: "pago",
  none: "sem cobrança",
};

const BUDGET_STATUS_VARIANT: Record<
  BudgetStatus,
  "strong" | "soft" | "outline"
> = {
  pending: "outline",
  partial: "soft",
  paid: "strong",
  none: "outline",
};

export default function ProjectSummaryStrip({
  project,
  allClients,
  allStacks,
}: {
  project: ProjectDetail;
  allClients: Client[];
  allStacks: Stack[];
}) {
  const [openDialog, setOpenDialog] = useState<
    "details" | "budget" | "client" | "stacks" | null
  >(null);

  return (
    <>
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-stone-200 border border-stone-200">
        <SummaryCell
          label="Detalhes"
          onEdit={() => setOpenDialog("details")}
        >
          <DetailsValue project={project} />
        </SummaryCell>
        <SummaryCell label="Cliente" onEdit={() => setOpenDialog("client")}>
          <ClientValue client={project.clientRef} />
        </SummaryCell>
        <SummaryCell
          label="Orçamento"
          onEdit={() => setOpenDialog("budget")}
        >
          <BudgetValue project={project} />
        </SummaryCell>
        <SummaryCell label="Stacks" onEdit={() => setOpenDialog("stacks")}>
          <StacksValue stacks={project.stacks} />
        </SummaryCell>
      </section>

      <ProjectDetailsDialog
        project={project}
        open={openDialog === "details"}
        onOpenChange={(v) => setOpenDialog(v ? "details" : null)}
      />
      <BudgetDialog
        project={project}
        open={openDialog === "budget"}
        onOpenChange={(v) => setOpenDialog(v ? "budget" : null)}
      />
      <ClientDialog
        project={project}
        allClients={allClients}
        open={openDialog === "client"}
        onOpenChange={(v) => setOpenDialog(v ? "client" : null)}
      />
      <StacksDialog
        projectId={project._id}
        projectStacks={project.stacks}
        allStacks={allStacks}
        open={openDialog === "stacks"}
        onOpenChange={(v) => setOpenDialog(v ? "stacks" : null)}
      />
    </>
  );
}

function SummaryCell({
  label,
  onEdit,
  children,
}: {
  label: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white p-4 relative min-h-24 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <span className="mono text-[10px] uppercase tracking-widest text-stone-500">
          {label}
        </span>
        <button
          type="button"
          onClick={onEdit}
          aria-label={`Editar ${label.toLowerCase()}`}
          className="text-stone-400 hover:text-stone-900 cursor-pointer"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="flex-1 min-w-0 text-sm text-stone-800">{children}</div>
    </div>
  );
}

function DetailsValue({ project }: { project: ProjectDetail }) {
  const desc = project.description?.trim();
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 flex-wrap">
        <Chip variant="soft">{TYPE_LABEL[project.type]}</Chip>
        <span className="mono text-[10px] uppercase tracking-widest text-stone-500">
          {project.year || "—"}
        </span>
      </div>
      {desc ? (
        <p className="text-xs text-stone-600 line-clamp-2">{desc}</p>
      ) : (
        <p className="text-xs text-stone-400">Sem descrição.</p>
      )}
    </div>
  );
}

function ClientValue({ client }: { client: Client | null }) {
  if (!client) {
    return <p className="text-xs text-stone-400">Sem cliente.</p>;
  }
  return (
    <div className="flex items-center gap-2 min-w-0">
      {client.avatar ? (
        <img
          src={client.avatar}
          alt=""
          className="h-6 w-6 rounded-full object-cover border border-stone-300 shrink-0"
        />
      ) : (
        <div className="h-6 w-6 rounded-full border border-stone-300 flex items-center justify-center text-stone-400 shrink-0">
          <UserCircle2 className="h-4 w-4" />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-sm font-medium truncate">{client.name}</p>
        {client.company && (
          <p className="text-xs text-stone-500 truncate">{client.company}</p>
        )}
      </div>
    </div>
  );
}

function BudgetValue({ project }: { project: ProjectDetail }) {
  return (
    <div className="space-y-1.5">
      <p className="display text-lg font-semibold text-stone-900">
        {formatBudget(project.budgetAmount, project.budgetCurrency)}
      </p>
      <Chip variant={BUDGET_STATUS_VARIANT[project.budgetStatus]}>
        {BUDGET_STATUS_LABEL[project.budgetStatus]}
      </Chip>
    </div>
  );
}

function StacksValue({ stacks }: { stacks: Stack[] }) {
  if (stacks.length === 0) {
    return <p className="text-xs text-stone-400">Nenhuma stack.</p>;
  }
  const visible = stacks.slice(0, 4);
  const extra = stacks.length - visible.length;
  return (
    <div className="flex flex-wrap gap-1.5">
      {visible.map((s) => (
        <span
          key={s._id}
          className="px-2 py-0.5 border border-stone-300 text-xs"
        >
          {s.name}
        </span>
      ))}
      {extra > 0 && (
        <span className="px-2 py-0.5 text-xs text-stone-500">+{extra}</span>
      )}
    </div>
  );
}
