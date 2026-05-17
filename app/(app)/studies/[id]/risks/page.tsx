import { Fragment } from "react";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { CriticalityBadge, RiskStatusBadge } from "@/components/ui/StatusPill";
import { Badge } from "@/components/ui/Badge";
import { getStudy, getStudyRisks } from "@/lib/data";
import type { Risk } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

export default async function RisksPage({ params }: { params: { id: string } }) {
  const study = await getStudy(params.id);
  if (!study) notFound();
  const risks = await getStudyRisks(study.id);

  const cols: Column<Risk>[] = [
    {
      key: "category",
      header: "Categoría",
      width: "12%",
      render: (r) => <Badge tone="info">{r.category_code}</Badge>,
    },
    {
      key: "title",
      header: "Riesgo",
      render: (r) => (
        <div>
          <p className="font-medium text-ink-high">{r.title}</p>
          <p className="line-clamp-2 text-xs text-ink-mid">{r.description}</p>
        </div>
      ),
    },
    {
      key: "p",
      header: "Prob.",
      align: "center",
      render: (r) => <span className="font-mono tabular-nums text-ink-mid">{r.probability}</span>,
    },
    {
      key: "i",
      header: "Imp.",
      align: "center",
      render: (r) => <span className="font-mono tabular-nums text-ink-mid">{r.impact}</span>,
    },
    {
      key: "crit",
      header: "Critic.",
      align: "center",
      render: (r) => <CriticalityBadge value={r.criticality} />,
    },
    {
      key: "mitig",
      header: "Mitigación",
      render: (r) => <p className="text-ink-mid">{r.mitigation}</p>,
    },
    { key: "status", header: "Estado", render: (r) => <RiskStatusBadge status={r.status} /> },
    { key: "owner", header: "Owner", render: (r) => <span className="text-ink-mid">{r.owner}</span> },
  ];

  // Risk matrix (5x5)
  const matrix: Risk[][][] = Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => []));
  for (const r of risks) {
    matrix[5 - r.impact][r.probability - 1].push(r);
  }

  return (
    <PageShell
      crumbs={[
        { label: "Estudios", href: "/studies" },
        { label: study.code, href: `/studies/${study.id}` },
        { label: "Riesgos" },
      ]}
    >
      <SectionHeader
        eyebrow="Matriz de riesgos"
        title={`Riesgos · ${study.code}`}
        description="Probabilidad × impacto. La matriz consolida exposición operacional, financiera y de compliance."
      />

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader title="Mapa de calor" subtitle="Distribución 5×5" />
          <div className="flex">
            <div className="flex flex-col justify-between pr-2 text-2xs uppercase tracking-wider text-ink-low">
              <span>Impacto ↑</span>
            </div>
            <div className="grid flex-1 grid-cols-[auto_repeat(5,minmax(0,1fr))] gap-0.5">
              <div />
              {[1, 2, 3, 4, 5].map((p) => (
                <div key={p} className="text-center font-mono text-2xs text-ink-low">P{p}</div>
              ))}
              {[5, 4, 3, 2, 1].map((impact, rowIdx) => (
                <Fragment key={`row-${impact}`}>
                  <div className="flex items-center justify-end pr-1 font-mono text-2xs text-ink-low">
                    I{impact}
                  </div>
                  {[1, 2, 3, 4, 5].map((p) => {
                    const crit = impact * p;
                    const cell = matrix[rowIdx][p - 1];
                    return (
                      <div
                        key={`${impact}-${p}`}
                        className={cn(
                          "flex aspect-square items-center justify-center rounded border text-xs font-semibold",
                          critCellTone(crit),
                        )}
                        title={cell.map((c) => c.title).join("\n") || `Sin riesgos · criticidad ${crit}`}
                      >
                        {cell.length || ""}
                      </div>
                    );
                  })}
                </Fragment>
              ))}
            </div>
          </div>
          <p className="mt-3 text-2xs text-ink-low">Cada celda muestra el número de riesgos en esa zona.</p>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader title="Listado de riesgos" />
          <DataTable columns={cols} rows={risks} />
        </Card>
      </div>
    </PageShell>
  );
}

function critCellTone(c: number): string {
  if (c >= 16) return "bg-signal-crit/15 border-signal-crit/40 text-signal-crit";
  if (c >= 9) return "bg-signal-warn/15 border-signal-warn/40 text-signal-warn";
  if (c >= 5) return "bg-signal-info/10 border-signal-info/30 text-signal-info";
  return "bg-canvas-raised border-surface-border text-ink-low";
}
