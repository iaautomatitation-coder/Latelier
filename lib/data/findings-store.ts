// Mutable in-memory store for Findings. Same shape as the other stores.

import { findings as seed } from "@/lib/seed/studies";
import type { Finding, Severity } from "@/lib/types";

const store: Finding[] = [...seed];

let counter = 0;
function nextId(): string {
  counter += 1;
  return `f-${Date.now().toString(36)}-${counter.toString(36)}`;
}

export function listFindings(studyId: string): Finding[] {
  return store
    .filter((f) => f.study_id === studyId)
    .sort((a, b) => b.severity - a.severity || a.created_at.localeCompare(b.created_at));
}

export function getFinding(id: string): Finding | null {
  return store.find((f) => f.id === id) ?? null;
}

export function countFindingsByArea(studyId: string, areaCode: string): number {
  return store.filter((f) => f.study_id === studyId && f.area_code === areaCode).length;
}

export interface CreateFindingInput {
  study_id: string;
  area_code: string;
  title: string;
  description: string;
  severity: Severity;
  evidence_count: number;
}

export function createFinding(input: CreateFindingInput): Finding {
  const now = new Date().toISOString();
  const finding: Finding = { id: nextId(), ...input, created_at: now };
  store.push(finding);
  return finding;
}

export type UpdateFindingInput = Partial<Omit<CreateFindingInput, "study_id">>;

export function updateFinding(id: string, patch: UpdateFindingInput): Finding | null {
  const f = store.find((x) => x.id === id);
  if (!f) return null;
  if (patch.area_code !== undefined) f.area_code = patch.area_code;
  if (patch.title !== undefined) f.title = patch.title;
  if (patch.description !== undefined) f.description = patch.description;
  if (patch.severity !== undefined) f.severity = patch.severity;
  if (patch.evidence_count !== undefined) f.evidence_count = patch.evidence_count;
  return f;
}

export function deleteFinding(id: string): boolean {
  const idx = store.findIndex((f) => f.id === id);
  if (idx === -1) return false;
  store.splice(idx, 1);
  return true;
}
