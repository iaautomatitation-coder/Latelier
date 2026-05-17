import { PageShell } from "@/components/layout/PageShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StudyStatusBadge } from "@/components/ui/StatusPill";
import { listStudies, listCompanies } from "@/lib/data";
import { formatDate } from "@/lib/utils/format";
import type { Study } from "@/lib/types";
import Link from "next/link";
import { Plus, Filter } from "lucide-react";

export default async function StudiesPage() {
  const [studies, companies] = await Promise.all([listStudies(), listCompanies()]);
  const companyById = new Map(companies.map((c) => [c.id, c]));

  const cols: Column<Study>[] = [
    {
      key: "code",
      header: "Código",
      width: "10%",
      render: (s) => <span className="font-mono text-xs text-ink-high">{s.code}</span>,
    },
    {
      key: "name",
      header: "Estudio",
      render: (s) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-ink-high">{s.name}</p>
          <p className="truncate text-xs text-ink-mid">Líder: {s.lead}</p>
        </div>
      ),
    },
    {
      key: "company",
      header: "Empresa",
      render: (s) => <span className="text-ink-mid">{companyById.get(s.company_id)?.name ?? "—"}</span>,
    },
    {
      key: "status",
      header: "Estado",
      render: (s) => <StudyStatusBadge status={s.status} />,
    },
    {
      key: "maturity",
      header: "Madurez",
      width: "14%",
      render: (s) => <ProgressBar value={s.maturity_score} showLabel />,
    },
    {
      key: "progress",
      header: "Avance",
      width: "14%",
      render: (s) => <ProgressBar value={s.progress} showLabel />,
    },
    {
      key: "target",
      header: "Cierre",
      align: "right",
      render: (s) => <span className="font-mono text-2xs text-ink-mid">{formatDate(s.target_end_at)}</span>,
    },
  ];

  return (
    <PageShell crumbs={[{ label: "Estudios" }]}>
      <SectionHeader
        eyebrow="Portafolio"
        title="Estudios"
        description="Diagnósticos de arquitectura operacional, trazabilidad y requerimientos por cliente."
        actions={
          <>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded border border-surface-border bg-canvas-raised px-2.5 py-1.5 text-xs font-medium text-ink-mid hover:bg-surface-hover hover:text-ink-high focus-ring"
            >
              <Filter className="h-3.5 w-3.5" /> Filtrar
            </button>
            <Link
              href="/studies/new"
              className="inline-flex items-center gap-1.5 rounded bg-accent px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-accent/90 focus-ring"
            >
              <Plus className="h-3.5 w-3.5" /> Nuevo estudio
            </Link>
          </>
        }
      />

      <div className="mt-5">
        <Card padded={false}>
          <DataTable columns={cols} rows={studies} rowHref={(s) => `/studies/${s.id}`} />
        </Card>
      </div>
    </PageShell>
  );
}
