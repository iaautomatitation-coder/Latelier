import type { LucideIcon } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export function StubPanel({
  crumbs,
  eyebrow,
  title,
  description,
  icon: Icon,
  capabilities,
  schema,
}: {
  crumbs: { label: string; href?: string }[];
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  capabilities: string[];
  schema: { table: string; fields: string[] }[];
}) {
  return (
    <PageShell crumbs={crumbs}>
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={<Badge tone="warn">Próxima fase</Badge>}
      />

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-start gap-3 border-b border-surface-border pb-4">
            <div className="rounded border border-surface-border bg-canvas-raised p-2.5 text-accent-ring">
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-high">Capacidades planeadas</h3>
              <p className="text-xs text-ink-mid">El módulo está reservado en el sidebar y conectado al schema base.</p>
            </div>
          </div>
          <ul className="space-y-2">
            {capabilities.map((c) => (
              <li key={c} className="flex items-start gap-2 text-sm text-ink-high">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-ring" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <div className="mb-3 border-b border-surface-border pb-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-high">Schema base</h3>
            <p className="text-xs text-ink-mid">Tablas reservadas para este módulo</p>
          </div>
          <ul className="space-y-3 font-mono text-2xs">
            {schema.map((t) => (
              <li key={t.table}>
                <p className="font-semibold text-accent-ring">{t.table}</p>
                <ul className="mt-1 space-y-0.5 text-ink-mid">
                  {t.fields.map((f) => (
                    <li key={f}>· {f}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </PageShell>
  );
}
