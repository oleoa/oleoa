"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import SectionCard from "@/components/editorial/SectionCard";
import { Check, Trash2 } from "lucide-react";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Stack } from "@/db/types";
import { addStacksToProject, removeStackFromProject } from "./actions";

export default function StacksOnProject({
  projectId,
  projectStacks,
  allStacks,
}: {
  projectId: string;
  projectStacks: Stack[];
  allStacks: Stack[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  const availableStacks = useMemo(() => {
    const attached = new Set(projectStacks.map((s) => s._id));
    return allStacks.filter((s) => !attached.has(s._id));
  }, [allStacks, projectStacks]);

  const toggle = (stackId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(stackId)) next.delete(stackId);
      else next.add(stackId);
      return next;
    });
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setSelectedIds(new Set());
  };

  const handleSubmit = async () => {
    if (selectedIds.size === 0) return;
    setSubmitting(true);
    try {
      await addStacksToProject(projectId, Array.from(selectedIds));
      setSelectedIds(new Set());
      setOpen(false);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (stackId: string) => {
    await removeStackFromProject(projectId, stackId);
    router.refresh();
  };

  return (
    <SectionCard
      title="Stacks"
      action={
        <Popover open={open} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              + Adicionar
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" side="bottom" align="end">
            <Command>
              <CommandInput placeholder="Buscar stack..." />
              <CommandList>
                {availableStacks.length === 0 ? (
                  <div className="px-3 py-6 text-center text-xs text-stone-500">
                    Todas as stacks já foram adicionadas.
                  </div>
                ) : (
                  <>
                    <CommandEmpty>Nenhum resultado.</CommandEmpty>
                    <CommandGroup>
                      {availableStacks.map((stack) => {
                        const checked = selectedIds.has(stack._id);
                        return (
                          <CommandItem
                            key={stack._id}
                            value={stack.name}
                            onSelect={() => toggle(stack._id)}
                          >
                            <Check
                              className={
                                "h-4 w-4 " +
                                (checked ? "opacity-100" : "opacity-0")
                              }
                            />
                            {stack.name}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>
            {availableStacks.length > 0 && (
              <div className="flex items-center justify-between gap-2 border-t border-stone-200 px-3 py-2">
                <span className="text-xs text-stone-500">
                  {selectedIds.size} selecionada(s)
                </span>
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={selectedIds.size === 0 || submitting}
                >
                  Adicionar
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      }
    >
      <div className="flex flex-wrap gap-2">
        {projectStacks.length === 0 && (
          <p className="text-sm text-stone-500">Nenhuma stack adicionada.</p>
        )}
        {projectStacks.map((stack) => (
          <div
            key={stack._id}
            className="px-3 py-1 border border-stone-300 text-xs flex items-center gap-2"
          >
            {stack.name}
            <button onClick={() => handleRemove(stack._id)} aria-label={`Remover ${stack.name}`}>
              <Trash2 className="h-3 w-3 text-red-500 cursor-pointer" />
            </button>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
