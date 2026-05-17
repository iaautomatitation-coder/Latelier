import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

export function Card({
  children,
  className,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-md border border-surface-border bg-surface shadow-panel",
        padded && "p-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-3 flex items-start justify-between gap-3 border-b border-surface-border pb-3", className)}>
      <div className="min-w-0">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-high">{title}</h3>
        {subtitle ? <p className="mt-0.5 text-xs text-ink-mid">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
