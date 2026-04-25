export default function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1">
      <p className="mono text-[10px] uppercase tracking-widest text-stone-500">
        {label}
      </p>
      {children}
      {hint && <p className="text-[11px] text-stone-500">{hint}</p>}
    </div>
  );
}
