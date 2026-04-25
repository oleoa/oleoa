import Link from "next/link";
import SectionHeader from "@/components/editorial/SectionHeader";
import type { Project } from "@/db/types";

export default function Experimentos({ projects }: { projects: Project[] }) {
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

        {projects.length === 0 ? (
          <p className="mono text-sm uppercase tracking-widest text-stone-500 py-8 border-t border-stone-300">
            Nenhum experimento publicado ainda.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 border-t-2 border-stone-900 pt-8">
            {projects.map((project, idx) => {
              const number = String(idx + 1).padStart(2, "0");
              const href = project.link ?? project.source ?? null;
              const label = href ?? "—";
              const isInternal = href?.startsWith("/") ?? false;

              const card = (
                <>
                  <p className="mono-label mb-3">Nº {number}</p>
                  <h3 className="display text-2xl md:text-3xl font-black tracking-tight mb-3 group-hover:text-stone-700 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-base leading-relaxed text-stone-700 mb-4">
                    {project.description}
                  </p>
                  <p className="mono text-xs uppercase tracking-widest text-stone-500 group-hover:text-stone-900 transition-colors">
                    {label}{href ? " →" : ""}
                  </p>
                </>
              );

              const className =
                "group border border-stone-300 p-6 hover:bg-stone-100 transition-colors";

              if (!href) {
                return (
                  <div key={project._id} className={className}>
                    {card}
                  </div>
                );
              }

              if (isInternal) {
                return (
                  <Link key={project._id} href={href} className={className}>
                    {card}
                  </Link>
                );
              }

              return (
                <a
                  key={project._id}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className={className}
                >
                  {card}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
