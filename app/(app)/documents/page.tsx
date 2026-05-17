import { StubPanel } from "@/components/ui/StubPanel";
import { FileText } from "lucide-react";

export default function DocumentsIndex() {
  return (
    <StubPanel
      crumbs={[{ label: "Evidencias" }]}
      eyebrow="Repositorio documental"
      title="Evidencias y documentos"
      description="Acervo centralizado de evidencias, certificados, manuales, fotos y reportes asociados a cada hallazgo y requerimiento."
      icon={FileText}
      capabilities={[
        "Subida desde móvil/desktop con tag de proceso y activo",
        "Tipologías desde catálogo MDM 'inspection_types' y 'certifications'",
        "Vínculo con hallazgos, requerimientos y riesgos",
        "Versionado y trazabilidad de cambios documentales",
      ]}
      schema={[
        { table: "documents", fields: ["id", "study_id", "type_code", "title", "uri", "uploaded_by"] },
        { table: "study_documents", fields: ["study_id", "document_id"] },
      ]}
    />
  );
}
