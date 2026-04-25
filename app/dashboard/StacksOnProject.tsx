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
import { Trash2 } from "lucide-react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Stack } from "@/db/types";
import { addStackToProject, removeStackFromProject } from "./actions";

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

  const handleAdd = async (stackId: string) => {
    await addStackToProject(projectId, stackId);
    setOpen(false);
    router.refresh();
  };

  const handleRemove = async (stackId: string) => {
    await removeStackFromProject(projectId, stackId);
    router.refresh();
  };

  return (
    <SectionCard
      title="Stacks"
      action={
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              + Adicionar
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" side="bottom" align="end">
            <Command>
              <CommandInput placeholder="Buscar stack..." />
              <CommandList>
                <CommandEmpty>Nenhum resultado.</CommandEmpty>
                <CommandGroup>
                  {allStacks.map((stack) => (
                    <CommandItem
                      key={stack._id}
                      value={stack.name}
                      onSelect={() => handleAdd(stack._id)}
                    >
                      {stack.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
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
