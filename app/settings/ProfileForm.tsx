"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProfileAction, type FormState } from "@/app/actions/profile";

type Props = {
    initialName: string | null;
    initialEmail: string;
};

const initialState: FormState = { error: null, success: false };

export default function ProfileForm({ initialName, initialEmail }: Props) {
    const [state, formAction, pending] = useActionState(updateProfileAction, initialState);

    return (
        <form action={formAction} className="space-y-6">
            <div className="space-y-2">
                <label htmlFor="name" className="mono-label block">
                    Nome
                </label>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    defaultValue={initialName ?? ""}
                />
            </div>
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
                    defaultValue={initialEmail}
                />
            </div>
            {state.error && (
                <p className="mono text-xs text-red-700" role="alert">
                    {state.error}
                </p>
            )}
            {state.success && !state.error && (
                <p className="mono text-xs text-emerald-700" role="status">
                    Salvo.
                </p>
            )}
            <Button type="submit" disabled={pending}>
                {pending ? "Salvando..." : "Salvar"}
            </Button>
        </form>
    );
}
