"use client";

import { useMemo, useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus, ChevronUp, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SectionCard from "@/components/editorial/SectionCard";
import Chip from "@/components/editorial/Chip";
import type { ProjectTodo } from "@/db/types";
import { addTodo, updateTodo, deleteTodo, reorderTodos } from "../../actions";

type Action =
  | { type: "toggle"; id: string }
  | { type: "rename"; id: string; title: string }
  | { type: "delete"; id: string }
  | { type: "reorder"; ids: string[] };

function reducer(state: ProjectTodo[], action: Action): ProjectTodo[] {
  switch (action.type) {
    case "toggle":
      return state.map((t) =>
        t._id === action.id ? { ...t, done: !t.done } : t
      );
    case "rename":
      return state.map((t) =>
        t._id === action.id ? { ...t, title: action.title } : t
      );
    case "delete":
      return state.filter((t) => t._id !== action.id);
    case "reorder": {
      const byId = new Map(state.map((t) => [t._id, t]));
      return action.ids
        .map((id) => byId.get(id))
        .filter((t): t is ProjectTodo => Boolean(t));
    }
  }
}

type Filter = "all" | "open" | "done";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "open", label: "Abertos" },
  { value: "done", label: "Concluídos" },
  { value: "all", label: "Todos" },
];

export default function ProjectTodoBoard({
  projectId,
  todos,
}: {
  projectId: string;
  todos: ProjectTodo[];
}) {
  const router = useRouter();
  const [newTitle, setNewTitle] = useState("");
  const [filter, setFilter] = useState<Filter>("open");
  const [optimistic, applyOptimistic] = useOptimistic(todos, reducer);
  const [, startTransition] = useTransition();

  const total = optimistic.length;
  const done = optimistic.filter((t) => t.done).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  const visible = useMemo(() => {
    if (filter === "open") return optimistic.filter((t) => !t.done);
    if (filter === "done") return optimistic.filter((t) => t.done);
    return optimistic;
  }, [optimistic, filter]);

  const reorderEnabled = filter === "all";

  const handleAdd = async () => {
    const title = newTitle.trim();
    if (!title) return;
    setNewTitle("");
    await addTodo(projectId, title);
    router.refresh();
  };

  const handleToggle = (todo: ProjectTodo) => {
    startTransition(async () => {
      applyOptimistic({ type: "toggle", id: todo._id });
      await updateTodo(todo._id, { done: !todo.done });
      router.refresh();
    });
  };

  const handleTitleBlur = async (todo: ProjectTodo, next: string) => {
    const trimmed = next.trim();
    if (!trimmed || trimmed === todo.title) return;
    await updateTodo(todo._id, { title: trimmed });
    router.refresh();
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      applyOptimistic({ type: "delete", id });
      await deleteTodo(id);
      router.refresh();
    });
  };

  const move = (id: string, dir: -1 | 1) => {
    const index = optimistic.findIndex((t) => t._id === id);
    const target = index + dir;
    if (index < 0 || target < 0 || target >= optimistic.length) return;
    const next = [...optimistic];
    [next[index], next[target]] = [next[target], next[index]];
    const ids = next.map((t) => t._id);
    startTransition(async () => {
      applyOptimistic({ type: "reorder", ids });
      await reorderTodos(projectId, ids);
      router.refresh();
    });
  };

  return (
    <SectionCard title="Lista de estudos">
      <div className="space-y-1">
        <div className="flex items-baseline justify-between">
          <span className="mono text-[10px] uppercase tracking-widest text-stone-500">
            Progresso
          </span>
          <span className="mono text-xs text-stone-700">
            {done}/{total} · {pct}%
          </span>
        </div>
        <div className="h-1 bg-stone-200">
          <div
            className="h-full bg-amber-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {FILTERS.map((f) => {
          const active = filter === f.value;
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className="cursor-pointer"
              aria-pressed={active}
            >
              <Chip variant={active ? "strong" : "outline"}>{f.label}</Chip>
            </button>
          );
        })}
      </div>

      <div className="flex gap-2">
        <Input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder="Adicionar tarefa..."
        />
        <Button type="button" onClick={handleAdd} size="sm">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <ul className="divide-y divide-stone-200 border border-stone-200">
        {visible.length === 0 && (
          <li className="px-3 py-4 text-sm text-stone-500">
            {filter === "open"
              ? "Nada pendente."
              : filter === "done"
                ? "Nada concluído ainda."
                : "Sem tarefas ainda."}
          </li>
        )}
        {visible.map((todo) => {
          const globalIndex = optimistic.findIndex(
            (t) => t._id === todo._id
          );
          const isFirst = globalIndex === 0;
          const isLast = globalIndex === optimistic.length - 1;
          return (
            <li
              key={todo._id}
              className="flex items-center gap-2 px-3 py-3"
            >
              <div className="flex flex-col text-stone-400">
                <button
                  type="button"
                  onClick={() => move(todo._id, -1)}
                  disabled={!reorderEnabled || isFirst}
                  title={
                    reorderEnabled
                      ? undefined
                      : "Mostre todos para reordenar"
                  }
                  className="p-1 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                  aria-label="Mover para cima"
                >
                  <ChevronUp className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => move(todo._id, 1)}
                  disabled={!reorderEnabled || isLast}
                  title={
                    reorderEnabled
                      ? undefined
                      : "Mostre todos para reordenar"
                  }
                  className="p-1 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                  aria-label="Mover para baixo"
                >
                  <ChevronDown className="h-3 w-3" />
                </button>
              </div>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => handleToggle(todo)}
                aria-label={`Marcar "${todo.title}" como ${
                  todo.done ? "pendente" : "concluído"
                }`}
                className="h-4 w-4 cursor-pointer"
              />
              <input
                defaultValue={todo.title}
                onBlur={(e) => handleTitleBlur(todo, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.currentTarget.blur();
                }}
                className={`flex-1 bg-transparent text-sm outline-none ${
                  todo.done ? "line-through text-stone-400" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => handleDelete(todo._id)}
                aria-label="Remover tarefa"
                className="p-1 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5 text-red-500" />
              </button>
            </li>
          );
        })}
      </ul>
    </SectionCard>
  );
}
