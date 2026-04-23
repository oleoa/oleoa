"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

export async function signInAction(_prev: string | null, formData: FormData): Promise<string | null> {
    try {
        await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirectTo: "/dashboard",
        });
        return null;
    } catch (error) {
        if (error instanceof AuthError) {
            if (error.type === "CredentialsSignin") return "Email ou senha inválidos.";
            return "Não foi possível autenticar. Tente novamente.";
        }
        throw error;
    }
}

export async function signOutAction(): Promise<void> {
    await signOut({ redirectTo: "/" });
}
