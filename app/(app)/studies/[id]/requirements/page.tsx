import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { PriorityBadge, RequirementStatusBadge } from "@/components/ui/StatusPill";
import { Badge } from "@/components/ui/Badge";
import { getStudy, getStudyRequirements } from "@/lib/data";
import type { Requirement } from "@/lib/types";

export default async function RequirementsPage({ params }: { params: { id: string } }) {
  const study = await getStudy(params.id);
  if (!study) notFound();
  const reqs = await getStudyRequirements(study.id);

  const cols: Column<Requirement>[] = [
    {
      key: "area",
      header: "Área",
      width: "8%",
      render: (r) => <span className="font-mono text-2xs uppercase text-ink-mid">{r.area_code}</span>,
    },
    {
      key: "process",
      header: "Proceso",
      width: "12%",
      render: (r) => <span className="font-mono text-2xs uppercase text-ink-mid">{r.process_code}</span>,
    },
    {
      key: "problem",
      header: "Problema",
      render: (r) => <p className="text-ink-high">{r.problem}</p>,
    },
    {
      key: "need",
      header: "Necesidad",
      render: (r) => <p className="text-ink-mid">{r.need}</p>,
    },
    {
      key: "solution",
      header: "Solución propuesta",
      render: (r) => <p className="text-ink-mid">{r.proposed_solution}</p>,
    },
    {
      key: "module",
      header: "Módulo",
      render: (r) => <Badge tone="accent">{r.suggested_module}</Badge>,
    },
    {
      key: "priority",
      header: "Prioridad",
      render: (r) => <PriorityBadge priority={r.priority} />,
    },
    {
      key: "risk",
      header: "Riesgo",
      render: (r) => <PriorityBadge priority={r.risk_level} />,
    },
    {
      key: "status",
      header: "Estado",
      render: (r) => <RequirementStatusBadge status={r.status} />,
    },
  ];

  return (
    <PageShell
      crumbs={[
        { label: "Estudios", href: "/studies" },
        { label: study.code, href: `/studies/${study.id}` },
        { label: "Requerimientos" },
      ]}
    >
      <SectionHeader
        eyebrow="Matriz de requerimientos"
        title={`Requerimientos · ${study.code}`}
        description="Necesidades funcionales identificadas, módulos sugeridos y nivel de prioridad."
      />

      <div className="mt-5">
        <Card padded={false}>
          <DataTable columns={cols} rows={reqs} />
        </Card>
      </div>

      <div className="mt-3 flex items-center gap-2 text-2xs text-ink-low">
        <span className="rounded border border-surface-border bg-canvas-raised px-1.5 py-0.5 font-mono">{reqs.length}</span>
        <span>requerimientos en el estudio</span>
      </div>
    </PageShell>
  );
}
