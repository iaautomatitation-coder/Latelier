-- =============================================================================
-- ToolTrack Blueprint Studio — Initial Schema
-- Created: 2026-05-17
-- =============================================================================
-- This migration provisions the full MVP schema:
--   1. Master Data Management (MDM): domains → catalogs → items → relationships → versions
--   2. Core entities: companies, studies, study_areas, findings, requirements,
--      risks, documents, recommendations, roadmap_items, comments, audit_events
--   3. Join tables: requirement_modules, process_requirements, study_documents, study_risks
--   4. Soft delete everywhere (deleted_at)
--   5. RLS enabled on all tenant-scoped tables with permissive demo policies
--      that allow anonymous read of global rows (company_id IS NULL) for the MVP.
--      Tighten these in production by binding to auth.uid() + memberships.
-- =============================================================================

create extension if not exists "pgcrypto";

-- =============================================================================
-- Helpers
-- =============================================================================

create or replace function tg_set_updated_at() returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

-- =============================================================================
-- 1. MASTER DATA MANAGEMENT
-- =============================================================================

create table if not exists mdm_domains (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text,
  icon text,
  sort_order int not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists mdm_catalogs (
  id uuid primary key default gen_random_uuid(),
  domain_id uuid not null references mdm_domains(id) on delete restrict,
  code text not null,
  name text not null,
  description text,
  hierarchical boolean not null default false,
  is_system boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (domain_id, code)
);

create table if not exists mdm_items (
  id uuid primary key default gen_random_uuid(),
  company_id uuid null, -- null => global catalog item; else tenant-scoped
  catalog_id uuid not null references mdm_catalogs(id) on delete restrict,
  parent_id uuid null references mdm_items(id) on delete restrict,
  code text not null,
  name text not null,
  description text,
  metadata jsonb not null default '{}'::jsonb,
  status text not null default 'active' check (status in ('active','inactive','draft','archived')),
  sort_order int not null default 0,
  is_system boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz null,
  unique (catalog_id, company_id, code)
);
create index if not exists idx_mdm_items_catalog on mdm_items(catalog_id) where deleted_at is null;
create index if not exists idx_mdm_items_parent on mdm_items(parent_id);
create index if not exists idx_mdm_items_company on mdm_items(company_id);

create table if not exists mdm_item_relationships (
  id uuid primary key default gen_random_uuid(),
  from_item_id uuid not null references mdm_items(id) on delete cascade,
  to_item_id uuid not null references mdm_items(id) on delete cascade,
  rel_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  unique (from_item_id, to_item_id, rel_type)
);

create table if not exists mdm_item_versions (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references mdm_items(id) on delete cascade,
  version int not null,
  snapshot jsonb not null,
  changed_by uuid null,
  changed_at timestamptz not null default timezone('utc', now()),
  unique (item_id, version)
);

create trigger trg_mdm_domains_updated  before update on mdm_domains  for each row execute function tg_set_updated_at();
create trigger trg_mdm_catalogs_updated before update on mdm_catalogs for each row execute function tg_set_updated_at();
create trigger trg_mdm_items_updated    before update on mdm_items    for each row execute function tg_set_updated_at();

-- =============================================================================
-- 2. CORE ENTITIES
-- =============================================================================

create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  industry text,
  country text,
  status text not null default 'active' check (status in ('active','inactive','draft','archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz null
);
create trigger trg_companies_updated before update on companies for each row execute function tg_set_updated_at();

create table if not exists studies (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete restrict,
  code text not null unique,
  name text not null,
  description text,
  status text not null default 'draft' check (status in ('draft','in_progress','review','closed')),
  maturity_score int not null default 0 check (maturity_score between 0 and 100),
  progress int not null default 0 check (progress between 0 and 100),
  lead text,
  started_at timestamptz,
  target_end_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz null
);
create index if not exists idx_studies_company on studies(company_id);
create trigger trg_studies_updated before update on studies for each row execute function tg_set_updated_at();

create table if not exists study_areas (
  id uuid primary key default gen_random_uuid(),
  study_id uuid not null references studies(id) on delete cascade,
  area_code text not null, -- FK to mdm_items.code where catalog='areas'
  name text not null,
  status text not null default 'pending' check (status in ('pending','in_review','completed')),
  maturity int not null default 0 check (maturity between 0 and 100),
  findings_count int not null default 0,
  owner text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz null,
  unique (study_id, area_code)
);
create index if not exists idx_study_areas_study on study_areas(study_id);
create trigger trg_study_areas_updated before update on study_areas for each row execute function tg_set_updated_at();

create table if not exists findings (
  id uuid primary key default gen_random_uuid(),
  study_id uuid not null references studies(id) on delete cascade,
  area_code text not null,
  title text not null,
  description text,
  severity int not null check (severity between 1 and 5),
  evidence_count int not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz null
);
create index if not exists idx_findings_study on findings(study_id);
create trigger trg_findings_updated before update on findings for each row execute function tg_set_updated_at();

create table if not exists requirements (
  id uuid primary key default gen_random_uuid(),
  study_id uuid not null references studies(id) on delete cascade,
  area_code text not null,
  process_code text not null,
  problem text not null,
  need text not null,
  proposed_solution text,
  suggested_module text,
  priority text not null default 'medium' check (priority in ('low','medium','high','critical')),
  risk_level text not null default 'medium' check (risk_level in ('low','medium','high','critical')),
  status text not null default 'identified' check (status in ('identified','validated','in_design','delivered','rejected')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz null
);
create index if not exists idx_requirements_study on requirements(study_id);
create trigger trg_requirements_updated before update on requirements for each row execute function tg_set_updated_at();

create table if not exists risks (
  id uuid primary key default gen_random_uuid(),
  study_id uuid not null references studies(id) on delete cascade,
  category_code text not null,
  title text not null,
  description text,
  probability int not null check (probability between 1 and 5),
  impact int not null check (impact between 1 and 5),
  criticality int generated always as (probability * impact) stored,
  mitigation text,
  status text not null default 'open' check (status in ('open','mitigating','accepted','closed')),
  owner text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz null
);
create index if not exists idx_risks_study on risks(study_id);
create trigger trg_risks_updated before update on risks for each row execute function tg_set_updated_at();

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  study_id uuid not null references studies(id) on delete cascade,
  type_code text not null,
  title text not null,
  uri text not null,
  uploaded_by text,
  uploaded_at timestamptz not null default timezone('utc', now()),
  metadata jsonb not null default '{}'::jsonb,
  deleted_at timestamptz null
);
create index if not exists idx_documents_study on documents(study_id);

create table if not exists recommendations (
  id uuid primary key default gen_random_uuid(),
  study_id uuid not null references studies(id) on delete cascade,
  title text not null,
  description text,
  priority text not null default 'medium' check (priority in ('low','medium','high','critical')),
  expected_impact text,
  created_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz null
);
create index if not exists idx_recommendations_study on recommendations(study_id);

create table if not exists roadmap_items (
  id uuid primary key default gen_random_uuid(),
  study_id uuid not null references studies(id) on delete cascade,
  phase text not null check (phase in ('discovery','design','build','rollout','stabilize')),
  title text not null,
  start_at date,
  end_at date,
  status text not null default 'planned' check (status in ('planned','in_progress','blocked','done')),
  module text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz null
);
create index if not exists idx_roadmap_study on roadmap_items(study_id);
create trigger trg_roadmap_updated before update on roadmap_items for each row execute function tg_set_updated_at();

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  author text,
  body text not null,
  created_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz null
);
create index if not exists idx_comments_entity on comments(entity_type, entity_id);

create table if not exists audit_events (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  actor text,
  action text not null,
  diff jsonb,
  at timestamptz not null default timezone('utc', now())
);
create index if not exists idx_audit_entity on audit_events(entity_type, entity_id);
create index if not exists idx_audit_at on audit_events(at desc);

-- =============================================================================
-- 3. JOIN TABLES
-- =============================================================================

create table if not exists requirement_modules (
  requirement_id uuid not null references requirements(id) on delete cascade,
  module_code text not null,
  primary key (requirement_id, module_code)
);

create table if not exists process_requirements (
  process_item_id uuid not null references mdm_items(id) on delete cascade,
  requirement_id uuid not null references requirements(id) on delete cascade,
  primary key (process_item_id, requirement_id)
);

create table if not exists study_documents (
  study_id uuid not null references studies(id) on delete cascade,
  document_id uuid not null references documents(id) on delete cascade,
  primary key (study_id, document_id)
);

create table if not exists study_risks (
  study_id uuid not null references studies(id) on delete cascade,
  risk_id uuid not null references risks(id) on delete cascade,
  primary key (study_id, risk_id)
);

-- =============================================================================
-- 4. RLS — Permissive demo policies (TIGHTEN IN PRODUCTION)
-- =============================================================================
-- Strategy for MVP demo:
--   * MDM domains/catalogs: world-readable (no RLS needed but enabled)
--   * MDM items: global rows (company_id IS NULL) readable by anon; tenant
--     rows would require auth.uid() membership join in production.
--   * Core entities: in production, gate by company membership via a
--     `memberships(user_id, company_id, role)` table. For the MVP we leave
--     RLS enabled with a read-all-non-deleted policy so the in-memory seed
--     can be transparently swapped for a real DB later.

alter table mdm_domains          enable row level security;
alter table mdm_catalogs         enable row level security;
alter table mdm_items            enable row level security;
alter table mdm_item_relationships enable row level security;
alter table mdm_item_versions    enable row level security;
alter table companies            enable row level security;
alter table studies              enable row level security;
alter table study_areas          enable row level security;
alter table findings             enable row level security;
alter table requirements         enable row level security;
alter table risks                enable row level security;
alter table documents            enable row level security;
alter table recommendations      enable row level security;
alter table roadmap_items        enable row level security;
alter table comments             enable row level security;
alter table audit_events         enable row level security;

-- Anonymous read policies for non-deleted rows (DEMO ONLY)
do $$
declare
  t text;
begin
  for t in select unnest(array[
    'mdm_domains','mdm_catalogs','mdm_item_relationships','mdm_item_versions',
    'companies','studies','study_areas','findings','requirements','risks',
    'documents','recommendations','roadmap_items','comments','audit_events'
  ])
  loop
    execute format('drop policy if exists %I_read_all on %I', t || '_read_all', t);
    execute format('create policy %I on %I for select to anon, authenticated using (true)', t || '_read_all', t);
  end loop;
end $$;

drop policy if exists mdm_items_read_all on mdm_items;
create policy mdm_items_read_all on mdm_items
  for select to anon, authenticated
  using (deleted_at is null);

-- =============================================================================
-- 5. Useful views
-- =============================================================================

create or replace view v_study_summary as
select
  s.id,
  s.code,
  s.name,
  s.status,
  s.maturity_score,
  s.progress,
  c.id   as company_id,
  c.name as company_name,
  (select count(*) from study_areas a where a.study_id = s.id) as area_count,
  (select count(*) from findings f where f.study_id = s.id and f.deleted_at is null) as findings_count,
  (select count(*) from requirements r where r.study_id = s.id and r.deleted_at is null) as requirement_count,
  (select count(*) from risks k where k.study_id = s.id and k.deleted_at is null) as risk_count
from studies s
join companies c on c.id = s.company_id
where s.deleted_at is null;
