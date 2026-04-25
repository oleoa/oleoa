import SectionHeader from "@/components/editorial/SectionHeader";
import Chip from "@/components/editorial/Chip";
import type { Project } from "@/db/types";
import { toTitleCase } from "@/lib/utils";

export default function Trabalhos({ projects }: { projects: Project[] }) {
  return (
    <section id="trabalhos" className="border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        <SectionHeader
          section="02"
          title={
            <>
              Trabalhos <em className="font-normal italic">selecionados.</em>
            </>
          }
          subtitle="Produtos próprios e engajamentos com clientes."
        />

        {projects.length === 0 ? (
          <p className="mono text-sm uppercase tracking-widest text-stone-500 py-8 border-t border-stone-300">
            Nenhum projeto publicado ainda.
          </p>
        ) : (
          <ol className="border-t-2 border-stone-900">
            {projects.map((project, idx) => (
              <TrabalhoRow
                key={project._id}
                project={project}
                index={idx + 1}
              />
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}

function TrabalhoRow({ project, index }: { project: Project; index: number }) {
  const indexLabel = String(index).padStart(2, "0");
  const href = project.link ?? project.source ?? null;

  const Inner = (
    <div className="grid grid-cols-12 gap-6 px-1 py-8 group hover:bg-stone-100 transition-colors">
      <div className="col-span-2 md:col-span-1 mono-label text-stone-400 pt-2">
        Nº {indexLabel}
      </div>

      <div className="col-span-10 md:col-span-7">
        <div className="flex items-baseline gap-3 flex-wrap mb-2">
          {project.year && (
            <span className="mono-label text-stone-500">{project.year}</span>
          )}
          <span className="mono-label text-stone-400">
            {project.type === "commercial" ? "· comercial" : "· pessoal"}
          </span>
        </div>
        <h3 className="display text-2xl md:text-4xl font-black leading-tight tracking-tight text-stone-900 group-hover:text-stone-700 transition-colors">
          {project.name}
        </h3>
        <p className="mt-3 text-base md:text-lg leading-relaxed text-stone-700 max-w-2xl">
          {project.description}
        </p>
        {project.stacks.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.stacks.map((stack) => (
              <Chip key={stack._id} variant="soft">
                {toTitleCase(stack.name)}
              </Chip>
            ))}
          </div>
        )}
      </div>

      {href && (
        <div className="hidden md:flex col-span-4 items-end justify-end">
          <span className="mono text-xs uppercase tracking-widest text-stone-500 group-hover:text-stone-900 transition-colors">
            visitar →
          </span>
        </div>
      )}
    </div>
  );

  return (
    <li className="border-b border-stone-300">
      {href ? (
        <a href={href} target="_blank" rel="noreferrer" className="block">
          {Inner}
        </a>
      ) : (
        <div className="block">{Inner}</div>
      )}
    </li>
  );
}
