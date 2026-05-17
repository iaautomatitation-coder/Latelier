"use server";

import { revalidatePath } from "next/cache";
import {
  createRisk,
  updateRisk,
  deleteRisk,
  getRisk,
} from "@/lib/data/risks-store";
import type { Probability, RiskStatus, Severity } from "@/lib/types";

const STATUSES: RiskStatus[] = ["open", "mitigating", "accepted", "closed"];

type FieldKey =
  | "category_code"
  | "title"
  | "description"
  | "probability"
  | "impact"
  | "mitigation"
  | "owner";

export interface RiskActionState {
  ok: boolean | null;
  error?: string;
  fieldErrors?: Partial<Record<FieldKey, string>>;
  itemId?: string;
}

function readForm(formData: FormData) {
  const category_code = String(formData.get("category_code") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const probability = Number.parseInt(String(formData.get("probability") ?? "0"), 10);
  const impact = Number.parseInt(String(formData.get("impact") ?? "0"), 10);
  const mitigation = String(formData.get("mitigation") ?? "").trim();
  const owner = String(formData.get("owner") ?? "").trim();
  const statusRaw = String(formData.get("status") ?? "open") as RiskStatus;
  return {
    category_code,
    title,
    description,
    probability,
    impact,
    mitigation,
    owner,
    status: STATUSES.includes(statusRaw) ? statusRaw : "open",
  };
}

function validate(input: ReturnType<typeof readForm>) {
  const errors: RiskActionState["fieldErrors"] = {};
  if (!input.category_code) errors.category_code = "Selecciona una categoría";
  if (!input.title) errors.title = "Requerido";
  else if (input.title.length > 200) errors.title = "Máximo 200 caracteres";
  if (input.description.length > 1000) errors.description = "Máximo 1000 caracteres";
  if (!Number.isFinite(input.probability) || input.probability < 1 || input.probability > 5) {
    errors.probability = "Entre 1 y 5";
  }
  if (!Number.isFinite(input.impact) || input.impact < 1 || input.impact > 5) {
    errors.impact = "Entre 1 y 5";
  }
  if (input.mitigation.length > 1000) errors.mitigation = "Máximo 1000 caracteres";
  if (input.owner.length > 120) errors.owner = "Máximo 120 caracteres";
  return Object.keys(errors).length > 0 ? errors : null;
}

export async function createRiskAction(
  studyId: string,
  _prev: RiskActionState,
  formData: FormData,
): Promise<RiskActionState> {
  const input = readForm(formData);
  const fieldErrors = validate(input);
  if (fieldErrors) return { ok: false, fieldErrors };
  const risk = createRisk({
    study_id: studyId,
    category_code: input.category_code,
    title: input.title,
    description: input.description,
    probability: input.probability as Probability,
    impact: input.impact as Severity,
    mitigation: input.mitigation,
    status: input.status,
    owner: input.owner,
  });
  revalidatePath(`/studies/${studyId}/risks`);
  revalidatePath(`/studies/${studyId}`);
  revalidatePath(`/dashboard`);
  return { ok: true, itemId: risk.id };
}

export async function updateRiskAction(
  studyId: string,
  riskId: string,
  _prev: RiskActionState,
  formData: FormData,
): Promise<RiskActionState> {
  const existing = getRisk(riskId);
  if (!existing) return { ok: false, error: "Riesgo no encontrado" };
  const input = readForm(formData);
  const fieldErrors = validate(input);
  if (fieldErrors) return { ok: false, fieldErrors };
  updateRisk(riskId, {
    category_code: input.category_code,
    title: input.title,
    description: input.description,
    probability: input.probability as Probability,
    impact: input.impact as Severity,
    mitigation: input.mitigation,
    status: input.status,
    owner: input.owner,
  });
  revalidatePath(`/studies/${studyId}/risks`);
  revalidatePath(`/studies/${studyId}`);
  revalidatePath(`/dashboard`);
  return { ok: true, itemId: riskId };
}

export async function deleteRiskAction(
  studyId: string,
  riskId: string,
): Promise<RiskActionState> {
  const existing = getRisk(riskId);
  if (!existing) return { ok: false, error: "Riesgo no encontrado" };
  deleteRisk(riskId);
  revalidatePath(`/studies/${studyId}/risks`);
  revalidatePath(`/studies/${studyId}`);
  revalidatePath(`/dashboard`);
  return { ok: true };
}
