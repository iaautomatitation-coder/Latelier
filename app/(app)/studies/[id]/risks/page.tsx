import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getStudy, getStudyRisks, listMdmItems } from "@/lib/data";
import { RisksManager } from "@/components/risks/RisksManager";

export default async function RisksPage({ params }: { params: { id: string } }) {
  const study = await getStudy(params.id);
  if (!study) notFound();
  const [risks, categories] = await Promise.all([
    getStudyRisks(study.id),
    listMdmItems("risk_categories"),
  ]);

  return (
    <PageShell
      crumbs={[
        { label: "Estudios", href: "/studies" },
        { label: study.code, href: `/studies/${study.id}` },
        { label: "Riesgos" },
      ]}
    >
      <SectionHeader
        eyebrow="Matriz de riesgos"
        title={`Riesgos · ${study.code}`}
        description="Probabilidad × impacto. La matriz se recalcula al editar P×I; las categorías provienen del Master Data Center."
      />

      <div className="mt-5">
        <RisksManager studyId={study.id} risks={risks} categories={categories} />
      </div>
    </PageShell>
  );
}
