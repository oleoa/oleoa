/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Me from "@/lib/assets/me.jpg";
import { toTitleCase } from "@/lib/utils";
import type { Stack } from "@/db/types";

export default function Sobre({ stacks }: { stacks: Stack[] }) {
  return (
    <section id="sobre" className="border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="mono-label mb-3">§ 01</p>
          <h2 className="display text-4xl md:text-5xl font-black leading-[0.95] tracking-tight mb-8">
            Sobre.
          </h2>
          <div className="relative aspect-square border border-stone-300">
            <Image
              src={Me}
              alt="Leonardo Abreu"
              fill
              sizes="(min-width: 768px) 41vw, 100vw"
              className="object-cover object-center grayscale"
              placeholder="blur"
              priority
            />
          </div>
          <p className="mono-label mt-4">Leonardo Abreu · São Paulo, BR</p>
        </div>

        <div className="md:col-span-7">
          <p className="drop-cap text-[1.0625rem] leading-[1.75] text-stone-800">
            Programo desde cedo, mas o que me move hoje é menos a linha de
            código e mais o ciclo completo — do problema do cliente à operação
            que roda sem supervisão. Comecei como desenvolvedor full-stack,
            rodei de agência a produto, e em 2025 fundei a{" "}
            <a
              href="https://strutura.ai"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-stone-900 underline-offset-2 hover:bg-amber-100 transition-colors"
            >
              Strutura
            </a>
            , uma firma de automação com IA para pequenas e médias empresas
            brasileiras.
          </p>
          <p className="mt-6 text-[1.0625rem] leading-[1.75] text-stone-800">
            Meu trabalho hoje se divide em duas frentes: produtos próprios da
            Strutura — CRM de conversas, sites para autoridades digitais,
            avaliação psicométrica para terapeutas — e engajamentos pontuais com
            clientes que precisam de engenharia precisa, como o{" "}
            <em className="italic">Portal Aviadores</em>, uma corretora de
            aeronaves no Campo de Marte.
          </p>
          <p className="mt-6 text-[1.0625rem] leading-[1.75] text-stone-800">
            Acredito em escopo pequeno, entrega honesta, e software que paga o
            próprio aluguel. Tudo o que aparece nesta publicação é real e está
            em produção.
          </p>

          <div className="mt-12">
            <div className="flex items-baseline justify-between border-b-2 border-stone-900 pb-2 mb-3">
              <p className="mono-label">Ferramentas de trabalho</p>
              <p className="mono text-[10px] uppercase tracking-widest text-stone-400">
                {String(stacks.length).padStart(2, "0")} itens
              </p>
            </div>

            <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-0">
              {stacks.map((row) => (
                <li
                  key={row._id}
                  className="border-b border-stone-200 last:border-b-0"
                >
                  <a
                    href={row.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 py-1.5 group hover:bg-stone-100 transition-colors"
                  >
                    {row.image ? (
                      <img
                        src={row.image}
                        alt=""
                        className="w-3.5 h-3.5 object-contain opacity-80 group-hover:opacity-100"
                      />
                    ) : (
                      <span className="w-3.5 h-3.5" />
                    )}
                    <span className="mono text-xs text-stone-900 truncate">
                      {toTitleCase(row.name)}
                    </span>
                    <span className="mono text-[10px] text-stone-400 ml-auto group-hover:text-stone-900 transition-colors">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
