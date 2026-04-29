"use client";

import { useMemo, useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronUp, ChevronDown, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionCard from "@/components/editorial/SectionCard";
import type { ProjectLink, ProjectLinkKind } from "@/db/types";
import {
  deleteProjectLink,
  reorderProjectLinks,
  updateProjectLink,
} from "../../actions";
import { AddLinkDialog, EditLinkDialog, iconFor } from "./ProjectLinkDialogs";

const KIND_ORDER: ProjectLinkKind[] = [
  "vercel",
  "github",
  "docs",
  "neon",
  "other",
];

const KIND_LABEL: Record<ProjectLinkKind, string> = {
  vercel: "Deploy",
  github: "Repositório",
  docs: "Documentação",
  neon: "Banco",
  other: "Outros",
};

const DRAG_MIME = "application/x-project-link-id";

type Action =
  | { type: "delete"; id: string }
  | { type: "reorder"; ids: string[] }
  | { type: "changeKind"; id: string; kind: ProjectLinkKind };

function reducer(state: ProjectLink[], action: Action): ProjectLink[] {
  switch (action.type) {
    case "delete":
      return state.filter((l) => l._id !== action.id);
    case "reorder": {
      const byId = new Map(state.map((l) => [l._id, l]));
      return action.ids
        .map((id) => byId.get(id))
        .filter((l): l is ProjectLink => Boolean(l));
    }
    case "changeKind":
      return state.map((l) =>
        l._id === action.id ? { ...l, kind: action.kind } : l
      );
  }
}

function hostnameFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function ProjectLinksHub({
  projectId,
  links,
}: {
  projectId: string;
  links: ProjectLink[];
}) {
  const router = useRouter();
  const [optimistic, applyOptimistic] = useOptimistic(links, reducer);
  const [, startTransition] = useTransition();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverKind, setDragOverKind] = useState<ProjectLinkKind | null>(
    null
  );

  const columnOf = (link: ProjectLink): ProjectLinkKind =>
    link.kind && KIND_ORDER.includes(link.kind as ProjectLinkKind)
      ? (link.kind as ProjectLinkKind)
      : "other";

  const columns = useMemo(() => {
    const map = new Map<ProjectLinkKind, ProjectLink[]>();
    for (const kind of KIND_ORDER) map.set(kind, []);
    for (const link of optimistic) {
      map.get(columnOf(link))!.push(link);
    }
    return KIND_ORDER.map((kind) => ({
      kind,
      items: map.get(kind) ?? [],
    }));
  }, [optimistic]);

  const isDragging = draggingId !== null;
  const visibleColumns = columns.filter(
    (col) => col.kind !== "other" || col.items.length > 0 || isDragging
  );

  const move = (id: string, dir: -1 | 1) => {
    const link = optimistic.find((l) => l._id === id);
    if (!link) return;
    const kind = columnOf(link);
    const sameKind = optimistic.filter((l) => columnOf(l) === kind);
    const idxInColumn = sameKind.findIndex((l) => l._id === id);
    const target = idxInColumn + dir;
    if (target < 0 || target >= sameKind.length) return;

    const aId = sameKind[idxInColumn]._id;
    const bId = sameKind[target]._id;
    const aIdx = optimistic.findIndex((l) => l._id === aId);
    const bIdx = optimistic.findIndex((l) => l._id === bId);
    const next = [...optimistic];
    [next[aIdx], next[bIdx]] = [next[bIdx], next[aIdx]];
    const ids = next.map((l) => l._id);

    startTransition(async () => {
      applyOptimistic({ type: "reorder", ids });
      await reorderProjectLinks(projectId, ids);
      router.refresh();
    });
  };

  const remove = (id: string) => {
    startTransition(async () => {
      applyOptimistic({ type: "delete", id });
      await deleteProjectLink(id);
      router.refresh();
    });
  };

  const handleDrop = (id: string, targetKind: ProjectLinkKind) => {
    setDraggingId(null);
    setDragOverKind(null);
    const link = optimistic.find((l) => l._id === id);
    if (!link) return;
    if (columnOf(link) === targetKind) return;
    startTransition(async () => {
      applyOptimistic({ type: "changeKind", id, kind: targetKind });
      await updateProjectLink(id, {
        label: link.label,
        url: link.url,
        kind: targetKind,
      });
      router.refresh();
    });
  };

  return (
    <SectionCard title="Links">
      <div className="overflow-x-auto -mx-2 px-2">
        <div className="flex gap-3 min-w-max">
          {visibleColumns.map((col) => (
            <KanbanColumn
              key={col.kind}
              kind={col.kind}
              items={col.items}
              projectId={projectId}
              draggingId={draggingId}
              isDragOver={dragOverKind === col.kind}
              onCardDragStart={setDraggingId}
              onCardDragEnd={() => {
                setDraggingId(null);
                setDragOverKind(null);
              }}
              onDragOverColumn={() => setDragOverKind(col.kind)}
              onDropOnColumn={(id) => handleDrop(id, col.kind)}
              onMoveUp={(id) => move(id, -1)}
              onMoveDown={(id) => move(id, 1)}
              onDelete={remove}
            />
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

function KanbanColumn({
  kind,
  items,
  projectId,
  draggingId,
  isDragOver,
  onCardDragStart,
  onCardDragEnd,
  onDragOverColumn,
  onDropOnColumn,
  onMoveUp,
  onMoveDown,
  onDelete,
}: {
  kind: ProjectLinkKind;
  items: ProjectLink[];
  projectId: string;
  draggingId: string | null;
  isDragOver: boolean;
  onCardDragStart: (id: string) => void;
  onCardDragEnd: () => void;
  onDragOverColumn: () => void;
  onDropOnColumn: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      onDragOver={(e) => {
        if (!e.dataTransfer.types.includes(DRAG_MIME)) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        onDragOverColumn();
      }}
      onDrop={(e) => {
        const id = e.dataTransfer.getData(DRAG_MIME);
        if (!id) return;
        e.preventDefault();
        onDropOnColumn(id);
      }}
      className={
        "w-56 shrink-0 flex flex-col border transition-colors " +
        (isDragOver
          ? "bg-amber-50 border-stone-900"
          : "bg-stone-100/60 border-stone-200")
      }
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <span className="text-stone-600">{iconFor(kind, "h-3.5 w-3.5")}</span>
          <span className="mono text-[10px] uppercase tracking-widest text-stone-700">
            {KIND_LABEL[kind]}
          </span>
        </div>
        <span className="mono text-[10px] text-stone-500">
          {items.length || ""}
        </span>
      </div>
      <div className="flex-1 p-2 space-y-2 min-h-12">
        {items.length === 0 && (
          <p className="text-[11px] text-stone-400 text-center py-2">
            {isDragOver ? "Soltar aqui" : "Vazio"}
          </p>
        )}
        {items.map((link, idx) => (
          <LinkCard
            key={link._id}
            link={link}
            isFirst={idx === 0}
            isLast={idx === items.length - 1}
            isDragging={draggingId === link._id}
            onDragStart={() => onCardDragStart(link._id)}
            onDragEnd={onCardDragEnd}
            onMoveUp={() => onMoveUp(link._id)}
            onMoveDown={() => onMoveDown(link._id)}
            onDelete={() => onDelete(link._id)}
          />
        ))}
      </div>
      <div className="px-2 pb-2">
        <AddLinkDialog
          projectId={projectId}
          defaultKind={kind}
          trigger={
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full justify-start mono text-[10px] uppercase tracking-widest text-stone-500 hover:text-stone-900"
            >
              <Plus className="h-3 w-3" /> Link
            </Button>
          }
        />
      </div>
    </div>
  );
}

function LinkCard({
  link,
  isFirst,
  isLast,
  isDragging,
  onDragStart,
  onDragEnd,
  onMoveUp,
  onMoveDown,
  onDelete,
}: {
  link: ProjectLink;
  isFirst: boolean;
  isLast: boolean;
  isDragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={
        "group/card relative " + (isDragging ? "opacity-40" : "")
      }
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData(DRAG_MIME, link._id);
        e.dataTransfer.effectAllowed = "move";
        onDragStart();
      }}
      onDragEnd={onDragEnd}
    >
      <a
        href={link.url}
        target="_blank"
        rel="noreferrer"
        className="block bg-white border border-stone-300 hover:border-stone-900 transition-colors p-2.5 cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-start gap-2">
          <span className="shrink-0 mt-0.5 text-stone-700">
            {iconFor(link.kind, "h-4 w-4")}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-stone-900 truncate">
              {link.label}
            </p>
            <p className="mono text-[10px] uppercase tracking-widest text-stone-500 truncate mt-0.5">
              {hostnameFromUrl(link.url)}
            </p>
          </div>
        </div>
      </a>
      <div className="absolute top-1 right-1 flex items-center gap-0.5 opacity-0 group-hover/card:opacity-100 focus-within:opacity-100 transition-opacity">
        <CardButton
          label="Mover para cima"
          disabled={isFirst}
          onClick={onMoveUp}
        >
          <ChevronUp className="h-3 w-3" />
        </CardButton>
        <CardButton
          label="Mover para baixo"
          disabled={isLast}
          onClick={onMoveDown}
        >
          <ChevronDown className="h-3 w-3" />
        </CardButton>
        <EditLinkDialog
          link={link}
          trigger={
            <button
              type="button"
              aria-label={`Editar ${link.label}`}
              className="bg-white/95 backdrop-blur-sm p-0.5 border border-stone-200 hover:border-stone-900 cursor-pointer"
            >
              <Pencil className="h-3 w-3 text-stone-700" />
            </button>
          }
        />
        <CardButton
          label={`Remover ${link.label}`}
          onClick={onDelete}
          danger
        >
          <Trash2 className="h-3 w-3" />
        </CardButton>
      </div>
    </div>
  );
}

function CardButton({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) onClick();
      }}
      className={
        "bg-white/95 backdrop-blur-sm p-0.5 border border-stone-200 hover:border-stone-900 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed " +
        (danger ? "text-red-600" : "text-stone-700")
      }
    >
      {children}
    </button>
  );
}
