"use server";

import { revalidatePath } from "next/cache";
import {
  createFinding,
  updateFinding,
  deleteFinding,
  getFinding,
} from "@/lib/data/findings-store";
import type { Severity } from "@/lib/types";

type FieldKey = "area_code" | "title" | "description" | "severity" | "evidence_count";

export interface FindingActionState {
  ok: boolean | null;
  error?: string;
  fieldErrors?: Partial<Record<FieldKey, string>>;
  itemId?: string;
}

function readForm(formData: FormData) {
  const area_code = String(formData.get("area_code") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const severity = Number.parseInt(String(formData.get("severity") ?? "0"), 10);
  const evidence_count = Number.parseInt(String(formData.get("evidence_count") ?? "0"), 10);
  return { area_code, title, description, severity, evidence_count };
}

function validate(input: ReturnType<typeof readForm>) {
  const errors: FindingActionState["fieldErrors"] = {};
  if (!input.area_code) errors.area_code = "Selecciona un área";
  if (!input.title) errors.title = "Requerido";
  else if (input.title.length > 200) errors.title = "Máximo 200 caracteres";
  if (input.description.length > 1000) errors.description = "Máximo 1000 caracteres";
  if (!Number.isFinite(input.severity) || input.severity < 1 || input.severity > 5) {
    errors.severity = "Entre 1 y 5";
  }
  if (!Number.isFinite(input.evidence_count) || input.evidence_count < 0 || input.evidence_count > 999) {
    errors.evidence_count = "Entre 0 y 999";
  }
  return Object.keys(errors).length > 0 ? errors : null;
}

export async function createFindingAction(
  studyId: string,
  _prev: FindingActionState,
  formData: FormData,
): Promise<FindingActionState> {
  const input = readForm(formData);
  const fieldErrors = validate(input);
  if (fieldErrors) return { ok: false, fieldErrors };
  const finding = createFinding({
    study_id: studyId,
    area_code: input.area_code,
    title: input.title,
    description: input.description,
    severity: input.severity as Severity,
    evidence_count: input.evidence_count,
  });
  revalidatePath(`/studies/${studyId}/diagnostic`);
  revalidatePath(`/studies/${studyId}`);
  return { ok: true, itemId: finding.id };
}

export async function updateFindingAction(
  studyId: string,
  findingId: string,
  _prev: FindingActionState,
  formData: FormData,
): Promise<FindingActionState> {
  const existing = getFinding(findingId);
  if (!existing) return { ok: false, error: "Hallazgo no encontrado" };
  const input = readForm(formData);
  const fieldErrors = validate(input);
  if (fieldErrors) return { ok: false, fieldErrors };
  updateFinding(findingId, {
    area_code: input.area_code,
    title: input.title,
    description: input.description,
    severity: input.severity as Severity,
    evidence_count: input.evidence_count,
  });
  revalidatePath(`/studies/${studyId}/diagnostic`);
  revalidatePath(`/studies/${studyId}`);
  return { ok: true, itemId: findingId };
}

export async function deleteFindingAction(
  studyId: string,
  findingId: string,
): Promise<FindingActionState> {
  const existing = getFinding(findingId);
  if (!existing) return { ok: false, error: "Hallazgo no encontrado" };
  deleteFinding(findingId);
  revalidatePath(`/studies/${studyId}/diagnostic`);
  revalidatePath(`/studies/${studyId}`);
  return { ok: true };
}
