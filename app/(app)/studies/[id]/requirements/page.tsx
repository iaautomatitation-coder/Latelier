import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getStudy, getStudyRequirements, listMdmItems } from "@/lib/data";
import { RequirementsManager } from "@/components/requirements/RequirementsManager";

export default async function RequirementsPage({ params }: { params: { id: string } }) {
  const study = await getStudy(params.id);
  if (!study) notFound();
  const [requirements, areas, processes] = await Promise.all([
    getStudyRequirements(study.id),
    listMdmItems("areas"),
    listMdmItems("processes"),
  ]);

  return (
    <PageShell
      crumbs={[
        { label: "Estudios", href: "/studies" },
        { label: study.code, href: `/studies/${study.id}` },
        { label: "Requerimientos" },
      ]}
    >
      <SectionHeader
        eyebrow="Matriz de requerimientos"
        title={`Requerimientos · ${study.code}`}
        description="Necesidades funcionales identificadas, módulos sugeridos y nivel de prioridad. Áreas y procesos provienen del Master Data Center."
      />

      <div className="mt-5">
        <RequirementsManager
          studyId={study.id}
          requirements={requirements}
          areas={areas}
          processes={processes}
        />
      </div>
    </PageShell>
  );
}
