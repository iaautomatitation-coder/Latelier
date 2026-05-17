import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { getMdmCatalog, listMdmItems, listMdmDomains } from "@/lib/data";
import { ItemsManager } from "@/components/mdm/ItemsManager";
import { Download, Upload } from "lucide-react";

export default async function CatalogDetailPage({ params }: { params: { catalog: string } }) {
  const catalog = await getMdmCatalog(params.catalog);
  if (!catalog) notFound();
  const [items, domains] = await Promise.all([
    listMdmItems(catalog.code),
    listMdmDomains(),
  ]);
  const domain = domains.find((d) => d.code === catalog.domain_code);

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
              disabled
              title="Próxima fase"
              className="inline-flex items-center gap-1.5 rounded border border-surface-border bg-canvas-raised px-2.5 py-1.5 text-xs font-medium text-ink-low opacity-60"
            >
              <Upload className="h-3.5 w-3.5" /> Importar
            </button>
            <button
              type="button"
              disabled
              title="Próxima fase"
              className="inline-flex items-center gap-1.5 rounded border border-surface-border bg-canvas-raised px-2.5 py-1.5 text-xs font-medium text-ink-low opacity-60"
            >
              <Download className="h-3.5 w-3.5" /> Exportar
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
        <ItemsManager catalog={catalog} items={items} />
      </div>
    </PageShell>
  );
}
