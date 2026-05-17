import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: string;
  className?: string;
  align?: "left" | "right" | "center";
  render: (row: T) => ReactNode;
  width?: string;
}

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  emptyLabel = "Sin registros",
  rowHref,
  rowKey,
  dense = true,
}: {
  columns: Column<T>[];
  rows: T[];
  emptyLabel?: string;
  rowHref?: (row: T) => string;
  rowKey?: (row: T) => string;
  dense?: boolean;
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-surface-border bg-canvas-raised px-4 py-10 text-center text-sm text-ink-mid">
        {emptyLabel}
      </div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-md border border-surface-border">
      <table className="w-full border-collapse text-sm">
        <thead className="border-b border-surface-border bg-canvas-raised text-ink-mid">
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                style={c.width ? { width: c.width } : undefined}
                className={cn(
                  "px-3 py-2 text-left text-2xs font-semibold uppercase tracking-wider",
                  c.align === "right" && "text-right",
                  c.align === "center" && "text-center",
                  c.className,
                )}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-border">
          {rows.map((row) => {
            const content = columns.map((c) => (
              <td
                key={c.key}
                className={cn(
                  dense ? "px-3 py-1.5" : "px-3 py-3",
                  "align-top text-ink-high",
                  c.align === "right" && "text-right tabular-nums",
                  c.align === "center" && "text-center",
                  c.className,
                )}
              >
                {c.render(row)}
              </td>
            ));
            const key = rowKey ? rowKey(row) : row.id;
            if (rowHref) {
              return (
                <tr key={key} className="group transition-colors hover:bg-surface-hover">
                  <td className="hidden" />
                  {/* Render cells as TDs but wrap text via inner content; for link behaviour we make the first cell an anchor */}
                  {columns.map((c, idx) => (
                    <td
                      key={c.key}
                      className={cn(
                        dense ? "px-3 py-1.5" : "px-3 py-3",
                        "align-top text-ink-high",
                        c.align === "right" && "text-right tabular-nums",
                        c.align === "center" && "text-center",
                        c.className,
                      )}
                    >
                      {idx === 0 ? (
                        <a href={rowHref(row)} className="block w-full text-accent-ring hover:underline">
                          {c.render(row)}
                        </a>
                      ) : (
                        c.render(row)
                      )}
                    </td>
                  ))}
                </tr>
              );
            }
            return (
              <tr key={key} className="transition-colors hover:bg-surface-hover">
                {content}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
