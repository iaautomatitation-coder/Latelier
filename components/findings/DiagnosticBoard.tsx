"use client";

import { useMemo, useState, useTransition } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Drawer } from "@/components/ui/Drawer";
import { FindingForm } from "@/components/findings/FindingForm";
import { cn } from "@/lib/utils/cn";
import { formatDate } from "@/lib/utils/format";
import { deleteFindingAction } from "@/app/(app)/studies/[id]/diagnostic/actions";
import type { Finding, StudyArea } from "@/lib/types";

type DrawerMode =
  | { kind: "closed" }
  | { kind: "create"; areaCode: string }
  | { kind: "edit"; finding: Finding };

type ConfirmState = { kind: "idle" } | { kind: "confirm"; finding: Finding };

export function DiagnosticBoard({
  studyId,
  areas,
  findings,
}: {
  studyId: string;
  areas: StudyArea[];
  findings: Finding[];
}) {
  const [drawer, setDrawer] = useState<DrawerMode>({ kind: "closed" });
  const [confirm, setConfirm] = useState<ConfirmState>({ kind: "idle" });
  const [pending, startTransition] = useTransition();
  const [actionError, setActionError] = useState<string | null>(null);

  const findingsByArea = useMemo(() => {
    const map = new Map<string, Finding[]>();
    for (const f of findings) {
      const arr = map.get(f.area_code) ?? [];
      arr.push(f);
      map.set(f.area_code, arr);
    }
    return map;
  }, [findings]);

  const close = () => setDrawer({ kind: "closed" });

  const onDelete = (finding: Finding) => {
    setActionError(null);
    startTransition(async () => {
      const res = await deleteFindingAction(studyId, finding.id);
      if (!res.ok && res.error) setActionError(res.error);
      setConfirm({ kind: "idle" });
    });
  };

  return (
    <>
      {actionError ? (
        <div className="mb-3 rounded border border-signal-crit/40 bg-signal-crit/10 px-3 py-2 text-xs text-signal-crit">
          {actionError}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
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
                  <p className="font-mono text-base tabular-nums text-ink-high">{items.length}</p>
                </div>
                <div className="rounded border border-surface-border bg-canvas-raised px-2 py-1.5">
                  <p className="text-2xs uppercase text-ink-low">Evidencias</p>
                  <p className="font-mono text-base tabular-nums text-ink-high">
                    {items.reduce((sum, f) => sum + f.evidence_count, 0)}
                  </p>
                </div>
              </div>

              {items.length > 0 ? (
                <ul className="mb-3 space-y-2">
                  {items.map((f) => (
                    <li
                      key={f.id}
                      className={cn(
                        "group rounded border border-surface-border bg-canvas-raised p-2 transition-colors hover:border-accent/30",
                        pending && "opacity-70",
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="flex-1 text-xs font-medium text-ink-high">{f.title}</p>
                        <Badge tone={f.severity >= 4 ? "crit" : f.severity >= 3 ? "warn" : "info"}>
                          Sev {f.severity}
                        </Badge>
                      </div>
                      {f.description ? (
                        <p className="mt-1 line-clamp-2 text-2xs text-ink-mid">{f.description}</p>
                      ) : null}
                      <div className="mt-1.5 flex items-center justify-between">
                        <p className="font-mono text-2xs text-ink-low">
                          {formatDate(f.created_at)} · {f.evidence_count} evid.
                        </p>
                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <IconBtn label="Editar" onClick={() => setDrawer({ kind: "edit", finding: f })}>
                            <Pencil className="h-3 w-3" />
                          </IconBtn>
                          <IconBtn
                            label="Eliminar"
                            tone="danger"
                            disabled={pending}
                            onClick={() => setConfirm({ kind: "confirm", finding: f })}
                          >
                            <Trash2 className="h-3 w-3" />
                          </IconBtn>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mb-3 rounded border border-dashed border-surface-border px-2 py-3 text-center text-2xs text-ink-low">
                  Sin hallazgos documentados.
                </p>
              )}

              <button
                type="button"
                onClick={() => setDrawer({ kind: "create", areaCode: area.area_code })}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded border border-dashed border-surface-border bg-canvas px-2 py-1.5 text-xs font-medium text-ink-mid transition-colors hover:border-accent/40 hover:bg-surface-hover hover:text-ink-high"
              >
                <Plus className="h-3.5 w-3.5" /> Añadir hallazgo
              </button>
            </Card>
          );
        })}
      </div>

      <Drawer
        open={drawer.kind !== "closed"}
        onClose={close}
        title={drawer.kind === "edit" ? "Editar hallazgo" : "Nuevo hallazgo"}
        subtitle={`Estudio ${studyId}`}
        width="max-w-lg"
      >
        {drawer.kind !== "closed" ? (
          <FindingForm
            studyId={studyId}
            finding={drawer.kind === "edit" ? drawer.finding : null}
            areas={areas}
            defaultAreaCode={drawer.kind === "create" ? drawer.areaCode : undefined}
            onSuccess={close}
          />
        ) : null}
      </Drawer>

      <Drawer
        open={confirm.kind === "confirm"}
        onClose={() => setConfirm({ kind: "idle" })}
        title="Confirmar eliminación"
        width="max-w-sm"
      >
        {confirm.kind === "confirm" ? (
          <div className="space-y-4">
            <p className="text-sm text-ink-high">¿Eliminar este hallazgo?</p>
            <div className="rounded border border-surface-border bg-canvas-sunken px-3 py-2 text-xs text-ink-mid">
              <p className="font-medium text-ink-high">{confirm.finding.title}</p>
              {confirm.finding.description ? <p className="mt-1">{confirm.finding.description}</p> : null}
            </div>
            <div className="flex justify-end gap-2 border-t border-surface-border pt-3">
              <button
                type="button"
                onClick={() => setConfirm({ kind: "idle" })}
                className="rounded border border-surface-border bg-canvas px-3 py-1.5 text-xs font-medium text-ink-mid hover:bg-surface-hover hover:text-ink-high"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => onDelete(confirm.finding)}
                disabled={pending}
                className="rounded bg-signal-crit px-3 py-1.5 text-xs font-semibold text-white hover:bg-signal-crit/90 disabled:opacity-60"
              >
                {pending ? "Eliminando…" : "Eliminar"}
              </button>
            </div>
          </div>
        ) : null}
      </Drawer>
    </>
  );
}

function IconBtn({
  children,
  label,
  onClick,
  disabled,
  tone = "default",
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  tone?: "default" | "danger";
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded border border-transparent p-1 transition-colors",
        tone === "danger"
          ? "text-ink-mid hover:bg-signal-crit/10 hover:text-signal-crit"
          : "text-ink-mid hover:bg-surface-hover hover:text-ink-high",
        "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent",
      )}
    >
      {children}
    </button>
  );
}
