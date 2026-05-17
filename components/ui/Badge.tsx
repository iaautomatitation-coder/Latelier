import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

type Tone = "neutral" | "ok" | "warn" | "crit" | "info" | "accent";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-surface text-ink-mid border-surface-border",
  ok: "bg-signal-ok/10 text-signal-ok border-signal-ok/30",
  warn: "bg-signal-warn/10 text-signal-warn border-signal-warn/30",
  crit: "bg-signal-crit/10 text-signal-crit border-signal-crit/30",
  info: "bg-signal-info/10 text-signal-info border-signal-info/30",
  accent: "bg-accent/10 text-accent-ring border-accent/30",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-2xs uppercase tracking-wide",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
