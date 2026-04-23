import LivingCalendar from "@/components/LivingCalendar";
import PageFrame from "@/components/editorial/PageFrame";
import { auth } from "@/auth";

export default async function CalendarPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const session = await auth();
  const isBirthday =
    slug &&
    slug[0] &&
    slug[0].split("-").length === 3 &&
    slug[0].split("-")[0].length === 4 &&
    slug[0].split("-")[1].length === 2 &&
    Number(slug[0].split("-")[1]) > 0 &&
    Number(slug[0].split("-")[1]) <= 12 &&
    slug[0].split("-")[2].length === 2 &&
    Number(slug[0].split("-")[2]) > 0 &&
    Number(slug[0].split("-")[2]) <= 31;
  const birthday = isBirthday ? slug[0] : "";
  const yearsToLive = slug ? (slug[1] ? Number(slug[1]) : 0) : 0;
  const isNotion = slug ? slug.includes("notion") : false;

  if (isNotion) {
    return (
      <LivingCalendar
        birthday={birthday}
        yearsToLive={yearsToLive}
        isNotion={isNotion}
      />
    );
  }

  return (
    <PageFrame
      issue="Experimento · Calendário"
      session={session?.user ? { email: session.user.email ?? null } : null}
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-10">
          <p className="mono-label mb-3">§ Exp · 02</p>
          <h1 className="display text-4xl md:text-6xl font-black tracking-tight leading-none">
            Calendário{" "}
            <em className="font-normal italic">da Vida.</em>
          </h1>
          <p className="mt-4 text-stone-600 max-w-2xl leading-relaxed">
            Cada quadrado é uma semana. Digite seu aniversário e veja o tempo
            como ele é.
          </p>
        </header>
        <div className="border-2 border-stone-900 bg-white p-4 md:p-8 overflow-x-auto">
          <LivingCalendar
            birthday={birthday}
            yearsToLive={yearsToLive}
            isNotion={isNotion}
          />
        </div>
      </div>
    </PageFrame>
  );
}
