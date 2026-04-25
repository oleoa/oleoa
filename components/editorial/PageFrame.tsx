"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type PageFrameProps = {
  children: React.ReactNode;
  volume?: string;
  issue?: string;
  className?: string;
  session?: { email: string | null } | null;
};

export default function PageFrame({
  children,
  volume = "Vol. IV",
  issue,
  className,
  session = null,
}: PageFrameProps) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  const initial = session?.email?.[0]?.toUpperCase() ?? "·";

  return (
    <div className={cn("min-h-screen flex flex-col bg-stone-50 text-stone-900", className)}>
      <header className="sticky top-0 z-20 border-b-2 border-stone-900 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-baseline justify-between gap-4">
          <Link href="/" className="flex items-baseline gap-4 group">
            <span className="mono-label hidden md:inline">{volume}</span>
            <span className="display text-xl md:text-2xl font-black tracking-tight group-hover:text-stone-600 transition-colors">
              Leonardo Abreu
            </span>
            {issue && (
              <span className="mono-label hidden lg:inline">{issue}</span>
            )}
          </Link>

          <nav className="flex items-center gap-6">
            {!isDashboard && session && (
              <Link
                href="/dashboard"
                className="mono text-xs uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors"
              >
                dashboard
              </Link>
            )}
            {isDashboard && (
              <Link
                href="/"
                className="mono text-xs uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors"
              >
                ← site
              </Link>
            )}
            {session && (
              <DropdownMenu>
                <DropdownMenuTrigger
                  aria-label="Menu do usuário"
                  title={session.email ?? undefined}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-stone-900 mono text-xs font-bold cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50 transition-colors hover:bg-stone-900 hover:text-stone-50"
                >
                  {initial}
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="min-w-[10rem] rounded-none border-2 border-stone-900 bg-stone-50 p-0 shadow-none"
                >
                  <DropdownMenuItem asChild>
                    <Link
                      href="/settings"
                      className="mono text-xs uppercase tracking-widest text-stone-500 rounded-none px-3 py-2 focus:bg-stone-900 focus:text-stone-50"
                    >
                      Configurações
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-stone-900" />
                  <DropdownMenuItem
                    onSelect={() => {
                      void signOut({ callbackUrl: "/" });
                    }}
                    className="mono text-xs uppercase tracking-widest text-stone-500 rounded-none px-3 py-2 cursor-pointer focus:bg-stone-900 focus:text-stone-50"
                  >
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t-2 border-stone-900 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row gap-2 md:justify-between md:items-baseline">
          <span className="mono-label">
            Leonardo Abreu · {new Date().getFullYear()}
          </span>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://wa.me/351933144558?text=Oi%20Leonardo%2C%20vi%20seu%20portf%C3%B3lio%20e%20gostaria%20de%20conversar."
              target="_blank"
              rel="noreferrer"
              className="mono text-xs uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors"
            >
              whatsapp →
            </a>
            <a
              href="mailto:leonardo.abreu.de.paulo@gmail.com"
              className="mono text-xs uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors"
            >
              email →
            </a>
            <a
              href="https://www.linkedin.com/in/oleoa/"
              target="_blank"
              rel="noreferrer"
              className="mono text-xs uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors"
            >
              linkedin →
            </a>
            <a
              href="https://github.com/oleoa"
              target="_blank"
              rel="noreferrer"
              className="mono text-xs uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors"
            >
              github →
            </a>
            <a
              href="https://strutura.ai"
              target="_blank"
              rel="noreferrer"
              className="mono text-xs uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors"
            >
              strutura.ai →
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
