"use client";

import { useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { Badge } from "@/components/ui/Badge";
import { RecordStatusBadge } from "@/components/ui/StatusPill";
import { EmptyState } from "@/components/ui/EmptyState";
import { ItemForm } from "@/components/mdm/ItemForm";
import { cn } from "@/lib/utils/cn";
import { formatDate } from "@/lib/utils/format";
import {
  deleteMdmItemAction,
  moveMdmItemAction,
} from "@/app/(app)/master-data/[catalog]/actions";
import type { MdmCatalog, MdmItem } from "@/lib/types";
import { Database } from "lucide-react";

type DrawerMode = { kind: "closed" } | { kind: "create" } | { kind: "edit"; item: MdmItem };
type ConfirmState = { kind: "idle" } | { kind: "confirm"; item: MdmItem };

export function ItemsManager({ catalog, items }: { catalog: MdmCatalog; items: MdmItem[] }) {
  const [drawer, setDrawer] = useState<DrawerMode>({ kind: "closed" });
  const [confirm, setConfirm] = useState<ConfirmState>({ kind: "idle" });
  const [pending, startTransition] = useTransition();
  const [actionError, setActionError] = useState<string | null>(null);

  const close = () => setDrawer({ kind: "closed" });

  const onDelete = (item: MdmItem) => {
    setActionError(null);
    startTransition(async () => {
      const res = await deleteMdmItemAction(catalog.code, item.id);
      if (!res.ok && res.error) setActionError(res.error);
      setConfirm({ kind: "idle" });
    });
  };

  const onMove = (item: MdmItem, direction: "up" | "down") => {
    setActionError(null);
    startTransition(async () => {
      const res = await moveMdmItemAction(catalog.code, item.id, direction);
      if (!res.ok && res.error) setActionError(res.error);
    });
  };

  const itemsById = new Map(items.map((i) => [i.id, i]));
  const groupByParent = (parentId: string | null) =>
    items.filter((i) => i.parent_id === parentId).sort((a, b) => a.sort_order - b.sort_order);

  // For hierarchical catalogs, render with indentation (DFS). Otherwise flat sorted list.
  const rows: { item: MdmItem; depth: number }[] = [];
  if (catalog.hierarchical) {
    const visit = (parentId: string | null, depth: number) => {
      for (const child of groupByParent(parentId)) {
        rows.push({ item: child, depth });
        visit(child.id, depth + 1);
      }
    };
    visit(null, 0);
    // Append any orphans (parent not in current list)
    for (const it of items) {
      if (!rows.find((r) => r.item.id === it.id)) rows.push({ item: it, depth: 0 });
    }
  } else {
    for (const item of items) rows.push({ item, depth: 0 });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="text-2xs text-ink-low">
          <span className="rounded border border-surface-border bg-canvas-raised px-1.5 py-0.5 font-mono">
            {items.length}
          </span>{" "}
          items · cambios en memoria persisten durante esta sesión del servidor
        </div>
        <button
          type="button"
          onClick={() => setDrawer({ kind: "create" })}
          className="inline-flex items-center gap-1.5 rounded bg-accent px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-accent/90 focus-ring"
        >
          <Plus className="h-3.5 w-3.5" /> Nuevo item
        </button>
      </div>

      {actionError ? (
        <div className="rounded border border-signal-crit/40 bg-signal-crit/10 px-3 py-2 text-xs text-signal-crit">
          {actionError}
        </div>
      ) : null}

      {items.length === 0 ? (
        <EmptyState
          icon={Database}
          title="Catálogo sin items"
          description="Este catálogo está disponible pero aún no tiene items cargados. Crea el primero con el botón superior."
        />
      ) : (
        <div className="overflow-x-auto rounded-md border border-surface-border bg-surface">
          <table className="w-full border-collapse text-sm">
            <thead className="border-b border-surface-border bg-canvas-raised text-ink-mid">
              <tr>
                <th className="px-3 py-2 text-left text-2xs font-semibold uppercase tracking-wider" style={{ width: "14%" }}>Código</th>
                <th className="px-3 py-2 text-left text-2xs font-semibold uppercase tracking-wider">Nombre</th>
                {catalog.hierarchical ? (
                  <th className="px-3 py-2 text-left text-2xs font-semibold uppercase tracking-wider" style={{ width: "14%" }}>Padre</th>
                ) : null}
                <th className="px-3 py-2 text-left text-2xs font-semibold uppercase tracking-wider" style={{ width: "9%" }}>Alcance</th>
                <th className="px-3 py-2 text-center text-2xs font-semibold uppercase tracking-wider" style={{ width: "6%" }}>SYS</th>
                <th className="px-3 py-2 text-right text-2xs font-semibold uppercase tracking-wider" style={{ width: "6%" }}>Orden</th>
                <th className="px-3 py-2 text-left text-2xs font-semibold uppercase tracking-wider" style={{ width: "10%" }}>Estado</th>
                <th className="px-3 py-2 text-right text-2xs font-semibold uppercase tracking-wider" style={{ width: "12%" }}>Actualizado</th>
                <th className="px-3 py-2 text-right text-2xs font-semibold uppercase tracking-wider" style={{ width: "12%" }}>Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {rows.map(({ item, depth }, idx) => {
                const prev = rows[idx - 1]?.item;
                const next = rows[idx + 1]?.item;
                const canUp = prev?.parent_id === item.parent_id;
                const canDown = next?.parent_id === item.parent_id;
                const parent = item.parent_id ? itemsById.get(item.parent_id) : null;
                return (
                  <tr key={item.id} className={cn("transition-colors hover:bg-surface-hover", pending && "opacity-70")}>
                    <td className="px-3 py-1.5 align-top">
                      <span className="font-mono text-xs text-ink-high">{item.code}</span>
                    </td>
                    <td className="px-3 py-1.5 align-top">
                      <div className="min-w-0" style={{ paddingLeft: depth * 16 }}>
                        <p className="truncate text-ink-high">{item.name}</p>
                        {item.description ? (
                          <p className="truncate text-xs text-ink-mid">{item.description}</p>
                        ) : null}
                      </div>
                    </td>
                    {catalog.hierarchical ? (
                      <td className="px-3 py-1.5 align-top text-xs text-ink-mid">
                        {parent ? parent.name : <span className="text-ink-low">—</span>}
                      </td>
                    ) : null}
                    <td className="px-3 py-1.5 align-top">
                      <Badge tone={item.company_id === null ? "info" : "accent"}>
                        {item.company_id === null ? "Global" : "Empresa"}
                      </Badge>
                    </td>
                    <td className="px-3 py-1.5 text-center align-top">
                      {item.is_system ? <Badge tone="neutral">SYS</Badge> : <span className="text-2xs text-ink-low">—</span>}
                    </td>
                    <td className="px-3 py-1.5 text-right align-top">
                      <span className="font-mono tabular-nums text-ink-mid">{item.sort_order}</span>
                    </td>
                    <td className="px-3 py-1.5 align-top">
                      <RecordStatusBadge status={item.status} />
                    </td>
                    <td className="px-3 py-1.5 text-right align-top font-mono text-2xs text-ink-mid">
                      {formatDate(item.updated_at)}
                    </td>
                    <td className="px-3 py-1.5 align-top">
                      <div className="flex items-center justify-end gap-1">
                        <IconBtn label="Mover arriba" disabled={!canUp || pending} onClick={() => onMove(item, "up")}>
                          <ArrowUp className="h-3.5 w-3.5" />
                        </IconBtn>
                        <IconBtn label="Mover abajo" disabled={!canDown || pending} onClick={() => onMove(item, "down")}>
                          <ArrowDown className="h-3.5 w-3.5" />
                        </IconBtn>
                        <IconBtn label="Editar" onClick={() => setDrawer({ kind: "edit", item })}>
                          <Pencil className="h-3.5 w-3.5" />
                        </IconBtn>
                        <IconBtn
                          label="Eliminar"
                          disabled={item.is_system || pending}
                          tone="danger"
                          onClick={() => setConfirm({ kind: "confirm", item })}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </IconBtn>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Drawer
        open={drawer.kind !== "closed"}
        onClose={close}
        title={drawer.kind === "edit" ? "Editar item" : "Nuevo item"}
        subtitle={`${catalog.domain_code} · ${catalog.code}`}
      >
        {drawer.kind !== "closed" ? (
          <ItemForm
            catalog={catalog}
            item={drawer.kind === "edit" ? drawer.item : null}
            parents={items}
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
            <p className="text-sm text-ink-high">
              ¿Eliminar{" "}
              <span className="font-mono text-accent-ring">{confirm.item.code}</span> — {confirm.item.name}?
            </p>
            <p className="rounded border border-surface-border bg-canvas-sunken px-3 py-2 text-2xs text-ink-mid">
              La eliminación es lógica (soft delete). El registro se marca con <code>deleted_at</code> y deja de
              aparecer en listas.
            </p>
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
                onClick={() => onDelete(confirm.item)}
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
