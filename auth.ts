import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { supabase } from "@/db/client";
import authConfig from "./auth.config";

type DbUser = {
    id: string;
    email: string;
    password_hash: string;
    name: string | null;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    session: { strategy: "jwt" },
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            async authorize(creds) {
                const email = String(creds?.email ?? "").toLowerCase().trim();
                const password = String(creds?.password ?? "");
                if (!email || !password) return null;

                const { data, error } = await supabase()
                    .from("users")
                    .select("id, email, password_hash, name")
                    .ilike("email", email)
                    .maybeSingle();
                if (error) throw error;
                const user = data as DbUser | null;
                if (!user) return null;

                const ok = await bcrypt.compare(password, user.password_hash);
                if (!ok) return null;

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name ?? undefined,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user?.id) token.sub = user.id;
            return token;
        },
        async session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
            }
            return session;
        },
    },
});
