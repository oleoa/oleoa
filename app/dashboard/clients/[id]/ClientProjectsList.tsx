import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Chip from "@/components/editorial/Chip";
import type { Project, ProjectStatus } from "@/db/types";
import { formatBudget } from "../../projects/[id]/BudgetCard";

const STATUS_LABELS: Record<ProjectStatus, string> = {
  active: "ativo",
  paused: "pausado",
  complete: "concluído",
};

const STATUS_VARIANT: Record<ProjectStatus, "strong" | "soft" | "outline"> = {
  active: "strong",
  paused: "soft",
  complete: "outline",
};

export default function ClientProjectsList({
  projects,
}: {
  projects: Project[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Projetos</CardTitle>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <p className="text-sm text-stone-500">
            Este cliente ainda não tem projetos.
          </p>
        ) : (
          <ul className="divide-y divide-stone-200 border border-stone-200">
            {projects.map((p) => (
              <li key={p._id}>
                <Link
                  href={`/dashboard/projects/${p._id}`}
                  className="flex flex-col gap-1 px-3 py-2 hover:bg-stone-100"
                >
                  <span className="font-medium text-sm truncate">{p.name}</span>
                  <span className="flex items-center gap-2">
                    <Chip variant={STATUS_VARIANT[p.status]}>
                      {STATUS_LABELS[p.status]}
                    </Chip>
                    {p.budgetAmount !== null && (
                      <span className="mono text-[10px] text-stone-500">
                        {formatBudget(p.budgetAmount, p.budgetCurrency)}
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
