"use client";

import { usePathname } from "next/navigation";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const pathname = usePathname();
  return (
    <div className="fixed top-0 right-0 w-full h-14 py-4 flex justify-between items-center margin bg-white border-b-2">
      <div className="flex gap-4">
        {pathname == "/dashboard" && (
          <Link href={"/"}>
            <Button>Home</Button>
          </Link>
        )}
        {pathname == "/" && (
          <Link href={"/dashboard"}>
            <Button>Dashboard</Button>
          </Link>
        )}
      </div>
      <UserButton />
    </div>
  );
}
