import Link from "next/link";
import SectionHeader from "@/components/editorial/SectionHeader";

const experiments = [
  {
    number: "01",
    name: "Tabuleiro de Xadrez",
    summary:
      "Xadrez jogável em React, com lógica de movimentos, xeque e promoções. Exercício de estado e representação.",
    href: "/projects/chess",
    label: "/projects/chess",
  },
  {
    number: "02",
    name: "Calendário da Vida",
    summary:
      "Visualização da vida em semanas. Digite seu aniversário e uma expectativa — veja o tempo como ele é.",
    href: "/projects/calendar",
    label: "/projects/calendar",
  },
];

export default function Experimentos() {
  return (
    <section id="experimentos" className="border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        <SectionHeader
          section="03"
          title={
            <>
              Experimentos <em className="font-normal italic">avulsos.</em>
            </>
          }
          subtitle="Peças interativas que não são produto, mas servem como laboratório — e às vezes viram conversa."
        />

        <div className="grid md:grid-cols-2 gap-8 border-t-2 border-stone-900 pt-8">
          {experiments.map((exp) => (
            <Link
              key={exp.href}
              href={exp.href}
              className="group border border-stone-300 p-6 hover:bg-stone-100 transition-colors"
            >
              <p className="mono-label mb-3">Nº {exp.number}</p>
              <h3 className="display text-2xl md:text-3xl font-black tracking-tight mb-3 group-hover:text-stone-700 transition-colors">
                {exp.name}
              </h3>
              <p className="text-base leading-relaxed text-stone-700 mb-4">
                {exp.summary}
              </p>
              <p className="mono text-xs uppercase tracking-widest text-stone-500 group-hover:text-stone-900 transition-colors">
                {exp.label} →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
