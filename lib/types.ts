// Domain types. These mirror the Supabase schema in supabase/migrations/00000000000000_init.sql
// but are decoupled so the app can run against the in-memory seed when no DB is configured.

export type UUID = string;
export type ISODate = string;

export type RecordStatus = "active" | "inactive" | "draft" | "archived";

export type Priority = "low" | "medium" | "high" | "critical";
export type Severity = 1 | 2 | 3 | 4 | 5;
export type Probability = 1 | 2 | 3 | 4 | 5;

export type StudyStatus = "draft" | "in_progress" | "review" | "closed";
export type RequirementStatus = "identified" | "validated" | "in_design" | "delivered" | "rejected";
export type RiskStatus = "open" | "mitigating" | "accepted" | "closed";

export interface Company {
  id: UUID;
  code: string;
  name: string;
  industry: string;
  country: string;
  status: RecordStatus;
  created_at: ISODate;
}

export interface Study {
  id: UUID;
  company_id: UUID;
  code: string;
  name: string;
  description: string;
  status: StudyStatus;
  maturity_score: number; // 0-100
  progress: number; // 0-100
  lead: string;
  started_at: ISODate;
  target_end_at: ISODate;
  created_at: ISODate;
}

export interface StudyArea {
  id: UUID;
  study_id: UUID;
  area_code: string; // FK to mdm_items in catalog "areas"
  name: string;
  status: "pending" | "in_review" | "completed";
  maturity: number; // 0-100
  findings_count: number;
  owner: string;
}

export interface Finding {
  id: UUID;
  study_id: UUID;
  area_code: string;
  title: string;
  description: string;
  severity: Severity;
  evidence_count: number;
  created_at: ISODate;
}

export interface Requirement {
  id: UUID;
  study_id: UUID;
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

export interface Risk {
  id: UUID;
  study_id: UUID;
  category_code: string;
  title: string;
  description: string;
  probability: Probability;
  impact: Severity;
  criticality: number; // probability * impact
  mitigation: string;
  status: RiskStatus;
  owner: string;
}

export interface DocumentRef {
  id: UUID;
  study_id: UUID;
  type_code: string;
  title: string;
  uri: string;
  uploaded_by: string;
  uploaded_at: ISODate;
}

export interface RoadmapItem {
  id: UUID;
  study_id: UUID;
  phase: "discovery" | "design" | "build" | "rollout" | "stabilize";
  title: string;
  start_at: ISODate;
  end_at: ISODate;
  status: "planned" | "in_progress" | "blocked" | "done";
  module: string;
}

// ---------- Master Data Management ----------

export interface MdmDomain {
  id: UUID;
  code: string;
  name: string;
  description: string;
  icon: string;
  catalog_count: number;
}

export interface MdmCatalog {
  id: UUID;
  domain_code: string;
  code: string;
  name: string;
  description: string;
  hierarchical: boolean;
  is_system: boolean;
  item_count: number;
}

export interface MdmItem {
  id: UUID;
  company_id: UUID | null;
  catalog_code: string;
  parent_id: UUID | null;
  code: string;
  name: string;
  description: string;
  metadata: Record<string, unknown>;
  status: RecordStatus;
  sort_order: number;
  is_system: boolean;
  created_at: ISODate;
  updated_at: ISODate;
  deleted_at: ISODate | null;
}
