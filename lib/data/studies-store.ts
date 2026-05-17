// Mutable in-memory store for Studies + Study Areas.

import { studies as seedStudies, studyAreas as seedStudyAreas } from "@/lib/seed/studies";
import { mdmItems } from "@/lib/seed/master-data";
import type { Study, StudyArea, StudyStatus } from "@/lib/types";

const studiesStore: Study[] = [...seedStudies];
const areasStore: StudyArea[] = [...seedStudyAreas];

let counter = 0;
function nextStudyId(): string {
  counter += 1;
  return `s-${Date.now().toString(36)}-${counter.toString(36)}`;
}
function nextAreaId(): string {
  counter += 1;
  return `sa-${Date.now().toString(36)}-${counter.toString(36)}`;
}

// ---------- Studies ----------

export function listStudies(): Study[] {
  return [...studiesStore].sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function getStudy(id: string): Study | null {
  return studiesStore.find((s) => s.id === id) ?? null;
}

export function countActiveStudies(): number {
  return studiesStore.filter((s) => s.status === "in_progress" || s.status === "review").length;
}

export function averageMaturity(): number {
  if (studiesStore.length === 0) return 0;
  return Math.round(
    studiesStore.reduce((sum, s) => sum + s.maturity_score, 0) / studiesStore.length,
  );
}

export interface CreateStudyInput {
  company_id: string;
  code: string;
  name: string;
  description: string;
  status: StudyStatus;
  lead: string;
  started_at: string;
  target_end_at: string;
}

export function createStudy(input: CreateStudyInput): Study {
  const now = new Date().toISOString();
  const study: Study = {
    id: nextStudyId(),
    company_id: input.company_id,
    code: input.code,
    name: input.name,
    description: input.description,
    status: input.status,
    maturity_score: 0,
    progress: 0,
    lead: input.lead,
    started_at: input.started_at,
    target_end_at: input.target_end_at,
    created_at: now,
  };
  studiesStore.push(study);

  // Auto-create study areas from MDM 'areas' catalog so the diagnostic
  // page is functional from day one.
  const areaItems = mdmItems
    .filter((i) => i.catalog_code === "areas" && i.deleted_at === null)
    .sort((a, b) => a.sort_order - b.sort_order);
  for (const a of areaItems) {
    areasStore.push({
      id: nextAreaId(),
      study_id: study.id,
      area_code: a.code,
      name: a.name,
      status: "pending",
      maturity: 0,
      findings_count: 0,
      owner: "—",
    });
  }
  return study;
}

export type UpdateStudyInput = Partial<Omit<CreateStudyInput, "company_id">> & {
  maturity_score?: number;
  progress?: number;
};

export function updateStudy(id: string, patch: UpdateStudyInput): Study | null {
  const study = studiesStore.find((s) => s.id === id);
  if (!study) return null;
  if (patch.code !== undefined) study.code = patch.code;
  if (patch.name !== undefined) study.name = patch.name;
  if (patch.description !== undefined) study.description = patch.description;
  if (patch.status !== undefined) study.status = patch.status;
  if (patch.lead !== undefined) study.lead = patch.lead;
  if (patch.started_at !== undefined) study.started_at = patch.started_at;
  if (patch.target_end_at !== undefined) study.target_end_at = patch.target_end_at;
  if (patch.maturity_score !== undefined) study.maturity_score = patch.maturity_score;
  if (patch.progress !== undefined) study.progress = patch.progress;
  return study;
}

export function hasStudyCode(code: string, exceptId?: string): boolean {
  return studiesStore.some(
    (s) => s.code.toLowerCase() === code.toLowerCase() && s.id !== exceptId,
  );
}

// ---------- Study Areas ----------

export function getStudyAreas(studyId: string): StudyArea[] {
  return areasStore
    .filter((a) => a.study_id === studyId)
    .sort((a, b) => a.area_code.localeCompare(b.area_code));
}

export function countCompletedAreas(): number {
  return areasStore.filter((a) => a.status === "completed").length;
}

export function countTotalAreas(): number {
  return areasStore.length;
}
