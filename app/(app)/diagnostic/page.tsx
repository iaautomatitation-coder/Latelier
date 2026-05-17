import { StubPanel } from "@/components/ui/StubPanel";
import { Stethoscope } from "lucide-react";

export default function DiagnosticIndex() {
  return (
    <StubPanel
      crumbs={[{ label: "Diagnóstico" }]}
      eyebrow="Diagnóstico transversal"
      title="Diagnóstico consolidado"
      description="Vista cross-estudio del diagnóstico por área funcional. Permitirá comparar madurez entre clientes y benchmarks de industria."
      icon={Stethoscope}
      capabilities={[
        "Comparativo de madurez por área entre estudios",
        "Heatmap de hallazgos por dimensión",
        "Drill-down a evidencia de cada hallazgo",
        "Exportable a reporte ejecutivo PDF/PPTX",
      ]}
      schema={[
        { table: "study_areas", fields: ["id", "study_id", "area_code", "maturity", "status"] },
        { table: "findings", fields: ["id", "study_id", "area_code", "severity", "evidence_count"] },
      ]}
    />
  );
}
