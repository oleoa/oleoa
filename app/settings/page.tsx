import { redirect } from "next/navigation";
import PageFrame from "@/components/editorial/PageFrame";
import SectionHeader from "@/components/editorial/SectionHeader";
import { auth } from "@/auth";
import { getUserById } from "@/db/queries";
import ProfileForm from "./ProfileForm";
import PasswordForm from "./PasswordForm";

export default async function SettingsPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/sign-in");

    const user = await getUserById(session.user.id);
    if (!user) redirect("/sign-in");

    return (
        <PageFrame session={{ email: session.user.email ?? null }}>
            <div className="max-w-2xl mx-auto px-6 py-12 space-y-16">
                <header>
                    <p className="mono-label mb-3">§ Configurações</p>
                    <h1 className="display text-4xl md:text-5xl font-black tracking-tight leading-none">
                        Perfil
                    </h1>
                    <p className="mt-3 text-stone-500">
                        Edite os dados da sua conta.
                    </p>
                </header>

                <section>
                    <SectionHeader section="01" title="Dados da conta" />
                    <ProfileForm initialName={user.name} initialEmail={user.email} />
                </section>

                <section>
                    <SectionHeader section="02" title="Alterar senha" />
                    <PasswordForm />
                </section>
            </div>
        </PageFrame>
    );
}
