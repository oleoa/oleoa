import { cn } from "@/lib/utils";

type CalloutVariant = "neutral" | "amber" | "inverted";

type CalloutProps = {
  label?: string;
  children: React.ReactNode;
  variant?: CalloutVariant;
  className?: string;
};

const variantClass: Record<CalloutVariant, string> = {
  neutral: "bg-stone-100 border-stone-900",
  amber: "bg-amber-50 border-stone-900",
  inverted: "bg-stone-900 border-amber-200 text-stone-50",
};

export default function Callout({
  label,
  children,
  variant = "neutral",
  className,
}: CalloutProps) {
  const isInverted = variant === "inverted";
  return (
    <div
      className={cn(
        "border-l-4 pl-5 pr-4 py-4 my-8",
        variantClass[variant],
        className,
      )}
    >
      {label && (
        <p
          className={cn(
            "mono text-[10px] uppercase tracking-widest mb-2",
            isInverted ? "text-amber-200" : "text-stone-500",
          )}
        >
          {label}
        </p>
      )}
      <div className={cn("text-base leading-relaxed", isInverted && "text-stone-50")}>
        {children}
      </div>
    </div>
  );
}
