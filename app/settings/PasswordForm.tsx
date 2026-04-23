"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { changePasswordAction, type FormState } from "@/app/actions/profile";

const initialState: FormState = { error: null, success: false };

export default function PasswordForm() {
    const [state, formAction, pending] = useActionState(changePasswordAction, initialState);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state.success) formRef.current?.reset();
    }, [state.success]);

    return (
        <form ref={formRef} action={formAction} className="space-y-6">
            <div className="space-y-2">
                <label htmlFor="currentPassword" className="mono-label block">
                    Senha atual
                </label>
                <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    autoComplete="current-password"
                    required
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="newPassword" className="mono-label block">
                    Nova senha
                </label>
                <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="confirmPassword" className="mono-label block">
                    Confirmar nova senha
                </label>
                <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                />
            </div>
            {state.error && (
                <p className="mono text-xs text-red-700" role="alert">
                    {state.error}
                </p>
            )}
            {state.success && !state.error && (
                <p className="mono text-xs text-emerald-700" role="status">
                    Senha atualizada.
                </p>
            )}
            <Button type="submit" disabled={pending}>
                {pending ? "Atualizando..." : "Atualizar senha"}
            </Button>
        </form>
    );
}
