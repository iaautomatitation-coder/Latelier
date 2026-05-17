import { StubPanel } from "@/components/ui/StubPanel";
import { Workflow } from "lucide-react";

export default function ProcessesIndex() {
  return (
    <StubPanel
      crumbs={[{ label: "Procesos" }]}
      eyebrow="Documentación AS-IS / TO-BE"
      title="Procesos operacionales"
      description="Mapeo de procesos de renta, mantenimiento e inspección. Incluye actores, entradas, salidas, controles y métricas."
      icon={Workflow}
      capabilities={[
        "Diagrama BPMN ligero por proceso",
        "Versionado AS-IS vs TO-BE",
        "Asociación con catálogo MDM 'processes'",
        "Vínculo bidireccional con requerimientos",
      ]}
      schema={[
        { table: "study_processes", fields: ["id", "study_id", "process_code", "version", "actors", "controls"] },
        { table: "process_requirements", fields: ["process_id", "requirement_id"] },
      ]}
    />
  );
}
