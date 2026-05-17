export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "2-digit" });
}

export function formatPercent(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("es-MX").format(n);
}

export function relativeDelta(targetIso: string, fromIso?: string): string {
  const target = new Date(targetIso).getTime();
  const from = fromIso ? new Date(fromIso).getTime() : Date.now();
  const days = Math.round((target - from) / (1000 * 60 * 60 * 24));
  if (days === 0) return "hoy";
  if (days > 0) return `en ${days}d`;
  return `hace ${Math.abs(days)}d`;
}
