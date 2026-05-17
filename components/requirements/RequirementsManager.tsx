"use client";

import { useMemo, useState, useTransition } from "react";
import { Pencil, Plus, Trash2, Filter } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { Badge } from "@/components/ui/Badge";
import { PriorityBadge, RequirementStatusBadge } from "@/components/ui/StatusPill";
import { Select } from "@/components/ui/Field";
import { EmptyState } from "@/components/ui/EmptyState";
import { RequirementForm } from "@/components/requirements/RequirementForm";
import { cn } from "@/lib/utils/cn";
import { deleteRequirementAction } from "@/app/(app)/studies/[id]/requirements/actions";
import type { MdmItem, Requirement } from "@/lib/types";
import { ListChecks } from "lucide-react";

type DrawerMode = { kind: "closed" } | { kind: "create" } | { kind: "edit"; req: Requirement };
type ConfirmState = { kind: "idle" } | { kind: "confirm"; req: Requirement };

export function RequirementsManager({
  studyId,
  requirements,
  areas,
  processes,
}: {
  studyId: string;
  requirements: Requirement[];
  areas: MdmItem[];
  processes: MdmItem[];
}) {
  const [drawer, setDrawer] = useState<DrawerMode>({ kind: "closed" });
  const [confirm, setConfirm] = useState<ConfirmState>({ kind: "idle" });
  const [pending, startTransition] = useTransition();
  const [actionError, setActionError] = useState<string | null>(null);
  const [filterArea, setFilterArea] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  const filtered = useMemo(
    () =>
      requirements.filter(
        (r) =>
          (filterArea === "" || r.area_code === filterArea) &&
          (filterStatus === "" || r.status === filterStatus),
      ),
    [requirements, filterArea, filterStatus],
  );

  const close = () => setDrawer({ kind: "closed" });

  const onDelete = (req: Requirement) => {
    setActionError(null);
    startTransition(async () => {
      const res = await deleteRequirementAction(studyId, req.id);
      if (!res.ok && res.error) setActionError(res.error);
      setConfirm({ kind: "idle" });
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-2xs uppercase tracking-wider text-ink-mid">
            <Filter className="h-3 w-3" /> Filtros
          </div>
          <Select
            aria-label="Filtrar por área"
            value={filterArea}
            onChange={(e) => setFilterArea(e.target.value)}
            className="!w-auto !py-1 text-xs"
          >
            <option value="">Todas las áreas</option>
            {areas.map((a) => (
              <option key={a.id} value={a.code}>
                {a.code} · {a.name}
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
            <option value="identified">Identificado</option>
            <option value="validated">Validado</option>
            <option value="in_design">En diseño</option>
            <option value="delivered">Entregado</option>
            <option value="rejected">Rechazado</option>
          </Select>
          {(filterArea || filterStatus) && (
            <button
              type="button"
              onClick={() => {
                setFilterArea("");
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
          <Plus className="h-3.5 w-3.5" /> Nuevo requerimiento
        </button>
      </div>

      {actionError ? (
        <div className="rounded border border-signal-crit/40 bg-signal-crit/10 px-3 py-2 text-xs text-signal-crit">
          {actionError}
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title={requirements.length === 0 ? "Sin requerimientos aún" : "Ningún requerimiento coincide"}
          description={
            requirements.length === 0
              ? "Crea el primer requerimiento del estudio usando el botón superior."
              : "Ajusta los filtros para ver más resultados."
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-md border border-surface-border bg-surface">
          <table className="w-full border-collapse text-sm">
            <thead className="border-b border-surface-border bg-canvas-raised text-ink-mid">
              <tr>
                <th className="px-3 py-2 text-left text-2xs font-semibold uppercase tracking-wider" style={{ width: "6%" }}>Área</th>
                <th className="px-3 py-2 text-left text-2xs font-semibold uppercase tracking-wider" style={{ width: "9%" }}>Proceso</th>
                <th className="px-3 py-2 text-left text-2xs font-semibold uppercase tracking-wider">Problema</th>
                <th className="px-3 py-2 text-left text-2xs font-semibold uppercase tracking-wider">Necesidad</th>
                <th className="px-3 py-2 text-left text-2xs font-semibold uppercase tracking-wider">Solución</th>
                <th className="px-3 py-2 text-left text-2xs font-semibold uppercase tracking-wider" style={{ width: "9%" }}>Módulo</th>
                <th className="px-3 py-2 text-left text-2xs font-semibold uppercase tracking-wider" style={{ width: "7%" }}>Prio.</th>
                <th className="px-3 py-2 text-left text-2xs font-semibold uppercase tracking-wider" style={{ width: "7%" }}>Riesgo</th>
                <th className="px-3 py-2 text-left text-2xs font-semibold uppercase tracking-wider" style={{ width: "8%" }}>Estado</th>
                <th className="px-3 py-2 text-right text-2xs font-semibold uppercase tracking-wider" style={{ width: "6%" }}>Acc.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filtered.map((r) => (
                <tr key={r.id} className={cn("transition-colors hover:bg-surface-hover", pending && "opacity-70")}>
                  <td className="px-3 py-1.5 align-top">
                    <span className="font-mono text-2xs uppercase text-ink-mid">{r.area_code}</span>
                  </td>
                  <td className="px-3 py-1.5 align-top">
                    <span className="font-mono text-2xs uppercase text-ink-mid">{r.process_code}</span>
                  </td>
                  <td className="px-3 py-1.5 align-top text-ink-high">{r.problem}</td>
                  <td className="px-3 py-1.5 align-top text-ink-mid">{r.need}</td>
                  <td className="px-3 py-1.5 align-top text-ink-mid">{r.proposed_solution}</td>
                  <td className="px-3 py-1.5 align-top">
                    {r.suggested_module ? <Badge tone="accent">{r.suggested_module}</Badge> : <span className="text-2xs text-ink-low">—</span>}
                  </td>
                  <td className="px-3 py-1.5 align-top"><PriorityBadge priority={r.priority} /></td>
                  <td className="px-3 py-1.5 align-top"><PriorityBadge priority={r.risk_level} /></td>
                  <td className="px-3 py-1.5 align-top"><RequirementStatusBadge status={r.status} /></td>
                  <td className="px-3 py-1.5 align-top">
                    <div className="flex items-center justify-end gap-1">
                      <IconBtn label="Editar" onClick={() => setDrawer({ kind: "edit", req: r })}>
                        <Pencil className="h-3.5 w-3.5" />
                      </IconBtn>
                      <IconBtn
                        label="Eliminar"
                        tone="danger"
                        disabled={pending}
                        onClick={() => setConfirm({ kind: "confirm", req: r })}
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

      <div className="flex items-center gap-2 text-2xs text-ink-low">
        <span className="rounded border border-surface-border bg-canvas-raised px-1.5 py-0.5 font-mono">
          {filtered.length}
        </span>
        <span>de</span>
        <span className="rounded border border-surface-border bg-canvas-raised px-1.5 py-0.5 font-mono">
          {requirements.length}
        </span>
        <span>requerimientos visibles · cambios persisten durante esta sesión del servidor</span>
      </div>

      <Drawer
        open={drawer.kind !== "closed"}
        onClose={close}
        title={drawer.kind === "edit" ? "Editar requerimiento" : "Nuevo requerimiento"}
        subtitle={`Estudio ${studyId}`}
        width="max-w-xl"
      >
        {drawer.kind !== "closed" ? (
          <RequirementForm
            studyId={studyId}
            requirement={drawer.kind === "edit" ? drawer.req : null}
            areas={areas}
            processes={processes}
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
            <p className="text-sm text-ink-high">¿Eliminar este requerimiento?</p>
            <div className="rounded border border-surface-border bg-canvas-sunken px-3 py-2 text-xs text-ink-mid">
              <p className="font-medium text-ink-high">{confirm.req.problem}</p>
              <p className="mt-1">{confirm.req.need}</p>
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
                onClick={() => onDelete(confirm.req)}
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
