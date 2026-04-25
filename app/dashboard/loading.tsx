"use client";

import { useEffect, useState } from "react";

const VERBS = [
  "compondo",
  "imprimindo",
  "revisando",
  "encadernando",
  "entregando",
] as const;

const PROOF_NUMBERS = ["0001", "0002", "0003"] as const;

export default function DashboardLoading() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setTick((t) => t + 1);
    }, 700);
    return () => window.clearInterval(id);
  }, []);

  const verb = VERBS[tick % VERBS.length];
  const proof = PROOF_NUMBERS[tick % PROOF_NUMBERS.length];
  const year = new Date().getFullYear();

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Carregando"
      className="relative flex min-h-[calc(100vh-1rem)] flex-col bg-stone-50 text-stone-900"
    >
      <div className="flex items-start justify-between border-b-2 border-stone-900 px-6 py-4 md:px-10">
        <p className="mono-label">§ Ω · Compondo edição</p>
        <p className="mono-label hidden sm:block">
          Ed. {year} / OLEOA
        </p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
        <div className="relative">
          <span
            aria-hidden
            className="display absolute inset-0 select-none text-amber-200 text-[10rem] leading-none translate-x-2 translate-y-1 md:text-[18rem]"
          >
            Ω
          </span>
          <span
            aria-hidden
            className="display animate-glyph-spin block select-none text-stone-900 text-[10rem] leading-none md:text-[18rem]"
          >
            Ω
          </span>
        </div>

        <p
          key={verb}
          className="mono-label mt-10 animate-in fade-in duration-300"
        >
          {verb}
        </p>

        <div className="mt-8 flex flex-col items-start gap-2">
          <span className="block h-px w-32 origin-left bg-stone-900 animate-ink-sweep" />
          <span
            className="block h-px w-48 origin-left bg-stone-900 animate-ink-sweep"
            style={{ animationDelay: "200ms" }}
          />
          <span
            className="block h-px w-24 origin-left bg-stone-900 animate-ink-sweep"
            style={{ animationDelay: "400ms" }}
          />
        </div>
      </div>

      <div className="flex items-baseline justify-between border-t-2 border-stone-900 px-6 py-4 md:px-10">
        <p className="mono-label">Provas</p>
        <p
          key={proof}
          className="mono text-[10px] uppercase tracking-widest text-stone-500 animate-in fade-in duration-300"
        >
          {proof}
        </p>
      </div>
    </div>
  );
}
