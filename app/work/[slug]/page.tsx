import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageFrame from "@/components/editorial/PageFrame";
import SectionHeader from "@/components/editorial/SectionHeader";
import Callout from "@/components/editorial/Callout";
import EditorialButton from "@/components/editorial/EditorialButton";
import Chip from "@/components/editorial/Chip";
import { toTitleCase } from "@/lib/utils";
import { getProjectBySlug, listFeaturedNav } from "@/db/queries";
import { auth } from "@/auth";

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const [featured, session] = await Promise.all([listFeaturedNav(), auth()]);
  const idx = featured.findIndex((p) => p._id === project._id);
  const prev = idx > 0 ? featured[idx - 1] : null;
  const next = idx >= 0 && idx < featured.length - 1 ? featured[idx + 1] : null;

  const issueLabel = project.order
    ? `Nº ${String(project.order).padStart(2, "0")}`
    : undefined;

  return (
    <PageFrame
      issue={issueLabel ? `${issueLabel} · Estudo` : "Estudo"}
      session={session?.user ? { email: session.user.email ?? null } : null}
    >
      <article>
        {/* Title block */}
        <header className="border-b-2 border-stone-900">
          <div className="max-w-4xl mx-auto px-6 pt-16 md:pt-24 pb-12">
            <p className="mono-label mb-6">
              § Estudo · {issueLabel ?? "—"}
              {project.year ? ` · ${project.year}` : ""}
            </p>
            <h1 className="display text-5xl md:text-7xl lg:text-[6.5rem] font-black leading-[0.9] tracking-tight">
              {project.name}
            </h1>
            {project.summary && (
              <p className="mt-8 text-xl md:text-2xl leading-snug text-stone-700 max-w-2xl font-serif italic">
                {project.summary}
              </p>
            )}
            <dl className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-stone-300 pt-6">
              <Meta label="Cliente" value={project.client ?? "—"} />
              <Meta label="Função" value={project.role ?? "—"} />
              <Meta label="Ano" value={project.year ?? "—"} />
              <Meta
                label="Status"
                value={
                  project.link ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className="underline decoration-stone-900 underline-offset-4 hover:bg-amber-100 transition-colors"
                    >
                      em produção
                    </a>
                  ) : (
                    "—"
                  )
                }
              />
            </dl>
          </div>
        </header>

        {/* Cover */}
        {project.cover && (
          <div className="border-b border-stone-200">
            <div className="max-w-5xl mx-auto px-6 py-8 md:py-12">
              <div className="border border-stone-300">
                <Image
                  src={project.cover}
                  alt={project.name}
                  width={1600}
                  height={1000}
                  className="w-full h-auto object-cover"
                  priority
                  unoptimized
                />
              </div>
              <p className="mono-label mt-3">
                Figura 1 · {project.client ?? project.name}
              </p>
            </div>
          </div>
        )}

        {/* Body */}
        <div className="max-w-3xl mx-auto px-6 py-16 md:py-20">
          {project.description && (
            <p className="drop-cap text-lg md:text-xl leading-[1.75] text-stone-800 mb-12">
              {project.description}
            </p>
          )}

          {project.problem && (
            <SectionContent section="01" title="O problema">
              {project.problem}
            </SectionContent>
          )}

          {project.approach && (
            <SectionContent section="02" title="A abordagem">
              {project.approach}
            </SectionContent>
          )}

          {project.outcome && (
            <SectionContent section="03" title="O resultado">
              {project.outcome}
            </SectionContent>
          )}

          {project.stacks.length > 0 && (
            <div className="mt-16">
              <p className="mono-label mb-4">§ Construído com</p>
              <div className="flex flex-wrap gap-1.5">
                {project.stacks.map((stack) => (
                  <Chip key={stack._id} variant="soft">
                    {toTitleCase(stack.name)}
                  </Chip>
                ))}
              </div>
            </div>
          )}

          <Callout variant="inverted" label="Colofão">
            <div className="flex flex-wrap items-center gap-3">
              {project.link && (
                <EditorialButton href={project.link} external variant="inverted">
                  ▸ visitar site
                </EditorialButton>
              )}
              {project.source && (
                <EditorialButton
                  href={project.source}
                  external
                  variant="inverted"
                >
                  → repositório
                </EditorialButton>
              )}
            </div>
          </Callout>
        </div>

        {/* Prev / Next */}
        {(prev || next) && (
          <nav className="border-t-2 border-stone-900">
            <div className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-2 gap-6">
              <div>
                {prev ? (
                  <Link href={`/work/${prev.slug}`} className="group block">
                    <p className="mono-label mb-2">← Anterior</p>
                    <p className="display text-xl font-bold group-hover:text-stone-600 transition-colors">
                      {prev.name}
                    </p>
                  </Link>
                ) : (
                  <span className="mono-label text-stone-400">— início —</span>
                )}
              </div>
              <div className="text-right">
                {next ? (
                  <Link href={`/work/${next.slug}`} className="group block">
                    <p className="mono-label mb-2">Próximo →</p>
                    <p className="display text-xl font-bold group-hover:text-stone-600 transition-colors">
                      {next.name}
                    </p>
                  </Link>
                ) : (
                  <span className="mono-label text-stone-400">— fim —</span>
                )}
              </div>
            </div>
          </nav>
        )}
      </article>
    </PageFrame>
  );
}

function Meta({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <dt className="mono-label mb-1">{label}</dt>
      <dd className="text-stone-900 text-base md:text-lg">{value}</dd>
    </div>
  );
}

function SectionContent({
  section,
  title,
  children,
}: {
  section: string;
  title: string;
  children: string;
}) {
  const paragraphs = children
    .split(/\n\s*\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return (
    <div className="mb-14">
      <SectionHeader section={section} title={title} />
      <div className="reading">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-stone-800">
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}
