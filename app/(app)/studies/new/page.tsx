import { PageShell } from "@/components/layout/PageShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { listCompanies } from "@/lib/data";
import { StudyForm } from "@/components/studies/StudyForm";

export default async function NewStudyPage() {
  const companies = await listCompanies();
  return (
    <PageShell
      crumbs={[
        { label: "Estudios", href: "/studies" },
        { label: "Nuevo" },
      ]}
    >
      <SectionHeader
        eyebrow="Nuevo estudio"
        title="Iniciar un diagnóstico"
        description="Define el alcance del estudio, asígnalo a una empresa cliente y la plataforma inicializará las 9 áreas funcionales para el diagnóstico."
      />

      <div className="mt-5 max-w-3xl">
        <Card>
          <StudyForm companies={companies} study={null} />
        </Card>
      </div>
    </PageShell>
  );
}
