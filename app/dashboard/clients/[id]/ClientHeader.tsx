/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Client } from "@/db/types";
import { deleteClient } from "../../actions";

export default function ClientHeader({ client }: { client: Client }) {
  const router = useRouter();
  const handleDelete = async () => {
    await deleteClient(client._id);
    router.push("/dashboard/clients");
  };

  return (
    <header className="flex items-start justify-between gap-6">
      <div className="flex-1 min-w-0 space-y-3">
        <Link
          href="/dashboard/clients"
          className="mono text-[10px] uppercase tracking-widest text-stone-500 inline-flex items-center gap-1 hover:text-stone-900"
        >
          <ChevronLeft className="h-3 w-3" /> Clientes
        </Link>
        <div className="flex items-center gap-4">
          {client.avatar ? (
            <img
              src={client.avatar}
              alt=""
              className="h-14 w-14 rounded-full object-cover border border-stone-300"
            />
          ) : (
            <div className="h-14 w-14 rounded-full border border-stone-300 flex items-center justify-center text-stone-400">
              <UserCircle2 className="h-8 w-8" />
            </div>
          )}
          <div className="min-w-0">
            <h1 className="display text-4xl md:text-5xl font-black tracking-tight leading-none break-words">
              {client.name}
            </h1>
            {client.company && (
              <p className="mt-2 mono text-xs uppercase tracking-widest text-stone-500">
                {client.company}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              Apagar cliente
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Apagar {client.name}?</AlertDialogTitle>
              <AlertDialogDescription>
                Essa ação não pode ser desfeita. Projetos vinculados a esse
                cliente ficarão sem cliente associado.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button variant="destructive" onClick={handleDelete}>
                  Apagar
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </header>
  );
}
