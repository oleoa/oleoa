import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listProjectsForDashboard } from "@/db/queries";

function fmtCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${Math.round(amount)}`;
  }
}

export default async function Dashboard() {
  const projects = await listProjectsForDashboard();

  const activeCount = projects.filter((p) => p.status === "active").length;

  // Sum budgets grouped by currency. Most projects use BRL but we don't want to
  // silently mix currencies into one number.
  const pipelineByCurrency = new Map<string, number>();
  const paidByCurrency = new Map<string, number>();
  for (const p of projects) {
    if (p.budgetAmount === null) continue;
    const bucket = p.budgetStatus === "paid" ? paidByCurrency : pipelineByCurrency;
    bucket.set(
      p.budgetCurrency,
      (bucket.get(p.budgetCurrency) ?? 0) + p.budgetAmount
    );
  }

  const renderMoney = (map: Map<string, number>) => {
    if (map.size === 0) return "—";
    return Array.from(map.entries())
      .map(([currency, amount]) => fmtCurrency(amount, currency))
      .join(" · ");
  };

  const pendingTodoProjects = projects
    .filter((p) => p.todosTotal > p.todosDone)
    .sort((a, b) =>
      b.todosTotal - b.todosDone - (a.todosTotal - a.todosDone)
    );
  const pendingTodosCount = pendingTodoProjects.reduce(
    (acc, p) => acc + (p.todosTotal - p.todosDone),
    0
  );
  const recentProjects = projects.slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      <header>
        <p className="mono-label mb-3">§ Ω · Console</p>
        <h1 className="display text-4xl md:text-5xl font-black tracking-tight leading-none">
          Dashboard
        </h1>
        <p className="mt-3 text-stone-500">
          {projects.length} projetos · edições da Volume IV.
        </p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard label="Projetos" value={projects.length.toString()} />
        <SummaryCard label="Ativos" value={activeCount.toString()} />
        <SummaryCard
          label="Pipeline"
          value={renderMoney(pipelineByCurrency)}
          mono
        />
        <SummaryCard
          label="Faturado"
          value={renderMoney(paidByCurrency)}
          mono
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <p className="mono text-[10px] uppercase tracking-widest text-stone-500">
            Projetos recentes
          </p>
          <RecentProjects projects={recentProjects} />
        </div>
        <div className="space-y-3">
          <p className="mono text-[10px] uppercase tracking-widest text-stone-500">
            TODOs em aberto
          </p>
          <PendingTodos
            projects={pendingTodoProjects.slice(0, 3)}
            total={pendingTodosCount}
          />
        </div>
      </section>
    </div>
  );
}

function RecentProjects({
  projects,
}: {
  projects: Awaited<ReturnType<typeof listProjectsForDashboard>>;
}) {
  if (projects.length === 0) {
    return (
      <p className="text-sm text-stone-500 border border-stone-200 px-3 py-4">
        Nenhum projeto ainda.
      </p>
    );
  }
  return (
    <ul className="divide-y divide-stone-200 border border-stone-200">
      {projects.map((p) => (
        <li key={p._id} className="px-3 py-2 text-sm">
          <a
            href={`/dashboard/projects/${p._id}`}
            className="grid grid-cols-[1fr_auto_auto] items-center gap-3 hover:underline"
          >
            <span className="truncate font-medium">{p.name}</span>
            <span className="mono text-[10px] uppercase tracking-widest text-stone-500">
              {p.clientRef?.name ?? "—"}
            </span>
            <span className="mono text-[10px] uppercase tracking-widest text-stone-500">
              {p.status}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function PendingTodos({
  projects,
  total,
}: {
  projects: Awaited<ReturnType<typeof listProjectsForDashboard>>;
  total: number;
}) {
  return (
    <Card className="py-4">
      <CardContent className="space-y-3">
        <p className="display text-4xl font-semibold leading-none">{total}</p>
        {projects.length === 0 ? (
          <p className="text-sm text-stone-500">Sem tarefas em aberto.</p>
        ) : (
          <ul className="space-y-1 pt-1">
            {projects.map((p) => (
              <li key={p._id} className="text-sm">
                <a
                  href={`/dashboard/projects/${p._id}`}
                  className="flex items-center justify-between gap-3 hover:underline"
                >
                  <span className="truncate">{p.name}</span>
                  <span className="mono text-xs text-stone-500">
                    {p.todosDone}/{p.todosTotal}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function SummaryCard({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <Card className="py-4">
      <CardHeader className="pb-2">
        <CardTitle className="mono text-[10px] uppercase tracking-widest text-stone-500 font-normal">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <span
          className={
            mono
              ? "mono text-base font-semibold"
              : "display text-3xl font-semibold"
          }
        >
          {value}
        </span>
      </CardContent>
    </Card>
  );
}
