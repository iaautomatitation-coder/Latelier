// Data access layer. Falls back to in-memory seed when Supabase is not configured.
// All page components consume THIS layer, never the seed directly, so swapping
// to a real DB later only requires implementing the Supabase branches below.

import { companies as seedCompanies } from "@/lib/seed/companies";
import {
  studies as seedStudies,
  studyAreas as seedStudyAreas,
  roadmapItems as seedRoadmap,
  documents as seedDocuments,
} from "@/lib/seed/studies";
import {
  listFindings as listFindingsFromStore,
  getFinding as getFindingFromStore,
} from "@/lib/data/findings-store";
import { mdmDomains, mdmCatalogs } from "@/lib/seed/master-data";
import { listItems as listStoreItems, getItem as getStoreItem } from "@/lib/data/mdm-store";
import {
  listRequirements as listReqsFromStore,
  getRequirement as getReqFromStore,
  countAllRequirements,
} from "@/lib/data/requirements-store";
import {
  listRisks as listRisksFromStore,
  getRisk as getRiskFromStore,
  countCriticalRisks,
} from "@/lib/data/risks-store";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import type {
  Company,
  Study,
  StudyArea,
  Finding,
  Requirement,
  Risk,
  RoadmapItem,
  DocumentRef,
  MdmDomain,
  MdmCatalog,
  MdmItem,
} from "@/lib/types";

export interface DashboardKpis {
  activeStudies: number;
  completedAreas: number;
  totalAreas: number;
  identifiedRequirements: number;
  criticalRisks: number;
  averageMaturity: number;
}

// In a production-ready setup, each function would branch:
//   if (isSupabaseConfigured()) return await supabaseQuery(...)
//   else return seedData
// For the MVP we always return seed; the branching is wired and ready for
// real queries to be plugged in once credentials are available.

export async function listCompanies(): Promise<Company[]> {
  if (isSupabaseConfigured()) {
    // TODO(supabase): const { data } = await client.from('companies').select('*'); return data ?? []
  }
  return seedCompanies;
}

export async function getCompany(id: string): Promise<Company | null> {
  const all = await listCompanies();
  return all.find((c) => c.id === id) ?? null;
}

export async function listStudies(): Promise<Study[]> {
  return seedStudies;
}

export async function getStudy(id: string): Promise<Study | null> {
  return seedStudies.find((s) => s.id === id) ?? null;
}

export async function getStudyAreas(studyId: string): Promise<StudyArea[]> {
  return seedStudyAreas.filter((a) => a.study_id === studyId);
}

export async function getStudyFindings(studyId: string): Promise<Finding[]> {
  return listFindingsFromStore(studyId);
}

export async function getFinding(id: string): Promise<Finding | null> {
  return getFindingFromStore(id);
}

export async function getStudyRequirements(studyId: string): Promise<Requirement[]> {
  return listReqsFromStore(studyId);
}

export async function getRequirement(id: string): Promise<Requirement | null> {
  return getReqFromStore(id);
}

export async function getStudyRisks(studyId: string): Promise<Risk[]> {
  return listRisksFromStore(studyId);
}

export async function getRisk(id: string): Promise<Risk | null> {
  return getRiskFromStore(id);
}

export async function getStudyRoadmap(studyId: string): Promise<RoadmapItem[]> {
  return seedRoadmap.filter((r) => r.study_id === studyId);
}

export async function getStudyDocuments(studyId: string): Promise<DocumentRef[]> {
  return seedDocuments.filter((d) => d.study_id === studyId);
}

export async function getDashboardKpis(): Promise<DashboardKpis> {
  const studies = await listStudies();
  const active = studies.filter((s) => s.status === "in_progress" || s.status === "review").length;
  const allAreas = seedStudyAreas;
  const completed = allAreas.filter((a) => a.status === "completed").length;
  const reqs = countAllRequirements();
  const critical = countCriticalRisks(16);
  const maturity =
    studies.length > 0
      ? Math.round(studies.reduce((sum, s) => sum + s.maturity_score, 0) / studies.length)
      : 0;
  return {
    activeStudies: active,
    completedAreas: completed,
    totalAreas: allAreas.length,
    identifiedRequirements: reqs,
    criticalRisks: critical,
    averageMaturity: maturity,
  };
}

// ---------- Master Data ----------

export async function listMdmDomains(): Promise<MdmDomain[]> {
  return mdmDomains;
}

export async function listMdmCatalogs(domainCode?: string): Promise<MdmCatalog[]> {
  if (domainCode) return mdmCatalogs.filter((c) => c.domain_code === domainCode);
  return mdmCatalogs;
}

export async function getMdmCatalog(code: string): Promise<MdmCatalog | null> {
  return mdmCatalogs.find((c) => c.code === code) ?? null;
}

export async function listMdmItems(catalogCode: string): Promise<MdmItem[]> {
  return listStoreItems(catalogCode);
}

export async function getMdmItem(id: string): Promise<MdmItem | null> {
  return getStoreItem(id);
}
