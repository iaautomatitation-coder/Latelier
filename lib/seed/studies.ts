import type { Study, StudyArea, Finding, RoadmapItem, DocumentRef } from "@/lib/types";

export const studies: Study[] = [
  {
    id: "s-001",
    company_id: "c-001",
    code: "EST-OTS-001",
    name: "Diagnóstico de Trazabilidad Operacional y Mantenimiento de Herramientas O&G",
    description:
      "Levantamiento de arquitectura operacional, brechas de trazabilidad y matriz de requerimientos funcionales para renta, mantenimiento e inspección de herramientas downhole.",
    status: "in_progress",
    maturity_score: 42,
    progress: 64,
    lead: "Ing. R. Cervantes",
    started_at: "2026-03-03T09:00:00Z",
    target_end_at: "2026-06-30T18:00:00Z",
    created_at: "2026-03-01T09:00:00Z",
  },
  {
    id: "s-002",
    company_id: "c-002",
    code: "EST-PMX-002",
    name: "Evaluación de Procesos de Inspección NDT en Centros de Servicio",
    description:
      "Auditoría de prácticas MPI/UT/EMI y conformidad con normativa API en patios de servicio.",
    status: "review",
    maturity_score: 58,
    progress: 88,
    lead: "Ing. L. Mendiola",
    started_at: "2026-02-10T09:00:00Z",
    target_end_at: "2026-05-20T18:00:00Z",
    created_at: "2026-02-08T09:00:00Z",
  },
  {
    id: "s-003",
    company_id: "c-003",
    code: "EST-DRL-003",
    name: "Levantamiento de Catálogo de Activos y Control de Inventario en Patio",
    description:
      "Definición de jerarquía de activos, criticidad y reglas de movimiento físico vs sistema.",
    status: "draft",
    maturity_score: 18,
    progress: 12,
    lead: "Ing. A. Treviño",
    started_at: "2026-05-02T09:00:00Z",
    target_end_at: "2026-08-15T18:00:00Z",
    created_at: "2026-04-28T09:00:00Z",
  },
];

export const studyAreas: StudyArea[] = [
  { id: "sa-1", study_id: "s-001", area_code: "DIR", name: "Dirección", status: "completed", maturity: 55, findings_count: 4, owner: "CEO" },
  { id: "sa-2", study_id: "s-001", area_code: "OPS", name: "Operaciones", status: "in_review", maturity: 48, findings_count: 9, owner: "Gerente OPS" },
  { id: "sa-3", study_id: "s-001", area_code: "TAL", name: "Taller / Mantenimiento", status: "in_review", maturity: 36, findings_count: 12, owner: "Jefe Taller" },
  { id: "sa-4", study_id: "s-001", area_code: "CAL", name: "Calidad", status: "completed", maturity: 60, findings_count: 7, owner: "QA Manager" },
  { id: "sa-5", study_id: "s-001", area_code: "ALM", name: "Almacén", status: "in_review", maturity: 30, findings_count: 11, owner: "Jefe Almacén" },
  { id: "sa-6", study_id: "s-001", area_code: "FIN", name: "Finanzas", status: "pending", maturity: 20, findings_count: 3, owner: "CFO" },
  { id: "sa-7", study_id: "s-001", area_code: "COM", name: "Compras", status: "pending", maturity: 25, findings_count: 5, owner: "Jefe Compras" },
  { id: "sa-8", study_id: "s-001", area_code: "SEG", name: "Seguridad", status: "in_review", maturity: 50, findings_count: 4, owner: "HSE Lead" },
  { id: "sa-9", study_id: "s-001", area_code: "AUD", name: "Auditoría", status: "pending", maturity: 22, findings_count: 6, owner: "Auditor Interno" },
];

export const findings: Finding[] = [
  {
    id: "f-001",
    study_id: "s-001",
    area_code: "TAL",
    title: "Sin registro digital de horas de operación por herramienta",
    description: "Las hojas viajeras se llenan a mano y no se concilian contra el ERP. No hay forma de calcular MTBF por activo.",
    severity: 4,
    evidence_count: 3,
    created_at: "2026-03-18T09:00:00Z",
  },
  {
    id: "f-002",
    study_id: "s-001",
    area_code: "ALM",
    title: "Movimientos físicos sin folio de transacción",
    description: "Salidas a pozo se documentan en libreta. No hay trazabilidad sistémica de quién mueve qué activo.",
    severity: 5,
    evidence_count: 4,
    created_at: "2026-03-21T09:00:00Z",
  },
  {
    id: "f-003",
    study_id: "s-001",
    area_code: "CAL",
    title: "Certificados vencen sin alerta",
    description: "API 7-1 y MPI vencidos detectados al momento de despacho; no hay sistema de pre-alerta.",
    severity: 5,
    evidence_count: 2,
    created_at: "2026-03-25T09:00:00Z",
  },
  {
    id: "f-004",
    study_id: "s-001",
    area_code: "FIN",
    title: "Costeo de servicio sin imputación de refacciones reales",
    description: "El margen por servicio se calcula con costos estándar; las refacciones se cargan a gasto general.",
    severity: 3,
    evidence_count: 1,
    created_at: "2026-04-02T09:00:00Z",
  },
  {
    id: "f-005",
    study_id: "s-001",
    area_code: "OPS",
    title: "No existe forecast de demanda por tipo de herramienta",
    description: "La planeación de inventario depende de criterio del jefe de patio sin datos históricos.",
    severity: 3,
    evidence_count: 1,
    created_at: "2026-04-05T09:00:00Z",
  },
];

export const roadmapItems: RoadmapItem[] = [
  { id: "r-1", study_id: "s-001", phase: "discovery", title: "Mapeo de procesos AS-IS", start_at: "2026-03-03", end_at: "2026-03-31", status: "done", module: "Procesos" },
  { id: "r-2", study_id: "s-001", phase: "design", title: "Matriz de requerimientos priorizada", start_at: "2026-04-01", end_at: "2026-04-30", status: "in_progress", module: "Requerimientos" },
  { id: "r-3", study_id: "s-001", phase: "design", title: "Modelo de datos y catálogos maestros", start_at: "2026-04-15", end_at: "2026-05-15", status: "in_progress", module: "Master Data" },
  { id: "r-4", study_id: "s-001", phase: "build", title: "Piloto: alta de herramienta y salida a pozo", start_at: "2026-05-15", end_at: "2026-06-15", status: "planned", module: "Operaciones" },
  { id: "r-5", study_id: "s-001", phase: "rollout", title: "Migración de inventario físico", start_at: "2026-06-15", end_at: "2026-07-15", status: "planned", module: "Almacén" },
];

export const documents: DocumentRef[] = [
  { id: "d-1", study_id: "s-001", type_code: "evidence", title: "Foto hoja viajera taller — 2026-03-18", uri: "/evidence/hoja-viajera-2026-03-18.jpg", uploaded_by: "R. Cervantes", uploaded_at: "2026-03-18T15:22:00Z" },
  { id: "d-2", study_id: "s-001", type_code: "policy", title: "Manual de Procedimientos de Patio v3.2", uri: "/docs/manual-patio-v3-2.pdf", uploaded_by: "Jefe Almacén", uploaded_at: "2026-03-12T11:00:00Z" },
  { id: "d-3", study_id: "s-001", type_code: "certificate", title: "Certificado API 7-1 — Drill Collar SN-2841", uri: "/certs/api7-1-2841.pdf", uploaded_by: "QA Manager", uploaded_at: "2026-02-01T11:00:00Z" },
];
