import { StubPanel } from "@/components/ui/StubPanel";
import { BarChart3 } from "lucide-react";

export default function ReportsIndex() {
  return (
    <StubPanel
      crumbs={[{ label: "Reportes" }]}
      eyebrow="Salida ejecutiva"
      title="Reportes y entregables"
      description="Generación de reportes ejecutivos para C-Level: diagnóstico, hallazgos, matriz de requerimientos, roadmap y costeo estimado."
      icon={BarChart3}
      capabilities={[
        "Plantillas PDF/PPTX con branding del estudio",
        "Snapshot inmutable por revisión",
        "Audit trail de envíos al cliente",
        "Métricas y KPIs desde catálogo MDM 'kpis'",
      ]}
      schema={[
        { table: "reports", fields: ["id", "study_id", "template_code", "version", "delivered_at"] },
        { table: "audit_events", fields: ["id", "entity_type", "entity_id", "actor", "action", "at"] },
      ]}
    />
  );
}
