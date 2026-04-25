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
  const publicCommercial = useMemo(
    () => projects.filter((p) => p.isPublic && p.type === "commercial"),
    [projects]
  );
  const publicPersonal = useMemo(
    () => projects.filter((p) => p.isPublic && p.type === "personal"),
    [projects]
  );
  const [commercial, setCommercial] = useState(publicCommercial);
  const [personal, setPersonal] = useState(publicPersonal);
  const [isSaving, startTransition] = useTransition();

  const isDirty = (next: Project[], base: Project[]) => {
    if (next.length !== base.length) return true;
    return next.some((p, i) => p._id !== base[i]._id);
  };
  const commercialDirty = useMemo(
    () => isDirty(commercial, publicCommercial),
    [commercial, publicCommercial]
  );
  const personalDirty = useMemo(
    () => isDirty(personal, publicPersonal),
    [personal, publicPersonal]
  );
  const dirty = commercialDirty || personalDirty;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd =
    (
      items: Project[],
      setItems: React.Dispatch<React.SetStateAction<Project[]>>
    ) =>
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const oldIdx = items.findIndex((p) => p._id === active.id);
      const newIdx = items.findIndex((p) => p._id === over.id);
      if (oldIdx === -1 || newIdx === -1) return;
      setItems(arrayMove(items, oldIdx, newIdx));
    };

  const handleSave = () => {
    startTransition(async () => {
      if (commercialDirty || personalDirty) {
        const ids = [...commercial, ...personal].map((p) => p._id);
        await reorderPublicProjects(ids);
      }
      router.refresh();
      onSaved?.();
    });
  };

  if (commercial.length === 0 && personal.length === 0) {
    return (
      <p className="text-sm text-stone-500 border border-stone-200 px-3 py-4">
        Nenhum projeto público pra ordenar.
      </p>
    );
  }

  return (
    <div className="space-y-6">
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
      <SortableGroup
        title="Comercial"
        items={commercial}
        onDragEnd={handleDragEnd(commercial, setCommercial)}
        sensors={sensors}
      />
      <SortableGroup
        title="Pessoal"
        items={personal}
        onDragEnd={handleDragEnd(personal, setPersonal)}
        sensors={sensors}
      />
    </div>
  );
}

function SortableGroup({
  title,
  items,
  onDragEnd,
  sensors,
}: {
  title: string;
  items: Project[];
  onDragEnd: (event: DragEndEvent) => void;
  sensors: ReturnType<typeof useSensors>;
}) {
  return (
    <div className="space-y-2">
      <h3 className="mono-label uppercase tracking-widest text-xs text-stone-500">
        {title}
      </h3>
      {items.length === 0 ? (
        <p className="text-sm text-stone-500 border border-stone-200 px-3 py-4">
          Nenhum projeto público pra ordenar.
        </p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
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
      )}
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
