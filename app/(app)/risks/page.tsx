import { StubPanel } from "@/components/ui/StubPanel";
import { ShieldAlert } from "lucide-react";

export default function RisksIndex() {
  return (
    <StubPanel
      crumbs={[{ label: "Riesgos" }]}
      eyebrow="Vista consolidada"
      title="Mapa de riesgos del portafolio"
      description="Exposición agregada de riesgos operacionales, financieros y de compliance entre todos los estudios activos."
      icon={ShieldAlert}
      capabilities={[
        "Matriz 5×5 agregada con drill-down por estudio",
        "Top-N riesgos críticos del portafolio",
        "Tracking de mitigaciones y owners",
        "Categorías y severidades desde Master Data",
      ]}
      schema={[
        { table: "risks", fields: ["id", "study_id", "category_code", "probability", "impact", "criticality"] },
        { table: "study_risks", fields: ["study_id", "risk_id"] },
      ]}
    />
  );
}
