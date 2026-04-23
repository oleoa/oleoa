"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { sql } from "@/db/client";
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

    const conflict = (await sql`
        SELECT 1 FROM users
        WHERE lower(email) = ${email} AND id <> ${userId}
        LIMIT 1
    `) as { "?column?": number }[];
    if (conflict.length > 0) return { error: "Email já em uso.", success: false };

    await sql`
        UPDATE users
        SET name = ${name}, email = ${email}, updated_at = now()
        WHERE id = ${userId}
    `;

    revalidatePath("/settings");
    revalidatePath("/dashboard");

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
    await sql`
        UPDATE users
        SET password_hash = ${password_hash}, updated_at = now()
        WHERE id = ${userId}
    `;

    return { error: null, success: true };
}
