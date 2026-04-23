"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DialogTrigger } from "@/components/ui/dialog";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import type { Project, Stack } from "@/db/types";

import {
  UpdateProjectDialog,
  DeleteProjectDialog,
} from "./UpdateProjectDialog";

export type ColumnsContext = { allStacks: Stack[] };

export function buildColumns({ allStacks }: ColumnsContext): ColumnDef<Project>[] {
  return [
    {
      accessorKey: "order",
      header: "#",
      cell: ({ row }) => (
        <span className="mono text-xs text-stone-500">
          {row.original.order ?? "—"}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "client",
      header: "Cliente",
      cell: ({ row }) => (
        <span className="text-sm text-stone-600">
          {row.original.client ?? "—"}
        </span>
      ),
    },
    {
      accessorKey: "slug",
      header: "Slug",
      cell: ({ row }) =>
        row.original.slug ? (
          <code className="mono text-xs">{row.original.slug}</code>
        ) : (
          <span className="text-stone-400">—</span>
        ),
    },
    {
      accessorKey: "featured",
      header: "Destaque",
      cell: ({ row }) =>
        row.original.featured ? (
          <span className="mono text-[10px] uppercase tracking-widest bg-stone-900 text-stone-50 px-2 py-0.5">
            sim
          </span>
        ) : (
          <span className="text-stone-400">—</span>
        ),
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => {
        const project = row.original;
        return (
          <UpdateProjectDialog project={project} allStacks={allStacks}>
            <DeleteProjectDialog project={project}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Abrir menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{project.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <DialogTrigger className="w-full">Editar</DialogTrigger>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <AlertDialogTrigger className="w-full">
                      Apagar
                    </AlertDialogTrigger>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </DeleteProjectDialog>
          </UpdateProjectDialog>
        );
      },
    },
  ];
}
