import PageFrame from "@/components/editorial/PageFrame";
import Chess from "./components/Chess";
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();
  return (
    <PageFrame
      issue="Experimento · Xadrez"
      session={session?.user ? { email: session.user.email ?? null } : null}
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-10">
          <p className="mono-label mb-3">§ Exp · 01</p>
          <h1 className="display text-4xl md:text-6xl font-black tracking-tight leading-none">
            Tabuleiro de{" "}
            <em className="font-normal italic">Xadrez.</em>
          </h1>
          <p className="mt-4 text-stone-600 max-w-2xl leading-relaxed">
            Xadrez jogável em React. Arraste uma peça para movê-la.
          </p>
        </header>
        <div className="border-2 border-stone-900 p-4 md:p-8 bg-white flex items-center justify-center">
          <Chess />
        </div>
      </div>
    </PageFrame>
  );
}
