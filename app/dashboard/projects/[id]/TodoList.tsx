"use client";

import { useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SectionCard from "@/components/editorial/SectionCard";
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

export default function TodoList({
  projectId,
  todos,
}: {
  projectId: string;
  todos: ProjectTodo[];
}) {
  const router = useRouter();
  const [newTitle, setNewTitle] = useState("");
  const [optimistic, applyOptimistic] = useOptimistic(todos, reducer);
  const [, startTransition] = useTransition();

  const done = optimistic.filter((t) => t.done).length;

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

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= optimistic.length) return;
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
    <SectionCard
      title="TODOs"
      action={
        <span className="mono text-xs text-stone-600">
          {done} / {optimistic.length}
        </span>
      }
    >
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
        {optimistic.length === 0 && (
          <li className="px-3 py-4 text-sm text-stone-500">
            Sem tarefas ainda.
          </li>
        )}
        {optimistic.map((todo, index) => (
          <li key={todo._id} className="flex items-center gap-2 px-3 py-2">
            <div className="flex flex-col text-stone-400">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                className="text-xs disabled:opacity-20 cursor-pointer"
                aria-label="Mover para cima"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === optimistic.length - 1}
                className="text-xs disabled:opacity-20 cursor-pointer"
                aria-label="Mover para baixo"
              >
                ▼
              </button>
            </div>
            <GripVertical className="h-3 w-3 text-stone-300" />
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => handleToggle(todo)}
              aria-label={`Marcar "${todo.title}" como ${todo.done ? "pendente" : "concluído"}`}
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
            >
              <Trash2 className="h-3.5 w-3.5 text-red-500 cursor-pointer" />
            </button>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
