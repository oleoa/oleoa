import { cn } from "@/lib/utils";

type ChipProps = {
  children: React.ReactNode;
  variant?: "strong" | "soft" | "outline";
  className?: string;
};

const variantClass = {
  strong: "bg-stone-900 text-stone-50",
  soft: "bg-stone-200 text-stone-800",
  outline: "border border-stone-900 text-stone-900",
};

export default function Chip({
  children,
  variant = "soft",
  className,
}: ChipProps) {
  return (
    <span
      className={cn(
        "mono text-[10px] uppercase tracking-widest px-2 py-0.5 inline-block",
        variantClass[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
