-- =============================================================================
-- ToolTrack Blueprint Studio — Demo Seed
-- =============================================================================
-- Run after the init migration to populate the demo dataset matching the
-- in-memory seed used by the Next.js app. Idempotent via ON CONFLICT.
-- =============================================================================

-- Domains
insert into mdm_domains (code, name, description, icon, sort_order) values
  ('ORGANIZATIONAL','Organizacional','Estructura corporativa y centros de costo','Building2',1),
  ('OPERATIONAL','Operacional','Procesos, estados y movimientos operacionales','Workflow',2),
  ('TOOLS','Herramientas','Catálogo técnico de herramientas downhole','Wrench',3),
  ('MAINTENANCE','Mantenimiento','Tipologías de mantenimiento, fallas y refacciones','Settings',4),
  ('QUALITY','Inspección y Calidad','NDT, certificaciones, normativas y criterios','ShieldCheck',5),
  ('INVENTORY','Inventario y Logística','Ubicaciones, almacenes, proveedores','Boxes',6),
  ('COMMERCIAL','Comercial','Clientes, contratos, tarifarios','Briefcase',7),
  ('COMPLIANCE','Compliance','Riesgos, hallazgos, CAPA, NCR','AlertOctagon',8),
  ('ANALYTICS','Analytics','KPIs, métricas, fórmulas, objetivos','LineChart',9)
on conflict (code) do nothing;

-- Catalogs (subset — extend as needed)
with d as (select id, code from mdm_domains)
insert into mdm_catalogs (domain_id, code, name, description, hierarchical, is_system) values
  ((select id from d where code='ORGANIZATIONAL'), 'areas',           'Áreas',                 'Áreas funcionales organizacionales',           true,  true),
  ((select id from d where code='ORGANIZATIONAL'), 'roles',           'Roles',                 'Roles funcionales',                            false, true),
  ((select id from d where code='OPERATIONAL'),    'processes',       'Procesos',              'Procesos operativos macro',                    true,  true),
  ((select id from d where code='OPERATIONAL'),    'op_states',       'Estados operacionales', 'Estados del activo en operación',              false, true),
  ((select id from d where code='OPERATIONAL'),    'priorities',      'Prioridades',           'Niveles de prioridad',                         false, true),
  ((select id from d where code='OPERATIONAL'),    'criticalities',   'Criticidades',          'Niveles de criticidad de activos',             false, true),
  ((select id from d where code='QUALITY'),        'ndt_methods',     'NDT',                   'MPI, LPI, UT, EMI, Drift, Pressure Test',      false, true),
  ((select id from d where code='QUALITY'),        'standards',       'Normativas API/ISO',    'Normas técnicas',                              false, true),
  ((select id from d where code='COMPLIANCE'),     'risk_categories', 'Categorías de riesgo',  'Categorías de riesgo',                         false, true),
  ((select id from d where code='COMPLIANCE'),     'severities',      'Severidades',           'Escala 1-5',                                   false, true),
  ((select id from d where code='COMPLIANCE'),     'probabilities',   'Probabilidades',        'Escala 1-5',                                   false, true),
  ((select id from d where code='ANALYTICS'),      'kpis',            'KPIs',                  'Indicadores',                                  false, true)
on conflict (domain_id, code) do nothing;

-- Companies
insert into companies (code, name, industry, country, status) values
  ('OTS-DEMO',  'Oilfield Tools Services Demo',     'Oil & Gas — Tool Rental & Maintenance', 'México', 'active'),
  ('PEMEX-EXP', 'Operadora de Exploración Norte',   'Oil & Gas — Upstream',                  'México', 'active'),
  ('DRILL-MX',  'Servicios de Perforación del Golfo','Oil & Gas — Drilling Services',         'México', 'active')
on conflict (code) do nothing;

-- Flagship demo study
insert into studies (company_id, code, name, description, status, maturity_score, progress, lead, started_at, target_end_at)
select c.id,
  'EST-OTS-001',
  'Diagnóstico de Trazabilidad Operacional y Mantenimiento de Herramientas O&G',
  'Levantamiento de arquitectura operacional, brechas de trazabilidad y matriz de requerimientos funcionales para renta, mantenimiento e inspección de herramientas downhole.',
  'in_progress', 42, 64, 'Ing. R. Cervantes',
  '2026-03-03', '2026-06-30'
from companies c
where c.code = 'OTS-DEMO'
on conflict (code) do nothing;

-- Areas, findings, requirements, risks, roadmap, documents would follow the
-- same pattern. The in-memory seed in lib/seed/* is the source of truth for
-- the MVP and can be exported to this file once the schema is locked.
