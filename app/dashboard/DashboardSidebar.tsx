"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  Layers,
  ArrowLeft,
  LogOut,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Início", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/projects", label: "Projetos", icon: FolderOpen },
  { href: "/dashboard/clients", label: "Clientes", icon: Users },
  { href: "/dashboard/stacks", label: "Stacks", icon: Layers },
];

export default function DashboardSidebar({
  session,
}: {
  session: { email: string | null } | null;
}) {
  const pathname = usePathname() ?? "";
  const initial = session?.email?.[0]?.toUpperCase() ?? "·";

  return (
    <Sidebar className="border-r-2 border-stone-900">
      <SidebarHeader className="border-b-2 border-stone-900 bg-stone-50">
        <Link href="/" className="block px-2 py-3 group">
          <p className="mono text-[10px] uppercase tracking-widest text-stone-500">
            Vol. IV
          </p>
          <p className="display text-xl font-black tracking-tight leading-none mt-1 group-hover:text-stone-600 transition-colors">
            Leonardo Abreu
          </p>
        </Link>
      </SidebarHeader>

      <SidebarContent className="bg-stone-50">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => {
                const active = item.exact
                  ? pathname === item.href
                  : pathname === item.href ||
                    pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className="mono text-xs uppercase tracking-widest data-[active=true]:bg-stone-900 data-[active=true]:text-stone-50 rounded-none"
                    >
                      <Link href={item.href}>
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t-2 border-stone-900 bg-stone-50 gap-2">
        <Link
          href="/"
          className="mono text-[10px] uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors inline-flex items-center gap-2 px-2 py-1"
        >
          <ArrowLeft className="h-3 w-3" /> site
        </Link>
        {session && (
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Menu do usuário"
              title={session.email ?? undefined}
              className="flex items-center gap-3 px-2 py-2 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-stone-900 hover:bg-stone-100 transition-colors"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-stone-900 mono text-xs font-bold">
                {initial}
              </span>
              <span className="mono text-xs text-stone-700 truncate max-w-[9rem]">
                {session.email ?? "sessão"}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              side="top"
              className="min-w-[10rem] rounded-none border-2 border-stone-900 bg-stone-50 p-0 shadow-none"
            >
              <DropdownMenuItem asChild>
                <Link
                  href="/settings"
                  className="mono text-xs uppercase tracking-widest text-stone-500 rounded-none px-3 py-2 focus:bg-stone-900 focus:text-stone-50"
                >
                  <Settings className="h-3.5 w-3.5" /> Configurações
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-stone-900" />
              <DropdownMenuItem
                onSelect={() => {
                  void signOut({ callbackUrl: "/" });
                }}
                className="mono text-xs uppercase tracking-widest text-stone-500 rounded-none px-3 py-2 cursor-pointer focus:bg-stone-900 focus:text-stone-50"
              >
                <LogOut className="h-3.5 w-3.5" /> Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <SidebarSeparator className="hidden" />
      </SidebarFooter>
    </Sidebar>
  );
}
