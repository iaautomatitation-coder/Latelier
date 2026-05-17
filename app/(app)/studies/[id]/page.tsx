import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  StudyStatusBadge,
  CriticalityBadge,
  RiskStatusBadge,
  PriorityBadge,
  RequirementStatusBadge,
} from "@/components/ui/StatusPill";
import { KpiCard } from "@/components/ui/KpiCard";
import {
  getStudy,
  getCompany,
  getStudyAreas,
  getStudyFindings,
  getStudyRisks,
  getStudyRequirements,
  getStudyRoadmap,
} from "@/lib/data";
import type { Finding, Requirement, Risk, RoadmapItem } from "@/lib/types";
import { formatDate } from "@/lib/utils/format";
import { Building2, CalendarClock, GitBranch, Target } from "lucide-react";

export default async function StudyDetailPage({ params }: { params: { id: string } }) {
  const study = await getStudy(params.id);
  if (!study) notFound();

  const [company, areas, findings, risks, requirements, roadmap] = await Promise.all([
    getCompany(study.company_id),
    getStudyAreas(study.id),
    getStudyFindings(study.id),
    getStudyRisks(study.id),
    getStudyRequirements(study.id),
    getStudyRoadmap(study.id),
  ]);

  const topRisks = [...risks].sort((a, b) => b.criticality - a.criticality).slice(0, 5);
  const topReqs = [...requirements]
    .sort((a, b) => prio(b.priority) - prio(a.priority))
    .slice(0, 6);

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
    { key: "crit", header: "Crit.", align: "center", render: (r) => <CriticalityBadge value={r.criticality} /> },
    { key: "status", header: "Estado", render: (r) => <RiskStatusBadge status={r.status} /> },
    { key: "owner", header: "Owner", render: (r) => <span className="text-ink-mid">{r.owner}</span> },
  ];

  const reqCols: Column<Requirement>[] = [
    {
      key: "need",
      header: "Necesidad",
      render: (r) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-ink-high">{r.need}</p>
          <p className="truncate text-2xs uppercase text-ink-low">{r.area_code} · {r.suggested_module}</p>
        </div>
      ),
    },
    { key: "priority", header: "Prio.", render: (r) => <PriorityBadge priority={r.priority} /> },
    { key: "status", header: "Estado", render: (r) => <RequirementStatusBadge status={r.status} /> },
  ];

  const findingCols: Column<Finding>[] = [
    {
      key: "title",
      header: "Hallazgo",
      render: (f) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-ink-high">{f.title}</p>
          <p className="line-clamp-1 text-xs text-ink-mid">{f.description}</p>
        </div>
      ),
    },
    { key: "area", header: "Área", render: (f) => <span className="font-mono text-2xs text-ink-mid">{f.area_code}</span> },
    {
      key: "sev",
      header: "Sev.",
      align: "center",
      render: (f) => <CriticalityBadge value={f.severity} />,
    },
    { key: "ev", header: "Evid.", align: "center", render: (f) => <span className="font-mono tabular-nums">{f.evidence_count}</span> },
  ];

  const roadmapCols: Column<RoadmapItem>[] = [
    {
      key: "title",
      header: "Iniciativa",
      render: (r) => (
        <div>
          <p className="font-medium text-ink-high">{r.title}</p>
          <p className="text-2xs uppercase text-ink-low">{r.module}</p>
        </div>
      ),
    },
    {
      key: "phase",
      header: "Fase",
      render: (r) => <span className="font-mono text-2xs uppercase text-ink-mid">{r.phase}</span>,
    },
    {
      key: "window",
      header: "Ventana",
      render: (r) => (
        <span className="font-mono text-2xs text-ink-mid">
          {formatDate(r.start_at)} → {formatDate(r.end_at)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Estado",
      render: (r) => {
        const tone =
          r.status === "done" ? "ok" : r.status === "in_progress" ? "accent" : r.status === "blocked" ? "crit" : "neutral";
        const label =
          r.status === "done" ? "Hecho" : r.status === "in_progress" ? "En curso" : r.status === "blocked" ? "Bloqueado" : "Planeado";
        return <span className={`inline-flex rounded border px-1.5 py-0.5 font-mono text-2xs uppercase ${badgeClasses(tone)}`}>{label}</span>;
      },
    },
  ];

  return (
    <PageShell
      crumbs={[
        { label: "Estudios", href: "/studies" },
        { label: study.code },
      ]}
    >
      <SectionHeader
        eyebrow={`${study.code} · ${company?.name ?? ""}`}
        title={study.name}
        description={study.description}
        actions={
          <div className="flex items-center gap-2">
            <StudyStatusBadge status={study.status} />
          </div>
        }
      />

      <div className="mt-5 flex flex-wrap gap-2 border-b border-surface-border pb-3 text-xs">
        <Tab href={`/studies/${study.id}`} active>
          Resumen
        </Tab>
        <Tab href={`/studies/${study.id}/diagnostic`}>Diagnóstico</Tab>
        <Tab href={`/studies/${study.id}/requirements`}>Requerimientos</Tab>
        <Tab href={`/studies/${study.id}/risks`}>Riesgos</Tab>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Madurez" value={`${study.maturity_score}%`} icon={Target} tone={study.maturity_score >= 60 ? "ok" : "accent"} />
        <KpiCard label="Avance" value={`${study.progress}%`} icon={GitBranch} />
        <KpiCard label="Áreas evaluadas" value={`${areas.filter((a) => a.status !== "pending").length}/${areas.length}`} icon={Building2} />
        <KpiCard label="Cierre objetivo" value={formatDate(study.target_end_at)} icon={CalendarClock} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Top riesgos"
            action={
              <a href={`/studies/${study.id}/risks`} className="text-2xs font-semibold uppercase tracking-wider text-accent-ring hover:underline">
                Matriz completa →
              </a>
            }
          />
          <DataTable columns={riskCols} rows={topRisks} />
        </Card>
        <Card>
          <CardHeader
            title="Requerimientos prioritarios"
            action={
              <a href={`/studies/${study.id}/requirements`} className="text-2xs font-semibold uppercase tracking-wider text-accent-ring hover:underline">
                Matriz completa →
              </a>
            }
          />
          <DataTable columns={reqCols} rows={topReqs} />
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Hallazgos recientes" />
          <DataTable columns={findingCols} rows={findings} />
        </Card>
        <Card>
          <CardHeader title="Madurez por área" />
          <ul className="space-y-2.5">
            {areas.map((a) => (
              <li key={a.id}>
                <div className="mb-1 flex items-baseline justify-between text-xs">
                  <span className="text-ink-high">{a.name}</span>
                  <span className="font-mono tabular-nums text-ink-mid">{a.maturity}%</span>
                </div>
                <ProgressBar
                  value={a.maturity}
                  tone={a.maturity >= 50 ? "ok" : a.maturity >= 30 ? "accent" : "warn"}
                />
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-4">
        <Card>
          <CardHeader title="Roadmap del estudio" subtitle="Iniciativas por fase" />
          <DataTable columns={roadmapCols} rows={roadmap} />
        </Card>
      </div>
    </PageShell>
  );
}

function Tab({ href, children, active }: { href: string; children: React.ReactNode; active?: boolean }) {
  return (
    <a
      href={href}
      className={`-mb-px rounded-t border border-b-0 px-3 py-1.5 text-xs font-medium ${
        active
          ? "border-surface-border bg-surface text-ink-high"
          : "border-transparent text-ink-mid hover:text-ink-high"
      }`}
    >
      {children}
    </a>
  );
}

function prio(p: Requirement["priority"]): number {
  return { low: 1, medium: 2, high: 3, critical: 4 }[p];
}

function badgeClasses(tone: "ok" | "warn" | "crit" | "accent" | "neutral") {
  return {
    ok: "bg-signal-ok/10 text-signal-ok border-signal-ok/30",
    warn: "bg-signal-warn/10 text-signal-warn border-signal-warn/30",
    crit: "bg-signal-crit/10 text-signal-crit border-signal-crit/30",
    accent: "bg-accent/10 text-accent-ring border-accent/30",
    neutral: "bg-surface text-ink-mid border-surface-border",
  }[tone];
}
