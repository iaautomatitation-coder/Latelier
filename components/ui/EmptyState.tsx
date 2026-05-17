import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-surface-border bg-canvas-raised px-6 py-16 text-center">
      {Icon ? (
        <div className="mb-3 rounded-full border border-surface-border bg-surface p-3 text-ink-mid">
          <Icon className="h-6 w-6" />
        </div>
      ) : null}
      <h3 className="text-sm font-semibold text-ink-high">{title}</h3>
      {description ? <p className="mt-1 max-w-md text-xs text-ink-mid">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
