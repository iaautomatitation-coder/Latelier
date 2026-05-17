"use server";

import { revalidatePath } from "next/cache";
import {
  createRequirement,
  updateRequirement,
  deleteRequirement,
  getRequirement,
} from "@/lib/data/requirements-store";
import type { Priority, RequirementStatus } from "@/lib/types";

const PRIORITIES: Priority[] = ["low", "medium", "high", "critical"];
const STATUSES: RequirementStatus[] = ["identified", "validated", "in_design", "delivered", "rejected"];

type FieldKey =
  | "area_code"
  | "process_code"
  | "problem"
  | "need"
  | "proposed_solution"
  | "suggested_module";

export interface ReqActionState {
  ok: boolean | null;
  error?: string;
  fieldErrors?: Partial<Record<FieldKey, string>>;
  itemId?: string;
}

function readForm(formData: FormData) {
  const area_code = String(formData.get("area_code") ?? "").trim();
  const process_code = String(formData.get("process_code") ?? "").trim();
  const problem = String(formData.get("problem") ?? "").trim();
  const need = String(formData.get("need") ?? "").trim();
  const proposed_solution = String(formData.get("proposed_solution") ?? "").trim();
  const suggested_module = String(formData.get("suggested_module") ?? "").trim();
  const priorityRaw = String(formData.get("priority") ?? "medium") as Priority;
  const riskRaw = String(formData.get("risk_level") ?? "medium") as Priority;
  const statusRaw = String(formData.get("status") ?? "identified") as RequirementStatus;
  return {
    area_code,
    process_code,
    problem,
    need,
    proposed_solution,
    suggested_module,
    priority: PRIORITIES.includes(priorityRaw) ? priorityRaw : "medium",
    risk_level: PRIORITIES.includes(riskRaw) ? riskRaw : "medium",
    status: STATUSES.includes(statusRaw) ? statusRaw : "identified",
  };
}

function validate(input: ReturnType<typeof readForm>) {
  const errors: ReqActionState["fieldErrors"] = {};
  if (!input.area_code) errors.area_code = "Selecciona un área";
  if (!input.process_code) errors.process_code = "Selecciona un proceso";
  if (!input.problem) errors.problem = "Requerido";
  else if (input.problem.length > 500) errors.problem = "Máximo 500 caracteres";
  if (!input.need) errors.need = "Requerido";
  else if (input.need.length > 500) errors.need = "Máximo 500 caracteres";
  if (input.proposed_solution.length > 500) errors.proposed_solution = "Máximo 500 caracteres";
  if (input.suggested_module.length > 80) errors.suggested_module = "Máximo 80 caracteres";
  return Object.keys(errors).length > 0 ? errors : null;
}

export async function createRequirementAction(
  studyId: string,
  _prev: ReqActionState,
  formData: FormData,
): Promise<ReqActionState> {
  const input = readForm(formData);
  const fieldErrors = validate(input);
  if (fieldErrors) return { ok: false, fieldErrors };
  const req = createRequirement({ study_id: studyId, ...input });
  revalidatePath(`/studies/${studyId}/requirements`);
  revalidatePath(`/studies/${studyId}`);
  revalidatePath(`/dashboard`);
  return { ok: true, itemId: req.id };
}

export async function updateRequirementAction(
  studyId: string,
  requirementId: string,
  _prev: ReqActionState,
  formData: FormData,
): Promise<ReqActionState> {
  const existing = getRequirement(requirementId);
  if (!existing) return { ok: false, error: "Requerimiento no encontrado" };
  const input = readForm(formData);
  const fieldErrors = validate(input);
  if (fieldErrors) return { ok: false, fieldErrors };
  updateRequirement(requirementId, input);
  revalidatePath(`/studies/${studyId}/requirements`);
  revalidatePath(`/studies/${studyId}`);
  return { ok: true, itemId: requirementId };
}

export async function deleteRequirementAction(
  studyId: string,
  requirementId: string,
): Promise<ReqActionState> {
  const existing = getRequirement(requirementId);
  if (!existing) return { ok: false, error: "Requerimiento no encontrado" };
  deleteRequirement(requirementId);
  revalidatePath(`/studies/${studyId}/requirements`);
  revalidatePath(`/studies/${studyId}`);
  revalidatePath(`/dashboard`);
  return { ok: true };
}
