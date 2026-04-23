import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  section: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  id?: string;
};

export default function SectionHeader({
  section,
  title,
  subtitle,
  align = "left",
  className,
  id,
}: SectionHeaderProps) {
  return (
    <div
      id={id}
      className={cn(
        "mb-10",
        align === "center" && "text-center",
        className,
      )}
    >
      <p className="mono-label mb-3">§ {section}</p>
      <h2 className="display text-4xl md:text-5xl lg:text-6xl font-black leading-[0.95] tracking-tight text-stone-900">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg leading-relaxed text-stone-600 max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
