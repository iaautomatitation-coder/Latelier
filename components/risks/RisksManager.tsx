"use client";

import { Fragment, useMemo, useState, useTransition } from "react";
import { Pencil, Plus, Trash2, ShieldAlert } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CriticalityBadge, RiskStatusBadge } from "@/components/ui/StatusPill";
import { Select } from "@/components/ui/Field";
import { EmptyState } from "@/components/ui/EmptyState";
import { RiskForm } from "@/components/risks/RiskForm";
import { cn } from "@/lib/utils/cn";
import { deleteRiskAction } from "@/app/(app)/studies/[id]/risks/actions";
import type { MdmItem, Risk } from "@/lib/types";

type DrawerMode = { kind: "closed" } | { kind: "create" } | { kind: "edit"; risk: Risk };
type ConfirmState = { kind: "idle" } | { kind: "confirm"; risk: Risk };

export function RisksManager({
  studyId,
  risks,
  categories,
}: {
  studyId: string;
  risks: Risk[];
  categories: MdmItem[];
}) {
  const [drawer, setDrawer] = useState<DrawerMode>({ kind: "closed" });
  const [confirm, setConfirm] = useState<ConfirmState>({ kind: "idle" });
  const [pending, startTransition] = useTransition();
  const [actionError, setActionError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  const filtered = useMemo(
    () =>
      risks.filter(
        (r) =>
          (filterCategory === "" || r.category_code === filterCategory) &&
          (filterStatus === "" || r.status === filterStatus),
      ),
    [risks, filterCategory, filterStatus],
  );

  const matrix: Risk[][][] = useMemo(() => {
    const m: Risk[][][] = Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => []));
    for (const r of filtered) m[5 - r.impact][r.probability - 1].push(r);
    return m;
  }, [filtered]);

  const close = () => setDrawer({ kind: "closed" });

  const onDelete = (risk: Risk) => {
    setActionError(null);
    startTransition(async () => {
      const res = await deleteRiskAction(studyId, risk.id);
      if (!res.ok && res.error) setActionError(res.error);
      setConfirm({ kind: "idle" });
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-2xs uppercase tracking-wider text-ink-mid">Filtros</span>
          <Select
            aria-label="Filtrar por categoría"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="!w-auto !py-1 text-xs"
          >
            <option value="">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c.id} value={c.code}>
                {c.name}
              </option>
            ))}
          </Select>
          <Select
            aria-label="Filtrar por estado"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="!w-auto !py-1 text-xs"
          >
            <option value="">Todos los estados</option>
            <option value="open">Abierto</option>
            <option value="mitigating">Mitigando</option>
            <option value="accepted">Aceptado</option>
            <option value="closed">Cerrado</option>
          </Select>
          {(filterCategory || filterStatus) && (
            <button
              type="button"
              onClick={() => {
                setFilterCategory("");
                setFilterStatus("");
              }}
              className="text-2xs uppercase tracking-wider text-ink-low hover:text-ink-high"
            >
              Limpiar
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setDrawer({ kind: "create" })}
          className="inline-flex items-center gap-1.5 rounded bg-accent px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-accent/90 focus-ring"
        >
          <Plus className="h-3.5 w-3.5" /> Nuevo riesgo
        </button>
      </div>

      {actionError ? (
        <div className="rounded border border-signal-crit/40 bg-signal-crit/10 px-3 py-2 text-xs text-signal-crit">
          {actionError}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader title="Mapa de calor" subtitle="Probabilidad × Impacto (5×5)" />
          <div className="flex">
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
          <p className="mt-3 text-2xs text-ink-low">
            Reactivo a filtros. Cada celda indica cuántos riesgos viven en esa zona.
          </p>
        </Card>

        <Card className="lg:col-span-3" padded={false}>
          <div className="border-b border-surface-border px-4 py-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-high">Listado de riesgos</h3>
          </div>
          {filtered.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={ShieldAlert}
                title={risks.length === 0 ? "Sin riesgos aún" : "Ningún riesgo coincide"}
                description={
                  risks.length === 0
                    ? "Crea el primer riesgo del estudio usando el botón superior."
                    : "Ajusta los filtros para ver más resultados."
                }
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead className="border-b border-surface-border bg-canvas-raised text-ink-mid">
                  <tr>
                    <th className="px-3 py-2 text-left text-2xs font-semibold uppercase tracking-wider" style={{ width: "14%" }}>Categoría</th>
                    <th className="px-3 py-2 text-left text-2xs font-semibold uppercase tracking-wider">Riesgo</th>
                    <th className="px-3 py-2 text-center text-2xs font-semibold uppercase tracking-wider" style={{ width: "7%" }}>P</th>
                    <th className="px-3 py-2 text-center text-2xs font-semibold uppercase tracking-wider" style={{ width: "7%" }}>I</th>
                    <th className="px-3 py-2 text-center text-2xs font-semibold uppercase tracking-wider" style={{ width: "8%" }}>Crit.</th>
                    <th className="px-3 py-2 text-left text-2xs font-semibold uppercase tracking-wider" style={{ width: "10%" }}>Estado</th>
                    <th className="px-3 py-2 text-left text-2xs font-semibold uppercase tracking-wider" style={{ width: "12%" }}>Owner</th>
                    <th className="px-3 py-2 text-right text-2xs font-semibold uppercase tracking-wider" style={{ width: "8%" }}>Acc.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {filtered.map((r) => (
                    <tr key={r.id} className={cn("transition-colors hover:bg-surface-hover", pending && "opacity-70")}>
                      <td className="px-3 py-1.5 align-top"><Badge tone="info">{r.category_code}</Badge></td>
                      <td className="px-3 py-1.5 align-top">
                        <p className="font-medium text-ink-high">{r.title}</p>
                        {r.description ? (
                          <p className="line-clamp-2 text-xs text-ink-mid">{r.description}</p>
                        ) : null}
                      </td>
                      <td className="px-3 py-1.5 text-center align-top font-mono tabular-nums text-ink-mid">{r.probability}</td>
                      <td className="px-3 py-1.5 text-center align-top font-mono tabular-nums text-ink-mid">{r.impact}</td>
                      <td className="px-3 py-1.5 text-center align-top"><CriticalityBadge value={r.criticality} /></td>
                      <td className="px-3 py-1.5 align-top"><RiskStatusBadge status={r.status} /></td>
                      <td className="px-3 py-1.5 align-top text-xs text-ink-mid">{r.owner || <span className="text-ink-low">—</span>}</td>
                      <td className="px-3 py-1.5 align-top">
                        <div className="flex items-center justify-end gap-1">
                          <IconBtn label="Editar" onClick={() => setDrawer({ kind: "edit", risk: r })}>
                            <Pencil className="h-3.5 w-3.5" />
                          </IconBtn>
                          <IconBtn
                            label="Eliminar"
                            tone="danger"
                            disabled={pending}
                            onClick={() => setConfirm({ kind: "confirm", risk: r })}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </IconBtn>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <div className="flex items-center gap-2 text-2xs text-ink-low">
        <span className="rounded border border-surface-border bg-canvas-raised px-1.5 py-0.5 font-mono">
          {filtered.length}
        </span>
        <span>de</span>
        <span className="rounded border border-surface-border bg-canvas-raised px-1.5 py-0.5 font-mono">
          {risks.length}
        </span>
        <span>riesgos visibles · criticidad recalculada al editar P×I</span>
      </div>

      <Drawer
        open={drawer.kind !== "closed"}
        onClose={close}
        title={drawer.kind === "edit" ? "Editar riesgo" : "Nuevo riesgo"}
        subtitle={`Estudio ${studyId}`}
        width="max-w-xl"
      >
        {drawer.kind !== "closed" ? (
          <RiskForm
            studyId={studyId}
            risk={drawer.kind === "edit" ? drawer.risk : null}
            categories={categories}
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
            <p className="text-sm text-ink-high">¿Eliminar este riesgo?</p>
            <div className="rounded border border-surface-border bg-canvas-sunken px-3 py-2 text-xs text-ink-mid">
              <p className="font-medium text-ink-high">{confirm.risk.title}</p>
              {confirm.risk.description ? <p className="mt-1">{confirm.risk.description}</p> : null}
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
                onClick={() => onDelete(confirm.risk)}
                disabled={pending}
                className="rounded bg-signal-crit px-3 py-1.5 text-xs font-semibold text-white hover:bg-signal-crit/90 disabled:opacity-60"
              >
                {pending ? "Eliminando…" : "Eliminar"}
              </button>
            </div>
          </div>
        ) : null}
      </Drawer>
    </div>
  );
}

function critCellTone(c: number): string {
  if (c >= 16) return "bg-signal-crit/15 border-signal-crit/40 text-signal-crit";
  if (c >= 9) return "bg-signal-warn/15 border-signal-warn/40 text-signal-warn";
  if (c >= 5) return "bg-signal-info/10 border-signal-info/30 text-signal-info";
  return "bg-canvas-raised border-surface-border text-ink-low";
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
