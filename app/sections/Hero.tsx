"use client";

import EditorialButton from "@/components/editorial/EditorialButton";

export default function Hero() {
  return (
    <section className="border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-12 md:pt-16 md:pb-20 grid gap-8 md:grid-cols-12 items-end">
        <div className="md:col-span-8">
          <p className="mono-label mb-4">§ 00 · Abertura</p>
          <h1 className="display text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight">
            Engenheiro,{" "}
            <em className="font-normal italic">fundador</em>,
            <br />
            construtor de{" "}
            <em className="font-normal italic">coisas úteis.</em>
          </h1>
          <p className="mt-5 max-w-2xl text-base md:text-lg leading-relaxed text-stone-700">
            Leonardo Abreu. Fundador da{" "}
            <a
              href="https://strutura.ai"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-stone-900 underline-offset-4 hover:bg-stone-900 hover:text-stone-50 transition-colors"
            >
              Strutura
            </a>
            , onde desenho e construo software — de CRMs a avaliações
            psicométricas, de sites a plataformas de corretagem — para empresas
            que precisam escalar sem inflar equipe.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <EditorialButton href="#trabalhos" variant="primary">
              ▸ Ver trabalhos
            </EditorialButton>
            <EditorialButton
              href="https://wa.me/351933144558?text=Oi%20Leonardo%2C%20vi%20seu%20portf%C3%B3lio%20e%20gostaria%20de%20conversar."
              external
              variant="ghost"
            >
              → Entrar em contato
            </EditorialButton>
          </div>
        </div>

        <aside className="md:col-span-4 md:border-l md:border-stone-300 md:pl-6 text-stone-500">
          <p className="mono-label mb-3">Colofão</p>
          <dl className="mono text-xs space-y-2 uppercase tracking-widest">
            <div className="flex justify-between gap-4">
              <dt>Volume</dt>
              <dd className="text-stone-900">IV</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Ano</dt>
              <dd className="text-stone-900">{new Date().getFullYear()}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Base</dt>
              <dd className="text-stone-900">Brasil</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Foco</dt>
              <dd className="text-stone-900 text-right">Software &amp; IA</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
}
