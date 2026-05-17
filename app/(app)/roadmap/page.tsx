import { StubPanel } from "@/components/ui/StubPanel";
import { Map } from "lucide-react";

export default function RoadmapIndex() {
  return (
    <StubPanel
      crumbs={[{ label: "Roadmap" }]}
      eyebrow="Visión consolidada"
      title="Roadmap del portafolio"
      description="Timeline ejecutivo de iniciativas por fase (discovery → stabilize) entre todos los estudios."
      icon={Map}
      capabilities={[
        "Gantt ligero por estudio y por fase",
        "Dependencias entre iniciativas",
        "Vínculo con requerimientos priorizados",
        "Snapshot de avance vs plan",
      ]}
      schema={[
        { table: "roadmap_items", fields: ["id", "study_id", "phase", "title", "start_at", "end_at", "status"] },
      ]}
    />
  );
}
