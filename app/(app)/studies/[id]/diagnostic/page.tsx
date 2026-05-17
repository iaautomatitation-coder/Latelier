import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getStudy, getStudyAreas, getStudyFindings } from "@/lib/data";
import { DiagnosticBoard } from "@/components/findings/DiagnosticBoard";

export default async function DiagnosticPage({ params }: { params: { id: string } }) {
  const study = await getStudy(params.id);
  if (!study) notFound();
  const [areas, findings] = await Promise.all([
    getStudyAreas(study.id),
    getStudyFindings(study.id),
  ]);

  return (
    <PageShell
      crumbs={[
        { label: "Estudios", href: "/studies" },
        { label: study.code, href: `/studies/${study.id}` },
        { label: "Diagnóstico" },
      ]}
    >
      <SectionHeader
        eyebrow="Diagnóstico por área"
        title="Madurez operacional"
        description="Evaluación cualitativa y hallazgos por área funcional del cliente. Hover sobre un hallazgo para editar o eliminar."
      />

      <div className="mt-5">
        <DiagnosticBoard studyId={study.id} areas={areas} findings={findings} />
      </div>
    </PageShell>
  );
}
