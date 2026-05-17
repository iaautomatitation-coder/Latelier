import { PageShell } from "@/components/layout/PageShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { Card, CardHeader } from "@/components/ui/Card";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  StudyStatusBadge,
  CriticalityBadge,
  RiskStatusBadge,
  PriorityBadge,
} from "@/components/ui/StatusPill";
import {
  Activity,
  CheckCircle2,
  ListChecks,
  ShieldAlert,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  getDashboardKpis,
  listStudies,
  listCompanies,
  getStudyRisks,
  getStudyRequirements,
} from "@/lib/data";
import { formatDate } from "@/lib/utils/format";
import type { Study, Risk, Requirement } from "@/lib/types";

export default async function DashboardPage() {
  const [kpis, studies, companies] = await Promise.all([
    getDashboardKpis(),
    listStudies(),
    listCompanies(),
  ]);

  const flagshipId = "s-001";
  const [topRisks, topReqs] = await Promise.all([
    getStudyRisks(flagshipId),
    getStudyRequirements(flagshipId),
  ]);

  const companyById = new Map(companies.map((c) => [c.id, c]));
  const sortedRisks = [...topRisks].sort((a, b) => b.criticality - a.criticality).slice(0, 5);
  const sortedReqs = [...topReqs]
    .sort((a, b) => priorityWeight(b.priority) - priorityWeight(a.priority))
    .slice(0, 5);

  const studyCols: Column<Study>[] = [
    {
      key: "code",
      header: "Estudio",
      width: "30%",
      render: (s) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-ink-high">{s.code}</p>
          <p className="truncate text-xs text-ink-mid">{s.name}</p>
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
      render: (s) => <ProgressBar value={s.maturity_score} showLabel tone={maturityTone(s.maturity_score)} />,
    },
    {
      key: "progress",
      header: "Avance",
      width: "14%",
      render: (s) => <ProgressBar value={s.progress} showLabel />,
    },
    {
      key: "date",
      header: "Inicio",
      align: "right",
      render: (s) => <span className="font-mono text-2xs text-ink-mid">{formatDate(s.started_at)}</span>,
    },
  ];

  const riskCols: Column<Risk>[] = [
    {
      key: "title",
      header: "Riesgo",
      render: (r) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-ink-high">{r.title}</p>
          <p className="truncate text-2xs uppercase text-ink-low">{r.category_code}</p>
        </div>
      ),
    },
    { key: "crit", header: "Critic.", align: "center", render: (r) => <CriticalityBadge value={r.criticality} /> },
    { key: "status", header: "Estado", render: (r) => <RiskStatusBadge status={r.status} /> },
  ];

  const reqCols: Column<Requirement>[] = [
    {
      key: "need",
      header: "Necesidad",
      render: (r) => (
        <div className="min-w-0">
          <p className="truncate text-ink-high">{r.need}</p>
          <p className="truncate text-2xs uppercase text-ink-low">{r.area_code} · {r.suggested_module}</p>
        </div>
      ),
    },
    { key: "priority", header: "Prioridad", render: (r) => <PriorityBadge priority={r.priority} /> },
  ];

  return (
    <PageShell crumbs={[{ label: "Dashboard" }]}>
      <SectionHeader
        eyebrow="Resumen ejecutivo"
        title="Estado del portafolio de estudios"
        description="Visibilidad consolidada de estudios activos, brechas detectadas y nivel de madurez por cliente."
      />

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-5">
        <KpiCard label="Estudios activos" value={kpis.activeStudies} hint={`${studies.length} totales`} icon={Activity} tone="accent" />
        <KpiCard
          label="Áreas completadas"
          value={`${kpis.completedAreas}/${kpis.totalAreas}`}
          hint="Diagnóstico cerrado"
          icon={CheckCircle2}
          tone="ok"
        />
        <KpiCard
          label="Requerimientos"
          value={kpis.identifiedRequirements}
          hint="Identificados en portafolio"
          icon={ListChecks}
        />
        <KpiCard
          label="Riesgos críticos"
          value={kpis.criticalRisks}
          hint="Criticidad ≥ 16"
          icon={ShieldAlert}
          tone="crit"
        />
        <KpiCard
          label="Madurez promedio"
          value={`${kpis.averageMaturity}%`}
          hint="Score ponderado"
          icon={Target}
          tone={kpis.averageMaturity >= 60 ? "ok" : kpis.averageMaturity >= 40 ? "accent" : "warn"}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Portafolio de estudios"
              subtitle="Estado, madurez y avance por estudio"
              action={
                <a href="/studies" className="text-2xs font-semibold uppercase tracking-wider text-accent-ring hover:underline">
                  Ver todos →
                </a>
              }
            />
            <DataTable columns={studyCols} rows={studies} rowHref={(s) => `/studies/${s.id}`} />
          </Card>
        </div>

        <Card>
          <CardHeader title="Top riesgos" subtitle="Estudio principal · OTS Demo" />
          <DataTable columns={riskCols} rows={sortedRisks} />
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader title="Madurez por dominio" subtitle="Score consolidado del portafolio" />
          <ul className="space-y-3">
            {DOMAIN_BENCHMARKS.map((d) => (
              <li key={d.label}>
                <div className="mb-1 flex items-baseline justify-between text-xs">
                  <span className="text-ink-mid">{d.label}</span>
                  <span className="font-mono tabular-nums text-ink-high">{d.value}%</span>
                </div>
                <ProgressBar value={d.value} tone={maturityTone(d.value)} />
              </li>
            ))}
          </ul>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader
            title="Requerimientos prioritarios"
            subtitle="Top necesidades del estudio principal"
            action={
              <a href="/studies/s-001/requirements" className="text-2xs font-semibold uppercase tracking-wider text-accent-ring hover:underline">
                Ver matriz →
              </a>
            }
          />
          <DataTable columns={reqCols} rows={sortedReqs} />
        </Card>
      </div>

      <div className="mt-6 flex items-center gap-2 rounded-md border border-surface-border bg-canvas-raised px-3 py-2 text-2xs text-ink-mid">
        <TrendingUp className="h-3.5 w-3.5 text-accent-ring" />
        <span>Datos demo · capa Master Data lista para ingestar catálogos del cliente.</span>
      </div>
    </PageShell>
  );
}

const DOMAIN_BENCHMARKS = [
  { label: "Trazabilidad operacional", value: 38 },
  { label: "Mantenimiento", value: 42 },
  { label: "Inspección y Calidad", value: 56 },
  { label: "Inventario y logística", value: 31 },
  { label: "Compliance documental", value: 47 },
];

function priorityWeight(p: Requirement["priority"]): number {
  return { low: 1, medium: 2, high: 3, critical: 4 }[p];
}

function maturityTone(v: number): "ok" | "accent" | "warn" | "crit" {
  if (v >= 60) return "ok";
  if (v >= 40) return "accent";
  if (v >= 25) return "warn";
  return "crit";
}
