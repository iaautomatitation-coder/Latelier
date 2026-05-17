// Data access layer. Falls back to in-memory seed when Supabase is not configured.
// All page components consume THIS layer, never the seed directly, so swapping
// to a real DB later only requires implementing the Supabase branches below.

import { companies as seedCompanies } from "@/lib/seed/companies";
import {
  studies as seedStudies,
  studyAreas as seedStudyAreas,
  findings as seedFindings,
  roadmapItems as seedRoadmap,
  documents as seedDocuments,
} from "@/lib/seed/studies";
import { requirements as seedRequirements } from "@/lib/seed/requirements";
import { risks as seedRisks } from "@/lib/seed/risks";
import { mdmDomains, mdmCatalogs, mdmItems } from "@/lib/seed/master-data";
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
  return seedFindings.filter((f) => f.study_id === studyId);
}

export async function getStudyRequirements(studyId: string): Promise<Requirement[]> {
  return seedRequirements.filter((r) => r.study_id === studyId);
}

export async function getStudyRisks(studyId: string): Promise<Risk[]> {
  return seedRisks.filter((r) => r.study_id === studyId);
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
  const reqs = seedRequirements.length;
  const critical = seedRisks.filter((r) => r.criticality >= 16).length;
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
  return mdmItems
    .filter((i) => i.catalog_code === catalogCode && i.deleted_at === null)
    .sort((a, b) => a.sort_order - b.sort_order);
}
