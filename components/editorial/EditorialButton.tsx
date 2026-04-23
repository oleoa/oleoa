"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type EditorialButtonProps = {
  children: React.ReactNode;
  href?: string;
  external?: boolean;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "inverted";
  size?: "md" | "sm";
  className?: string;
  type?: "button" | "submit";
};

const variantClass = {
  primary:
    "border-2 border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-stone-50",
  ghost:
    "border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-stone-50",
  inverted:
    "border-2 border-stone-50 bg-stone-900 text-stone-50 hover:bg-amber-200 hover:text-stone-900 hover:border-amber-200",
};

const sizeClass = {
  md: "px-4 py-2 text-xs",
  sm: "px-2 py-1 text-[11px]",
};

export default function EditorialButton({
  children,
  href,
  external,
  onClick,
  variant = "primary",
  size = "md",
  className,
  type = "button",
}: EditorialButtonProps) {
  const classes = cn(
    "mono uppercase tracking-widest inline-flex items-center gap-2 transition-colors",
    variantClass[variant],
    sizeClass[size],
    className,
  );

  if (href) {
    if (external || href.startsWith("http") || href.startsWith("mailto:")) {
      return (
        <a
          href={href}
          target={external ?? href.startsWith("http") ? "_blank" : undefined}
          rel={external ?? href.startsWith("http") ? "noreferrer" : undefined}
          className={classes}
        >
          {children}
        </a>
      );
    }
    if (href.startsWith("#")) {
      return (
        <a
          href={href}
          onClick={(e) => {
            e.preventDefault();
            const el = document.getElementById(href.slice(1));
            el?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className={classes}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
