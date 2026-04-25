"use server";

import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { supabase } from "@/db/client";
import { getUserById } from "@/db/queries";

export type FormState = { error: string | null; success: boolean };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function updateProfileAction(
    _prev: FormState | null,
    formData: FormData,
): Promise<FormState> {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { error: "Não autorizado.", success: false };

    const nameRaw = String(formData.get("name") ?? "").trim();
    const name = nameRaw.length ? nameRaw : null;
    const email = String(formData.get("email") ?? "").trim().toLowerCase();

    if (!email) return { error: "Email é obrigatório.", success: false };
    if (!EMAIL_RE.test(email)) return { error: "Email inválido.", success: false };

    const sb = supabase();
    const { data: conflict, error: conflictErr } = await sb
        .from("users")
        .select("id")
        .ilike("email", email)
        .neq("id", userId)
        .limit(1);
    if (conflictErr) throw conflictErr;
    if (conflict && conflict.length > 0) return { error: "Email já em uso.", success: false };

    const { error: updateErr } = await sb
        .from("users")
        .update({ name, email })
        .eq("id", userId);
    if (updateErr) throw updateErr;

    return { error: null, success: true };
}

export async function changePasswordAction(
    _prev: FormState | null,
    formData: FormData,
): Promise<FormState> {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { error: "Não autorizado.", success: false };

    const currentPassword = String(formData.get("currentPassword") ?? "");
    const newPassword = String(formData.get("newPassword") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (!currentPassword || !newPassword) {
        return { error: "Preencha todos os campos.", success: false };
    }
    if (newPassword.length < 8) {
        return { error: "A nova senha precisa ter ao menos 8 caracteres.", success: false };
    }
    if (newPassword !== confirmPassword) {
        return { error: "A confirmação não bate com a nova senha.", success: false };
    }

    const user = await getUserById(userId);
    if (!user) return { error: "Usuário não encontrado.", success: false };

    const ok = await bcrypt.compare(currentPassword, user.password_hash);
    if (!ok) return { error: "Senha atual incorreta.", success: false };

    const password_hash = await bcrypt.hash(newPassword, 12);
    const { error: updateErr } = await supabase()
        .from("users")
        .update({ password_hash })
        .eq("id", userId);
    if (updateErr) throw updateErr;

    return { error: null, success: true };
}
