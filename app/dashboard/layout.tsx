import { auth } from "@/auth";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "./DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const sessionProp = session?.user ? { email: session.user.email ?? null } : null;

  return (
    <SidebarProvider>
      <DashboardSidebar session={sessionProp} />
      <SidebarInset className="bg-stone-50 text-stone-900">
        <SidebarTrigger className="md:hidden fixed top-3 left-3 z-20 bg-stone-50 border border-stone-900" />
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
