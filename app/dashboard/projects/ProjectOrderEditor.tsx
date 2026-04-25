/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, UserCircle2 } from "lucide-react";

import Chip from "@/components/editorial/Chip";
import { Button } from "@/components/ui/button";
import type { Project, ProjectStatus } from "@/db/types";
import { reorderPublicProjects } from "../actions";

const STATUS_LABEL: Record<ProjectStatus, string> = {
  active: "ativo",
  paused: "pausado",
  complete: "concluído",
};

export default function ProjectOrderEditor({
  projects,
  onSaved,
}: {
  projects: Project[];
  onSaved?: () => void;
}) {
  const router = useRouter();
  const publicOnly = useMemo(
    () => projects.filter((p) => p.isPublic),
    [projects]
  );
  const [items, setItems] = useState(publicOnly);
  const [isSaving, startTransition] = useTransition();

  const dirty = useMemo(() => {
    if (items.length !== publicOnly.length) return true;
    return items.some((p, i) => p._id !== publicOnly[i]._id);
  }, [items, publicOnly]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = items.findIndex((p) => p._id === active.id);
    const newIdx = items.findIndex((p) => p._id === over.id);
    if (oldIdx === -1 || newIdx === -1) return;
    setItems(arrayMove(items, oldIdx, newIdx));
  };

  const handleSave = () => {
    const ids = items.map((p) => p._id);
    startTransition(async () => {
      await reorderPublicProjects(ids);
      router.refresh();
      onSaved?.();
    });
  };

  if (items.length === 0) {
    return (
      <p className="text-sm text-stone-500 border border-stone-200 px-3 py-4">
        Nenhum projeto público pra ordenar.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="mono text-[10px] uppercase tracking-widest text-stone-500">
          Arraste pra reordenar. Clique em Salvar pra confirmar.
        </p>
        <Button
          type="button"
          size="sm"
          onClick={handleSave}
          disabled={!dirty || isSaving}
        >
          {isSaving ? "Salvando…" : "Salvar ordem"}
        </Button>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((p) => p._id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="divide-y divide-stone-200 border-2 border-stone-900">
            {items.map((p, i) => (
              <SortableRow key={p._id} project={p} index={i} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SortableRow({ project, index }: { project: Project; index: number }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project._id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    background: isDragging ? "var(--color-stone-100, #f5f5f4)" : undefined,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 px-3 py-3 bg-stone-50"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label={`Arrastar ${project.name}`}
        className="cursor-grab touch-none text-stone-400 hover:text-stone-900"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <span className="mono text-[10px] uppercase tracking-widest text-stone-500 w-8">
        Nº {String(index + 1).padStart(2, "0")}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{project.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <Chip variant="soft">{STATUS_LABEL[project.status]}</Chip>
          {project.clientRef && (
            <span className="flex items-center gap-1 text-[11px] text-stone-500 truncate">
              {project.clientRef.avatar ? (
                <img
                  src={project.clientRef.avatar}
                  alt=""
                  className="h-4 w-4 rounded-full object-cover"
                />
              ) : (
                <UserCircle2 className="h-3.5 w-3.5 text-stone-400" />
              )}
              {project.clientRef.name}
            </span>
          )}
        </div>
      </div>
    </li>
  );
}
