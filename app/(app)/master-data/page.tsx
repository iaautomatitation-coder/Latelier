import { PageShell } from "@/components/layout/PageShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { listMdmDomains, listMdmCatalogs } from "@/lib/data";
import {
  Building2,
  Workflow,
  Wrench,
  Settings,
  ShieldCheck,
  Boxes,
  Briefcase,
  AlertOctagon,
  LineChart,
  type LucideIcon,
  ChevronRight,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Building2,
  Workflow,
  Wrench,
  Settings,
  ShieldCheck,
  Boxes,
  Briefcase,
  AlertOctagon,
  LineChart,
};

export default async function MasterDataPage() {
  const [domains, catalogs] = await Promise.all([listMdmDomains(), listMdmCatalogs()]);
  const catalogsByDomain = new Map<string, typeof catalogs>();
  for (const c of catalogs) {
    const arr = catalogsByDomain.get(c.domain_code) ?? [];
    arr.push(c);
    catalogsByDomain.set(c.domain_code, arr);
  }

  const totalItems = catalogs.reduce((sum, c) => sum + c.item_count, 0);

  return (
    <PageShell crumbs={[{ label: "Master Data" }]}>
      <SectionHeader
        eyebrow="Master Data Center"
        title="Catálogos maestros"
        description="Arquitectura MDM configurable. Todos los catálogos críticos de la plataforma viven aquí — no hay hardcoded."
        actions={
          <div className="flex items-center gap-3 text-2xs uppercase tracking-wider text-ink-mid">
            <span>
              <span className="font-mono text-ink-high">{domains.length}</span> dominios
            </span>
            <span>·</span>
            <span>
              <span className="font-mono text-ink-high">{catalogs.length}</span> catálogos
            </span>
            <span>·</span>
            <span>
              <span className="font-mono text-ink-high">{totalItems}</span> items
            </span>
          </div>
        }
      />

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {domains.map((d) => {
          const Icon = ICONS[d.icon] ?? Boxes;
          const cats = catalogsByDomain.get(d.code) ?? [];
          return (
            <Card key={d.id}>
              <div className="mb-3 flex items-start justify-between gap-3 border-b border-surface-border pb-3">
                <div className="flex min-w-0 items-start gap-2.5">
                  <div className="rounded border border-surface-border bg-canvas-raised p-2 text-accent-ring">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-2xs uppercase tracking-wider text-ink-low">{d.code}</p>
                    <h3 className="truncate text-sm font-semibold text-ink-high">{d.name}</h3>
                    <p className="line-clamp-2 text-xs text-ink-mid">{d.description}</p>
                  </div>
                </div>
                <Badge tone="accent">{cats.length}</Badge>
              </div>
              <ul className="space-y-0.5">
                {cats.map((c) => (
                  <li key={c.id}>
                    <a
                      href={`/master-data/${c.code}`}
                      className="group flex items-center gap-2 rounded px-2 py-1.5 text-xs transition-colors hover:bg-surface-hover"
                    >
                      <span className="flex-1 truncate text-ink-high">{c.name}</span>
                      {c.is_system ? (
                        <span className="rounded border border-surface-border bg-canvas-sunken px-1 py-0.5 font-mono text-2xs text-ink-low">
                          SYS
                        </span>
                      ) : null}
                      {c.hierarchical ? (
                        <span className="rounded border border-surface-border bg-canvas-sunken px-1 py-0.5 font-mono text-2xs text-ink-low">
                          TREE
                        </span>
                      ) : null}
                      <span className="w-8 text-right font-mono tabular-nums text-2xs text-ink-mid">
                        {c.item_count}
                      </span>
                      <ChevronRight className="h-3 w-3 text-ink-low transition-transform group-hover:translate-x-0.5 group-hover:text-ink-mid" />
                    </a>
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>
    </PageShell>
  );
}
