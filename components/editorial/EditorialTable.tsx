import { cn } from "@/lib/utils";

type Column<T> = {
  header: string;
  accessor: (row: T) => React.ReactNode;
  className?: string;
};

type EditorialTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  className?: string;
  empty?: React.ReactNode;
};

export default function EditorialTable<T>({
  columns,
  data,
  className,
  empty,
}: EditorialTableProps<T>) {
  if (data.length === 0 && empty) {
    return (
      <div className="mono text-xs uppercase tracking-widest text-stone-500 py-6">
        {empty}
      </div>
    );
  }

  return (
    <table className={cn("mono text-sm w-full border-collapse", className)}>
      <thead>
        <tr className="border-b-2 border-stone-900">
          {columns.map((col, i) => (
            <th
              key={i}
              className={cn(
                "text-left py-2 px-0 pr-4 text-[10px] uppercase tracking-widest text-stone-500 font-normal",
                col.className,
              )}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr
            key={i}
            className="border-b border-stone-200 hover:bg-stone-100 transition-colors"
          >
            {columns.map((col, j) => (
              <td key={j} className={cn("py-3 pr-4 align-top", col.className)}>
                {col.accessor(row)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
