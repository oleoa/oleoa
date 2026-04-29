/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { UserCircle2 } from "lucide-react";

import Chip from "@/components/editorial/Chip";
import type { Project, ProjectStatus } from "@/db/types";
import { formatBudget } from "@/lib/budget";

const STATUS_LABELS: Record<ProjectStatus, string> = {
  active: "ativo",
  complete: "concluído",
  paused: "pausado",
};

const STATUS_VARIANT: Record<ProjectStatus, "strong" | "soft" | "outline"> = {
  active: "strong",
  complete: "soft",
  paused: "outline",
};

export function buildColumns(): ColumnDef<Project>[] {
  return [
    {
      accessorKey: "name",
      header: "Projeto",
      cell: ({ row }) => {
        const p = row.original;
        return (
          <Link
            href={`/dashboard/projects/${p._id}`}
            className="font-medium hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {p.name}
          </Link>
        );
      },
    },
    {
      id: "client",
      header: "Cliente",
      cell: ({ row }) => {
        const c = row.original.clientRef;
        if (!c) {
          return <span className="text-stone-400">—</span>;
        }
        return (
          <div className="flex items-center gap-2 text-sm">
            {c.avatar ? (
              <img
                src={c.avatar}
                alt=""
                className="h-5 w-5 rounded-full object-cover border border-stone-300"
              />
            ) : (
              <UserCircle2 className="h-5 w-5 text-stone-400" />
            )}
            <span className="truncate">{c.name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Chip variant={STATUS_VARIANT[row.original.status]}>
          {STATUS_LABELS[row.original.status]}
        </Chip>
      ),
    },
    {
      id: "flags",
      header: "Público",
      cell: ({ row }) => (
        <Chip variant={row.original.isPublic ? "soft" : "outline"}>
          {row.original.isPublic ? "pub" : "priv"}
        </Chip>
      ),
    },
    {
      id: "budget",
      header: "Orçamento",
      cell: ({ row }) => {
        const p = row.original;
        if (p.budgetAmount === null) {
          return <span className="text-stone-400">—</span>;
        }
        return (
          <span className="mono text-xs">
            {formatBudget(p.budgetAmount, p.budgetCurrency)}
          </span>
        );
      },
    },
    {
      id: "todos",
      header: "TODOs",
      cell: ({ row }) => {
        const p = row.original;
        if (p.todosTotal === 0) {
          return <span className="text-stone-400">—</span>;
        }
        return (
          <span className="mono text-xs">
            {p.todosDone}/{p.todosTotal}
          </span>
        );
      },
    },
  ];
}
