// Mutable in-memory store for Risks. Mirrors mdm-store / requirements-store.

import { risks as seed } from "@/lib/seed/risks";
import type { Probability, Risk, RiskStatus, Severity } from "@/lib/types";

const store: Risk[] = [...seed];

let counter = 0;
function nextId(): string {
  counter += 1;
  return `rk-${Date.now().toString(36)}-${counter.toString(36)}`;
}

export function listRisks(studyId: string): Risk[] {
  return store
    .filter((r) => r.study_id === studyId)
    .sort((a, b) => b.criticality - a.criticality);
}

export function getRisk(id: string): Risk | null {
  return store.find((r) => r.id === id) ?? null;
}

export function countCriticalRisks(threshold = 16): number {
  return store.filter((r) => r.criticality >= threshold).length;
}

export interface CreateRiskInput {
  study_id: string;
  category_code: string;
  title: string;
  description: string;
  probability: Probability;
  impact: Severity;
  mitigation: string;
  status: RiskStatus;
  owner: string;
}

export function createRisk(input: CreateRiskInput): Risk {
  const risk: Risk = {
    id: nextId(),
    ...input,
    criticality: input.probability * input.impact,
  };
  store.push(risk);
  return risk;
}

export type UpdateRiskInput = Partial<Omit<CreateRiskInput, "study_id">>;

export function updateRisk(id: string, patch: UpdateRiskInput): Risk | null {
  const risk = store.find((r) => r.id === id);
  if (!risk) return null;
  if (patch.category_code !== undefined) risk.category_code = patch.category_code;
  if (patch.title !== undefined) risk.title = patch.title;
  if (patch.description !== undefined) risk.description = patch.description;
  if (patch.probability !== undefined) risk.probability = patch.probability;
  if (patch.impact !== undefined) risk.impact = patch.impact;
  if (patch.mitigation !== undefined) risk.mitigation = patch.mitigation;
  if (patch.status !== undefined) risk.status = patch.status;
  if (patch.owner !== undefined) risk.owner = patch.owner;
  risk.criticality = risk.probability * risk.impact;
  return risk;
}

export function deleteRisk(id: string): boolean {
  const idx = store.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  store.splice(idx, 1);
  return true;
}
