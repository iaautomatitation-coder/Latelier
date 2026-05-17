import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { RecordStatusBadge } from "@/components/ui/StatusPill";
import { EmptyState } from "@/components/ui/EmptyState";
import { getMdmCatalog, listMdmItems, listMdmDomains } from "@/lib/data";
import { formatDate } from "@/lib/utils/format";
import type { MdmItem } from "@/lib/types";
import { Database, Plus, Download, Upload } from "lucide-react";

export default async function CatalogDetailPage({ params }: { params: { catalog: string } }) {
  const catalog = await getMdmCatalog(params.catalog);
  if (!catalog) notFound();
  const [items, domains] = await Promise.all([
    listMdmItems(catalog.code),
    listMdmDomains(),
  ]);
  const domain = domains.find((d) => d.code === catalog.domain_code);

  const cols: Column<MdmItem>[] = [
    { key: "code", header: "Código", width: "12%", render: (i) => <span className="font-mono text-xs text-ink-high">{i.code}</span> },
    {
      key: "name",
      header: "Nombre",
      render: (i) => (
        <div className="min-w-0">
          <p className="truncate text-ink-high">{i.name}</p>
          {i.description ? <p className="truncate text-xs text-ink-mid">{i.description}</p> : null}
        </div>
      ),
    },
    {
      key: "scope",
      header: "Alcance",
      render: (i) => (
        <Badge tone={i.company_id === null ? "info" : "accent"}>
          {i.company_id === null ? "Global" : "Empresa"}
        </Badge>
      ),
    },
    {
      key: "system",
      header: "Sistema",
      align: "center",
      render: (i) =>
        i.is_system ? (
          <Badge tone="neutral">SYS</Badge>
        ) : (
          <span className="text-2xs text-ink-low">—</span>
        ),
    },
    {
      key: "order",
      header: "Orden",
      align: "right",
      render: (i) => <span className="font-mono tabular-nums text-ink-mid">{i.sort_order}</span>,
    },
    { key: "status", header: "Estado", render: (i) => <RecordStatusBadge status={i.status} /> },
    {
      key: "updated",
      header: "Actualizado",
      align: "right",
      render: (i) => <span className="font-mono text-2xs text-ink-mid">{formatDate(i.updated_at)}</span>,
    },
  ];

  return (
    <PageShell
      crumbs={[
        { label: "Master Data", href: "/master-data" },
        { label: domain?.name ?? catalog.domain_code },
        { label: catalog.name },
      ]}
    >
      <SectionHeader
        eyebrow={`${catalog.domain_code} · ${catalog.code}`}
        title={catalog.name}
        description={catalog.description}
        actions={
          <>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded border border-surface-border bg-canvas-raised px-2.5 py-1.5 text-xs font-medium text-ink-mid hover:bg-surface-hover hover:text-ink-high focus-ring"
            >
              <Upload className="h-3.5 w-3.5" /> Importar
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded border border-surface-border bg-canvas-raised px-2.5 py-1.5 text-xs font-medium text-ink-mid hover:bg-surface-hover hover:text-ink-high focus-ring"
            >
              <Download className="h-3.5 w-3.5" /> Exportar
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded bg-accent px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-accent/90 focus-ring"
            >
              <Plus className="h-3.5 w-3.5" /> Nuevo item
            </button>
          </>
        }
      />

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card className="!p-3">
          <p className="text-2xs uppercase text-ink-low">Items activos</p>
          <p className="font-mono text-xl tabular-nums text-ink-high">{items.length}</p>
        </Card>
        <Card className="!p-3">
          <p className="text-2xs uppercase text-ink-low">Jerárquico</p>
          <p className="font-mono text-xl tabular-nums text-ink-high">{catalog.hierarchical ? "Sí" : "No"}</p>
        </Card>
        <Card className="!p-3">
          <p className="text-2xs uppercase text-ink-low">Sistema</p>
          <p className="font-mono text-xl tabular-nums text-ink-high">{catalog.is_system ? "Sí" : "No"}</p>
        </Card>
        <Card className="!p-3">
          <p className="text-2xs uppercase text-ink-low">Dominio</p>
          <p className="truncate text-sm text-ink-high">{domain?.name ?? catalog.domain_code}</p>
        </Card>
      </div>

      <div className="mt-5">
        {items.length > 0 ? (
          <Card padded={false}>
            <DataTable columns={cols} rows={items} />
          </Card>
        ) : (
          <EmptyState
            icon={Database}
            title="Catálogo sin items"
            description="Este catálogo está disponible pero aún no tiene items cargados. Puedes importar desde CSV o crear el primer item."
          />
        )}
      </div>
    </PageShell>
  );
}
