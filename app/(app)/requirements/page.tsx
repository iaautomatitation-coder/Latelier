import { StubPanel } from "@/components/ui/StubPanel";
import { ListChecks } from "lucide-react";

export default function RequirementsIndex() {
  return (
    <StubPanel
      crumbs={[{ label: "Requerimientos" }]}
      eyebrow="Vista transversal"
      title="Matriz consolidada de requerimientos"
      description="Vista global del portafolio: necesidades repetidas entre clientes, módulos sugeridos más demandados y backlog priorizado."
      icon={ListChecks}
      capabilities={[
        "Filtros por área, proceso, módulo, prioridad",
        "Detección de requerimientos recurrentes (clustering)",
        "Agrupación por módulo sugerido para roadmap de producto",
        "Vínculo a evidencias y procesos documentados",
      ]}
      schema={[
        { table: "requirements", fields: ["id", "study_id", "area_code", "process_code", "priority", "status"] },
        { table: "requirement_modules", fields: ["requirement_id", "module_code"] },
      ]}
    />
  );
}
