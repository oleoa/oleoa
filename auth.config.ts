import type { NextAuthConfig } from "next-auth";

export default {
    providers: [],
    pages: { signIn: "/sign-in" },
    callbacks: {
        authorized({ auth, request }) {
            const path = request.nextUrl.pathname;
            const isProtected = path.startsWith("/dashboard") || path.startsWith("/settings");
            if (isProtected) return !!auth?.user;
            return true;
        },
    },
} satisfies NextAuthConfig;
