import { cn } from "@/lib/utils/cn";
import type { LucideIcon } from "lucide-react";

export function KpiCard({
  label,
  value,
  delta,
  hint,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string | number;
  delta?: string;
  hint?: string;
  icon?: LucideIcon;
  tone?: "default" | "ok" | "warn" | "crit" | "accent";
}) {
  const accent = {
    default: "text-ink-high",
    ok: "text-signal-ok",
    warn: "text-signal-warn",
    crit: "text-signal-crit",
    accent: "text-accent-ring",
  }[tone];

  return (
    <div className="relative rounded-md border border-surface-border bg-surface p-4 shadow-panel">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-2xs font-medium uppercase tracking-wider text-ink-mid">{label}</p>
          <p className={cn("mt-1 text-2xl font-semibold tabular-nums", accent)}>{value}</p>
          {hint ? <p className="mt-1 text-xs text-ink-low">{hint}</p> : null}
        </div>
        {Icon ? (
          <div className="rounded border border-surface-border bg-canvas-raised p-2 text-ink-mid">
            <Icon className="h-4 w-4" />
          </div>
        ) : null}
      </div>
      {delta ? (
        <p className="mt-3 border-t border-surface-border pt-2 font-mono text-2xs text-ink-mid">{delta}</p>
      ) : null}
    </div>
  );
}
