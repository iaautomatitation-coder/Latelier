"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createStudy,
  updateStudy,
  hasStudyCode,
  getStudy,
} from "@/lib/data/studies-store";
import type { StudyStatus } from "@/lib/types";

const STATUSES: StudyStatus[] = ["draft", "in_progress", "review", "closed"];
const CODE_RE = /^[A-Za-z0-9_\-./]+$/;

type FieldKey =
  | "company_id"
  | "code"
  | "name"
  | "description"
  | "lead"
  | "started_at"
  | "target_end_at"
  | "maturity_score"
  | "progress";

export interface StudyActionState {
  ok: boolean | null;
  error?: string;
  fieldErrors?: Partial<Record<FieldKey, string>>;
  studyId?: string;
}

function readForm(formData: FormData) {
  return {
    company_id: String(formData.get("company_id") ?? "").trim(),
    code: String(formData.get("code") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    lead: String(formData.get("lead") ?? "").trim(),
    started_at: String(formData.get("started_at") ?? "").trim(),
    target_end_at: String(formData.get("target_end_at") ?? "").trim(),
    status: ((): StudyStatus => {
      const s = String(formData.get("status") ?? "draft") as StudyStatus;
      return STATUSES.includes(s) ? s : "draft";
    })(),
    maturity_score: Number.parseInt(String(formData.get("maturity_score") ?? "0"), 10),
    progress: Number.parseInt(String(formData.get("progress") ?? "0"), 10),
  };
}

function validateBase(input: ReturnType<typeof readForm>, exceptId?: string) {
  const errors: StudyActionState["fieldErrors"] = {};
  if (!input.code) errors.code = "Requerido";
  else if (input.code.length > 50) errors.code = "Máximo 50 caracteres";
  else if (!CODE_RE.test(input.code)) errors.code = "Solo letras, números, _ . - /";
  else if (hasStudyCode(input.code, exceptId)) errors.code = "Código duplicado";

  if (!input.name) errors.name = "Requerido";
  else if (input.name.length > 200) errors.name = "Máximo 200 caracteres";

  if (input.description.length > 1000) errors.description = "Máximo 1000 caracteres";

  if (input.lead.length > 120) errors.lead = "Máximo 120 caracteres";

  if (input.started_at && Number.isNaN(Date.parse(input.started_at))) {
    errors.started_at = "Fecha inválida";
  }
  if (input.target_end_at && Number.isNaN(Date.parse(input.target_end_at))) {
    errors.target_end_at = "Fecha inválida";
  }
  if (
    input.started_at &&
    input.target_end_at &&
    Date.parse(input.target_end_at) < Date.parse(input.started_at)
  ) {
    errors.target_end_at = "Debe ser ≥ fecha de inicio";
  }
  if (
    !Number.isFinite(input.maturity_score) ||
    input.maturity_score < 0 ||
    input.maturity_score > 100
  ) {
    errors.maturity_score = "0 a 100";
  }
  if (!Number.isFinite(input.progress) || input.progress < 0 || input.progress > 100) {
    errors.progress = "0 a 100";
  }
  return errors;
}

export async function createStudyAction(
  _prev: StudyActionState,
  formData: FormData,
): Promise<StudyActionState> {
  const input = readForm(formData);
  const errors = validateBase(input);
  if (!input.company_id) errors.company_id = "Selecciona una empresa";
  if (Object.keys(errors).length > 0) return { ok: false, fieldErrors: errors };
  const study = createStudy({
    company_id: input.company_id,
    code: input.code,
    name: input.name,
    description: input.description,
    status: input.status,
    lead: input.lead,
    started_at: input.started_at || new Date().toISOString(),
    target_end_at: input.target_end_at || new Date(Date.now() + 90 * 86400000).toISOString(),
  });
  revalidatePath("/studies");
  revalidatePath("/dashboard");
  redirect(`/studies/${study.id}`);
}

export async function updateStudyAction(
  studyId: string,
  _prev: StudyActionState,
  formData: FormData,
): Promise<StudyActionState> {
  const existing = getStudy(studyId);
  if (!existing) return { ok: false, error: "Estudio no encontrado" };
  const input = readForm(formData);
  const errors = validateBase(input, studyId);
  if (Object.keys(errors).length > 0) return { ok: false, fieldErrors: errors };
  updateStudy(studyId, {
    code: input.code,
    name: input.name,
    description: input.description,
    status: input.status,
    lead: input.lead,
    started_at: input.started_at || existing.started_at,
    target_end_at: input.target_end_at || existing.target_end_at,
    maturity_score: input.maturity_score,
    progress: input.progress,
  });
  revalidatePath(`/studies/${studyId}`);
  revalidatePath("/studies");
  revalidatePath("/dashboard");
  return { ok: true, studyId };
}
