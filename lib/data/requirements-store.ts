// Mutable in-memory store for Requirements.
// Mirrors mdm-store.ts: same pattern, same semantics. Swap bodies for
// Supabase queries against `requirements` when SUPABASE_URL is configured.

import { requirements as seed } from "@/lib/seed/requirements";
import type { Priority, Requirement, RequirementStatus } from "@/lib/types";

const store: Requirement[] = [...seed];

let counter = 0;
function nextId(): string {
  counter += 1;
  return `req-${Date.now().toString(36)}-${counter.toString(36)}`;
}

export function listRequirements(studyId: string): Requirement[] {
  return store
    .filter((r) => r.study_id === studyId)
    .sort((a, b) => prio(b.priority) - prio(a.priority));
}

export function countAllRequirements(): number {
  return store.length;
}

export function getRequirement(id: string): Requirement | null {
  return store.find((r) => r.id === id) ?? null;
}

export interface CreateRequirementInput {
  study_id: string;
  area_code: string;
  process_code: string;
  problem: string;
  need: string;
  proposed_solution: string;
  suggested_module: string;
  priority: Priority;
  risk_level: Priority;
  status: RequirementStatus;
}

export function createRequirement(input: CreateRequirementInput): Requirement {
  const req: Requirement = { id: nextId(), ...input };
  store.push(req);
  return req;
}

export type UpdateRequirementInput = Partial<Omit<CreateRequirementInput, "study_id">>;

export function updateRequirement(id: string, patch: UpdateRequirementInput): Requirement | null {
  const req = store.find((r) => r.id === id);
  if (!req) return null;
  if (patch.area_code !== undefined) req.area_code = patch.area_code;
  if (patch.process_code !== undefined) req.process_code = patch.process_code;
  if (patch.problem !== undefined) req.problem = patch.problem;
  if (patch.need !== undefined) req.need = patch.need;
  if (patch.proposed_solution !== undefined) req.proposed_solution = patch.proposed_solution;
  if (patch.suggested_module !== undefined) req.suggested_module = patch.suggested_module;
  if (patch.priority !== undefined) req.priority = patch.priority;
  if (patch.risk_level !== undefined) req.risk_level = patch.risk_level;
  if (patch.status !== undefined) req.status = patch.status;
  return req;
}

export function deleteRequirement(id: string): boolean {
  const idx = store.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  store.splice(idx, 1);
  return true;
}

function prio(p: Priority): number {
  return { low: 1, medium: 2, high: 3, critical: 4 }[p];
}
