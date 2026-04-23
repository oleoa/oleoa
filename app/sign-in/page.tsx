import PageFrame from "@/components/editorial/PageFrame";
import SignInForm from "./SignInForm";

export const metadata = {
    title: "Entrar — Leonardo Abreu",
};

export default function SignInPage() {
    return (
        <PageFrame issue="Acesso restrito">
            <div className="max-w-md mx-auto px-6 py-16">
                <header className="mb-10">
                    <p className="mono-label mb-3">§ Ω · Acesso</p>
                    <h1 className="display text-4xl md:text-5xl font-black tracking-tight leading-none">
                        Entrar.
                    </h1>
                    <p className="mt-3 text-stone-500">
                        Console editorial. Apenas para o autor.
                    </p>
                </header>
                <SignInForm />
            </div>
        </PageFrame>
    );
}
