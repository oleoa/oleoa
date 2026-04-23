import EditorialButton from "@/components/editorial/EditorialButton";

export default function Contato() {
  return (
    <section id="contato" className="bg-stone-900 text-stone-50">
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="mono-label mb-3" style={{ color: "#fde68a" }}>
            § 04 · Contato
          </p>
          <h2 className="display text-4xl md:text-6xl font-black leading-[0.95] tracking-tight mb-8">
            Vamos conversar sobre{" "}
            <em className="font-normal italic">o seu problema</em>.
          </h2>
          <p className="text-lg leading-relaxed text-stone-300 max-w-xl mb-10">
            Se você tem um problema de software, operação ou automação — mesmo
            que ainda mal formulado — escreva. Respondo em dias úteis, e a
            primeira conversa não custa nada.
          </p>
          <div className="flex flex-wrap gap-3">
            <EditorialButton
              href="https://wa.me/351933144558?text=Oi%20Leonardo%2C%20vi%20seu%20portf%C3%B3lio%20e%20gostaria%20de%20conversar."
              external
              variant="inverted"
            >
              ▸ whatsapp · +351 933 144 558
            </EditorialButton>
            <EditorialButton
              href="mailto:leonardo.abreu.de.paulo@gmail.com"
              variant="inverted"
            >
              → email
            </EditorialButton>
          </div>
        </div>

        <aside className="md:col-span-5 md:border-l md:border-stone-700 md:pl-8 space-y-6">
          <div>
            <p
              className="mono text-[10px] uppercase tracking-widest mb-1"
              style={{ color: "#fde68a" }}
            >
              LinkedIn
            </p>
            <a
              href="https://www.linkedin.com/in/oleoa/"
              target="_blank"
              rel="noreferrer"
              className="display text-xl hover:text-amber-200 transition-colors"
            >
              /in/oleoa
            </a>
          </div>
          <div>
            <p
              className="mono text-[10px] uppercase tracking-widest mb-1"
              style={{ color: "#fde68a" }}
            >
              GitHub
            </p>
            <a
              href="https://github.com/oleoa"
              target="_blank"
              rel="noreferrer"
              className="display text-xl hover:text-amber-200 transition-colors"
            >
              @oleoa
            </a>
          </div>
          <div>
            <p
              className="mono text-[10px] uppercase tracking-widest mb-1"
              style={{ color: "#fde68a" }}
            >
              Empresa
            </p>
            <a
              href="https://strutura.ai"
              target="_blank"
              rel="noreferrer"
              className="display text-xl hover:text-amber-200 transition-colors"
            >
              Strutura — Automação com IA
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
