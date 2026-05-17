import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { getStudy, getStudyAreas, getStudyFindings } from "@/lib/data";
import { formatDate } from "@/lib/utils/format";

export default async function DiagnosticPage({ params }: { params: { id: string } }) {
  const study = await getStudy(params.id);
  if (!study) notFound();
  const [areas, findings] = await Promise.all([getStudyAreas(study.id), getStudyFindings(study.id)]);
  const findingsByArea = new Map<string, typeof findings>();
  for (const f of findings) {
    const arr = findingsByArea.get(f.area_code) ?? [];
    arr.push(f);
    findingsByArea.set(f.area_code, arr);
  }

  return (
    <PageShell
      crumbs={[
        { label: "Estudios", href: "/studies" },
        { label: study.code, href: `/studies/${study.id}` },
        { label: "Diagnóstico" },
      ]}
    >
      <SectionHeader
        eyebrow="Diagnóstico por área"
        title="Madurez operacional"
        description="Evaluación cualitativa y hallazgos por área funcional del cliente."
      />

      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {areas.map((area) => {
          const items = findingsByArea.get(area.area_code) ?? [];
          const tone = area.status === "completed" ? "ok" : area.status === "in_review" ? "accent" : "neutral";
          const label =
            area.status === "completed" ? "Completada" : area.status === "in_review" ? "En revisión" : "Pendiente";
          return (
            <Card key={area.id}>
              <div className="mb-3 flex items-start justify-between gap-3 border-b border-surface-border pb-3">
                <div className="min-w-0">
                  <p className="text-2xs uppercase tracking-wider text-ink-low">Área {area.area_code}</p>
                  <h3 className="truncate text-sm font-semibold text-ink-high">{area.name}</h3>
                  <p className="text-xs text-ink-mid">Owner: {area.owner}</p>
                </div>
                <Badge tone={tone}>{label}</Badge>
              </div>
              <div className="mb-3">
                <div className="mb-1 flex items-baseline justify-between text-xs">
                  <span className="text-ink-mid">Madurez</span>
                  <span className="font-mono tabular-nums text-ink-high">{area.maturity}%</span>
                </div>
                <ProgressBar
                  value={area.maturity}
                  tone={area.maturity >= 50 ? "ok" : area.maturity >= 30 ? "accent" : "warn"}
                />
              </div>
              <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded border border-surface-border bg-canvas-raised px-2 py-1.5">
                  <p className="text-2xs uppercase text-ink-low">Hallazgos</p>
                  <p className="font-mono text-base tabular-nums text-ink-high">{area.findings_count}</p>
                </div>
                <div className="rounded border border-surface-border bg-canvas-raised px-2 py-1.5">
                  <p className="text-2xs uppercase text-ink-low">Documentados</p>
                  <p className="font-mono text-base tabular-nums text-ink-high">{items.length}</p>
                </div>
              </div>
              {items.length > 0 ? (
                <ul className="space-y-2">
                  {items.slice(0, 3).map((f) => (
                    <li key={f.id} className="rounded border border-surface-border bg-canvas-raised p-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-medium text-ink-high">{f.title}</p>
                        <Badge tone={f.severity >= 4 ? "crit" : f.severity >= 3 ? "warn" : "info"}>
                          Sev {f.severity}
                        </Badge>
                      </div>
                      <p className="mt-1 line-clamp-2 text-2xs text-ink-mid">{f.description}</p>
                      <p className="mt-1 font-mono text-2xs text-ink-low">{formatDate(f.created_at)}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rounded border border-dashed border-surface-border px-2 py-3 text-center text-2xs text-ink-low">
                  Sin hallazgos documentados.
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </PageShell>
  );
}
