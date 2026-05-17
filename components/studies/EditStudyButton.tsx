"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { StudyForm } from "@/components/studies/StudyForm";
import type { Company, Study } from "@/lib/types";

export function EditStudyButton({
  study,
  companies,
}: {
  study: Study;
  companies: Company[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded border border-surface-border bg-canvas-raised px-2.5 py-1.5 text-xs font-medium text-ink-mid hover:bg-surface-hover hover:text-ink-high focus-ring"
      >
        <Pencil className="h-3.5 w-3.5" /> Editar estudio
      </button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Editar estudio"
        subtitle={study.code}
        width="max-w-xl"
      >
        <StudyForm companies={companies} study={study} onSuccess={() => setOpen(false)} />
      </Drawer>
    </>
  );
}
