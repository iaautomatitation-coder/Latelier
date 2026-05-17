import { cn } from "@/lib/utils/cn";

export function ProgressBar({
  value,
  tone = "accent",
  showLabel = false,
  className,
}: {
  value: number;
  tone?: "accent" | "ok" | "warn" | "crit";
  showLabel?: boolean;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  const bar = {
    accent: "bg-accent",
    ok: "bg-signal-ok",
    warn: "bg-signal-warn",
    crit: "bg-signal-crit",
  }[tone];
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-canvas-sunken">
        <div className={cn("h-full", bar)} style={{ width: `${pct}%` }} />
      </div>
      {showLabel ? <span className="w-10 text-right font-mono text-2xs text-ink-mid">{pct}%</span> : null}
    </div>
  );
}
