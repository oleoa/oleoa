"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInAction } from "@/app/actions/auth";

export default function SignInForm() {
    const [error, formAction, pending] = useActionState(signInAction, null);

    return (
        <form action={formAction} className="space-y-6">
            <div className="space-y-2">
                <label htmlFor="email" className="mono-label block">
                    Email
                </label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    autoFocus
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="password" className="mono-label block">
                    Senha
                </label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                />
            </div>
            {error && (
                <p className="mono text-xs text-red-700" role="alert">
                    {error}
                </p>
            )}
            <Button type="submit" disabled={pending} className="w-full">
                {pending ? "Entrando..." : "Entrar"}
            </Button>
        </form>
    );
}
