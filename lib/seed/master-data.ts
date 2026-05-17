import type { MdmDomain, MdmCatalog, MdmItem } from "@/lib/types";

// ---------- Dominios MDM ----------
export const mdmDomains: MdmDomain[] = [
  { id: "dom-org", code: "ORGANIZATIONAL", name: "Organizacional", description: "Estructura corporativa y centros de costo", icon: "Building2", catalog_count: 5 },
  { id: "dom-ops", code: "OPERATIONAL", name: "Operacional", description: "Procesos, estados y movimientos operacionales", icon: "Workflow", catalog_count: 6 },
  { id: "dom-tools", code: "TOOLS", name: "Herramientas", description: "Catálogo técnico de herramientas downhole", icon: "Wrench", catalog_count: 7 },
  { id: "dom-mtto", code: "MAINTENANCE", name: "Mantenimiento", description: "Tipologías de mantenimiento, fallas y refacciones", icon: "Settings", catalog_count: 5 },
  { id: "dom-qa", code: "QUALITY", name: "Inspección y Calidad", description: "NDT, certificaciones, normativas y criterios", icon: "ShieldCheck", catalog_count: 5 },
  { id: "dom-inv", code: "INVENTORY", name: "Inventario y Logística", description: "Ubicaciones, almacenes, proveedores", icon: "Boxes", catalog_count: 5 },
  { id: "dom-com", code: "COMMERCIAL", name: "Comercial", description: "Clientes, contratos, tarifarios", icon: "Briefcase", catalog_count: 4 },
  { id: "dom-cmp", code: "COMPLIANCE", name: "Compliance", description: "Riesgos, hallazgos, CAPA, NCR", icon: "AlertOctagon", catalog_count: 6 },
  { id: "dom-ana", code: "ANALYTICS", name: "Analytics", description: "KPIs, métricas, fórmulas, objetivos", icon: "LineChart", catalog_count: 4 },
];

// ---------- Catálogos ----------
export const mdmCatalogs: MdmCatalog[] = [
  // Organizacional
  { id: "cat-001", domain_code: "ORGANIZATIONAL", code: "companies", name: "Empresas", description: "Compañías cliente y propias", hierarchical: false, is_system: true, item_count: 3 },
  { id: "cat-002", domain_code: "ORGANIZATIONAL", code: "areas", name: "Áreas", description: "Áreas funcionales organizacionales", hierarchical: true, is_system: true, item_count: 9 },
  { id: "cat-003", domain_code: "ORGANIZATIONAL", code: "departments", name: "Departamentos", description: "Subdivisiones de áreas", hierarchical: true, is_system: false, item_count: 0 },
  { id: "cat-004", domain_code: "ORGANIZATIONAL", code: "roles", name: "Roles", description: "Roles funcionales", hierarchical: false, is_system: true, item_count: 8 },
  { id: "cat-005", domain_code: "ORGANIZATIONAL", code: "cost_centers", name: "Centros de costo", description: "Imputación financiera", hierarchical: false, is_system: false, item_count: 0 },

  // Operacional
  { id: "cat-010", domain_code: "OPERATIONAL", code: "processes", name: "Procesos", description: "Procesos operativos macro", hierarchical: true, is_system: true, item_count: 11 },
  { id: "cat-011", domain_code: "OPERATIONAL", code: "subprocesses", name: "Subprocesos", description: "Subprocesos dentro de procesos", hierarchical: true, is_system: false, item_count: 0 },
  { id: "cat-012", domain_code: "OPERATIONAL", code: "op_states", name: "Estados operacionales", description: "Estados del activo en operación", hierarchical: false, is_system: true, item_count: 6 },
  { id: "cat-013", domain_code: "OPERATIONAL", code: "movement_types", name: "Tipos de movimiento", description: "Movimientos físicos/lógicos", hierarchical: false, is_system: true, item_count: 5 },
  { id: "cat-014", domain_code: "OPERATIONAL", code: "priorities", name: "Prioridades", description: "Niveles de prioridad", hierarchical: false, is_system: true, item_count: 4 },
  { id: "cat-015", domain_code: "OPERATIONAL", code: "criticalities", name: "Criticidades", description: "Niveles de criticidad de activos", hierarchical: false, is_system: true, item_count: 4 },

  // Herramientas
  { id: "cat-020", domain_code: "TOOLS", code: "tool_families", name: "Familias de herramientas", description: "Familias técnicas", hierarchical: true, is_system: true, item_count: 6 },
  { id: "cat-021", domain_code: "TOOLS", code: "tool_subfamilies", name: "Subfamilias", description: "Subfamilias técnicas", hierarchical: true, is_system: false, item_count: 0 },
  { id: "cat-022", domain_code: "TOOLS", code: "tool_types", name: "Tipos de herramienta", description: "Tipologías", hierarchical: false, is_system: false, item_count: 0 },
  { id: "cat-023", domain_code: "TOOLS", code: "components", name: "Componentes", description: "Componentes intercambiables", hierarchical: false, is_system: false, item_count: 0 },
  { id: "cat-024", domain_code: "TOOLS", code: "connections", name: "Conexiones", description: "Tipos de conexión (NC, REG, IF, FH)", hierarchical: false, is_system: true, item_count: 5 },
  { id: "cat-025", domain_code: "TOOLS", code: "materials", name: "Materiales", description: "Grados de acero, aleaciones", hierarchical: false, is_system: false, item_count: 0 },
  { id: "cat-026", domain_code: "TOOLS", code: "tech_specs", name: "Especificaciones técnicas", description: "OD, ID, longitud, presión, etc.", hierarchical: false, is_system: false, item_count: 0 },

  // Mantenimiento
  { id: "cat-030", domain_code: "MAINTENANCE", code: "maintenance_types", name: "Tipos de mantenimiento", description: "Preventivo, correctivo, predictivo", hierarchical: false, is_system: true, item_count: 4 },
  { id: "cat-031", domain_code: "MAINTENANCE", code: "failure_modes", name: "Modos de falla", description: "FMEA", hierarchical: false, is_system: true, item_count: 5 },
  { id: "cat-032", domain_code: "MAINTENANCE", code: "root_causes", name: "Causas raíz", description: "Causas raíz documentadas", hierarchical: false, is_system: false, item_count: 0 },
  { id: "cat-033", domain_code: "MAINTENANCE", code: "spare_parts", name: "Refacciones", description: "Refacciones catalogadas", hierarchical: false, is_system: false, item_count: 0 },
  { id: "cat-034", domain_code: "MAINTENANCE", code: "consumables", name: "Consumibles", description: "Aceites, sellos, juntas", hierarchical: false, is_system: false, item_count: 0 },

  // Calidad
  { id: "cat-040", domain_code: "QUALITY", code: "inspection_types", name: "Tipos de inspección", description: "Categorías de inspección", hierarchical: false, is_system: true, item_count: 4 },
  { id: "cat-041", domain_code: "QUALITY", code: "ndt_methods", name: "NDT", description: "MPI, LPI, UT, EMI, Drift, Pressure Test", hierarchical: false, is_system: true, item_count: 6 },
  { id: "cat-042", domain_code: "QUALITY", code: "certifications", name: "Certificaciones", description: "Certificaciones aplicables", hierarchical: false, is_system: false, item_count: 0 },
  { id: "cat-043", domain_code: "QUALITY", code: "standards", name: "Normativas API/ISO", description: "Normas técnicas", hierarchical: false, is_system: true, item_count: 5 },
  { id: "cat-044", domain_code: "QUALITY", code: "acceptance_criteria", name: "Criterios de aceptación", description: "Criterios A/R", hierarchical: false, is_system: false, item_count: 0 },

  // Inventario
  { id: "cat-050", domain_code: "INVENTORY", code: "locations", name: "Ubicaciones", description: "Ubicaciones físicas", hierarchical: true, is_system: false, item_count: 0 },
  { id: "cat-051", domain_code: "INVENTORY", code: "warehouses", name: "Almacenes", description: "Almacenes", hierarchical: false, is_system: false, item_count: 0 },
  { id: "cat-052", domain_code: "INVENTORY", code: "yards", name: "Patios", description: "Patios de servicio", hierarchical: false, is_system: false, item_count: 0 },
  { id: "cat-053", domain_code: "INVENTORY", code: "suppliers", name: "Proveedores", description: "Proveedores homologados", hierarchical: false, is_system: false, item_count: 0 },
  { id: "cat-054", domain_code: "INVENTORY", code: "carriers", name: "Transportistas", description: "Empresas de transporte", hierarchical: false, is_system: false, item_count: 0 },

  // Comercial
  { id: "cat-060", domain_code: "COMMERCIAL", code: "customers", name: "Clientes", description: "Clientes comerciales", hierarchical: false, is_system: false, item_count: 0 },
  { id: "cat-061", domain_code: "COMMERCIAL", code: "contracts", name: "Contratos", description: "Contratos vigentes", hierarchical: false, is_system: false, item_count: 0 },
  { id: "cat-062", domain_code: "COMMERCIAL", code: "services", name: "Servicios", description: "Catálogo de servicios", hierarchical: false, is_system: false, item_count: 0 },
  { id: "cat-063", domain_code: "COMMERCIAL", code: "rate_cards", name: "Tarifarios", description: "Tarifas por servicio", hierarchical: false, is_system: false, item_count: 0 },

  // Compliance
  { id: "cat-070", domain_code: "COMPLIANCE", code: "risk_categories", name: "Categorías de riesgo", description: "Categorías de riesgo", hierarchical: false, is_system: true, item_count: 4 },
  { id: "cat-071", domain_code: "COMPLIANCE", code: "severities", name: "Severidades", description: "Escala 1-5", hierarchical: false, is_system: true, item_count: 5 },
  { id: "cat-072", domain_code: "COMPLIANCE", code: "probabilities", name: "Probabilidades", description: "Escala 1-5", hierarchical: false, is_system: true, item_count: 5 },
  { id: "cat-073", domain_code: "COMPLIANCE", code: "findings", name: "Hallazgos", description: "Hallazgos tipificados", hierarchical: false, is_system: false, item_count: 0 },
  { id: "cat-074", domain_code: "COMPLIANCE", code: "capa", name: "CAPA", description: "Acciones correctivas/preventivas", hierarchical: false, is_system: false, item_count: 0 },
  { id: "cat-075", domain_code: "COMPLIANCE", code: "ncr", name: "NCR", description: "No conformidades", hierarchical: false, is_system: false, item_count: 0 },

  // Analytics
  { id: "cat-080", domain_code: "ANALYTICS", code: "kpis", name: "KPIs", description: "Indicadores", hierarchical: false, is_system: true, item_count: 4 },
  { id: "cat-081", domain_code: "ANALYTICS", code: "metrics", name: "Métricas", description: "Métricas operativas", hierarchical: false, is_system: false, item_count: 0 },
  { id: "cat-082", domain_code: "ANALYTICS", code: "formulas", name: "Fórmulas", description: "Fórmulas de cálculo", hierarchical: false, is_system: false, item_count: 0 },
  { id: "cat-083", domain_code: "ANALYTICS", code: "objectives", name: "Objetivos", description: "Objetivos por KPI", hierarchical: false, is_system: false, item_count: 0 },
];

// ---------- Items ----------
const now = "2026-04-01T09:00:00Z";
const itemBase = (over: Partial<MdmItem>): MdmItem => ({
  id: over.id ?? "x",
  company_id: null,
  catalog_code: over.catalog_code!,
  parent_id: null,
  code: over.code!,
  name: over.name!,
  description: over.description ?? "",
  metadata: over.metadata ?? {},
  status: "active",
  sort_order: over.sort_order ?? 0,
  is_system: over.is_system ?? false,
  created_at: now,
  updated_at: now,
  deleted_at: null,
  ...over,
});

export const mdmItems: MdmItem[] = [
  // areas
  itemBase({ id: "i-area-1", catalog_code: "areas", code: "DIR", name: "Dirección", sort_order: 1, is_system: true }),
  itemBase({ id: "i-area-2", catalog_code: "areas", code: "OPS", name: "Operaciones", sort_order: 2, is_system: true }),
  itemBase({ id: "i-area-3", catalog_code: "areas", code: "TAL", name: "Taller / Mantenimiento", sort_order: 3, is_system: true }),
  itemBase({ id: "i-area-4", catalog_code: "areas", code: "CAL", name: "Calidad", sort_order: 4, is_system: true }),
  itemBase({ id: "i-area-5", catalog_code: "areas", code: "ALM", name: "Almacén", sort_order: 5, is_system: true }),
  itemBase({ id: "i-area-6", catalog_code: "areas", code: "FIN", name: "Finanzas", sort_order: 6, is_system: true }),
  itemBase({ id: "i-area-7", catalog_code: "areas", code: "COM", name: "Compras", sort_order: 7, is_system: true }),
  itemBase({ id: "i-area-8", catalog_code: "areas", code: "SEG", name: "Seguridad", sort_order: 8, is_system: true }),
  itemBase({ id: "i-area-9", catalog_code: "areas", code: "AUD", name: "Auditoría", sort_order: 9, is_system: true }),

  // roles
  itemBase({ id: "i-rol-1", catalog_code: "roles", code: "CEO", name: "Dirección General", sort_order: 1, is_system: true }),
  itemBase({ id: "i-rol-2", catalog_code: "roles", code: "OPS_MGR", name: "Gerente de Operaciones", sort_order: 2, is_system: true }),
  itemBase({ id: "i-rol-3", catalog_code: "roles", code: "TAL_LEAD", name: "Jefe de Taller", sort_order: 3, is_system: true }),
  itemBase({ id: "i-rol-4", catalog_code: "roles", code: "QA_MGR", name: "Gerente de Calidad", sort_order: 4, is_system: true }),
  itemBase({ id: "i-rol-5", catalog_code: "roles", code: "ALM_LEAD", name: "Jefe de Almacén", sort_order: 5, is_system: true }),
  itemBase({ id: "i-rol-6", catalog_code: "roles", code: "CFO", name: "Dirección Financiera", sort_order: 6, is_system: true }),
  itemBase({ id: "i-rol-7", catalog_code: "roles", code: "COM_LEAD", name: "Jefe de Compras", sort_order: 7, is_system: true }),
  itemBase({ id: "i-rol-8", catalog_code: "roles", code: "HSE", name: "Líder HSE", sort_order: 8, is_system: true }),

  // processes
  itemBase({ id: "i-pro-1", catalog_code: "processes", code: "ALTA_HER", name: "Alta de herramienta", description: "Registro inicial de activo en el sistema", sort_order: 1, is_system: true }),
  itemBase({ id: "i-pro-2", catalog_code: "processes", code: "SAL_POZO", name: "Salida a pozo", description: "Despacho de herramienta a operación", sort_order: 2, is_system: true }),
  itemBase({ id: "i-pro-3", catalog_code: "processes", code: "RET_POZO", name: "Retorno de pozo", description: "Recepción y diagnóstico inicial al retorno", sort_order: 3, is_system: true }),
  itemBase({ id: "i-pro-4", catalog_code: "processes", code: "MTTO_PREV", name: "Mantenimiento preventivo", description: "Planificado por horómetro o calendario", sort_order: 4, is_system: true }),
  itemBase({ id: "i-pro-5", catalog_code: "processes", code: "MTTO_COR", name: "Mantenimiento correctivo", description: "Por falla detectada", sort_order: 5, is_system: true }),
  itemBase({ id: "i-pro-6", catalog_code: "processes", code: "INSP_NDT", name: "Inspección NDT", description: "MPI/LPI/UT/EMI según familia", sort_order: 6, is_system: true }),
  itemBase({ id: "i-pro-7", catalog_code: "processes", code: "CALIB", name: "Calibración", description: "Calibración de instrumentos", sort_order: 7, is_system: true }),
  itemBase({ id: "i-pro-8", catalog_code: "processes", code: "CERT", name: "Certificación", description: "Emisión de certificados API/ISO", sort_order: 8, is_system: true }),
  itemBase({ id: "i-pro-9", catalog_code: "processes", code: "MOV_ALM", name: "Movimiento almacén", description: "Movimiento físico/lógico entre ubicaciones", sort_order: 9, is_system: true }),
  itemBase({ id: "i-pro-10", catalog_code: "processes", code: "BAJA", name: "Baja definitiva", description: "Retiro de activo del inventario activo", sort_order: 10, is_system: true }),
  itemBase({ id: "i-pro-11", catalog_code: "processes", code: "LOST", name: "Pérdida en pozo", description: "Activo perdido en operación (fish)", sort_order: 11, is_system: true }),

  // op_states
  itemBase({ id: "i-os-1", catalog_code: "op_states", code: "AVAILABLE", name: "Disponible", sort_order: 1, is_system: true }),
  itemBase({ id: "i-os-2", catalog_code: "op_states", code: "IN_USE", name: "En pozo", sort_order: 2, is_system: true }),
  itemBase({ id: "i-os-3", catalog_code: "op_states", code: "IN_MAINT", name: "En mantenimiento", sort_order: 3, is_system: true }),
  itemBase({ id: "i-os-4", catalog_code: "op_states", code: "QUARANTINE", name: "Cuarentena", sort_order: 4, is_system: true }),
  itemBase({ id: "i-os-5", catalog_code: "op_states", code: "RETIRED", name: "Baja", sort_order: 5, is_system: true }),
  itemBase({ id: "i-os-6", catalog_code: "op_states", code: "LOST", name: "Perdido en pozo", sort_order: 6, is_system: true }),

  // movement_types
  itemBase({ id: "i-mv-1", catalog_code: "movement_types", code: "INTAKE", name: "Entrada", sort_order: 1, is_system: true }),
  itemBase({ id: "i-mv-2", catalog_code: "movement_types", code: "DISPATCH", name: "Salida a pozo", sort_order: 2, is_system: true }),
  itemBase({ id: "i-mv-3", catalog_code: "movement_types", code: "RETURN", name: "Retorno", sort_order: 3, is_system: true }),
  itemBase({ id: "i-mv-4", catalog_code: "movement_types", code: "TRANSFER", name: "Transferencia interna", sort_order: 4, is_system: true }),
  itemBase({ id: "i-mv-5", catalog_code: "movement_types", code: "ADJUST", name: "Ajuste de inventario", sort_order: 5, is_system: true }),

  // priorities
  itemBase({ id: "i-pri-1", catalog_code: "priorities", code: "low", name: "Baja", sort_order: 1, is_system: true }),
  itemBase({ id: "i-pri-2", catalog_code: "priorities", code: "medium", name: "Media", sort_order: 2, is_system: true }),
  itemBase({ id: "i-pri-3", catalog_code: "priorities", code: "high", name: "Alta", sort_order: 3, is_system: true }),
  itemBase({ id: "i-pri-4", catalog_code: "priorities", code: "critical", name: "Crítica", sort_order: 4, is_system: true }),

  // criticalities
  itemBase({ id: "i-cri-1", catalog_code: "criticalities", code: "A", name: "Clase A", description: "Activo crítico", sort_order: 1, is_system: true }),
  itemBase({ id: "i-cri-2", catalog_code: "criticalities", code: "B", name: "Clase B", description: "Activo importante", sort_order: 2, is_system: true }),
  itemBase({ id: "i-cri-3", catalog_code: "criticalities", code: "C", name: "Clase C", description: "Activo estándar", sort_order: 3, is_system: true }),
  itemBase({ id: "i-cri-4", catalog_code: "criticalities", code: "D", name: "Clase D", description: "Activo de baja rotación", sort_order: 4, is_system: true }),

  // tool_families
  itemBase({ id: "i-tf-1", catalog_code: "tool_families", code: "DRILL_COLLAR", name: "Drill Collars", sort_order: 1, is_system: true }),
  itemBase({ id: "i-tf-2", catalog_code: "tool_families", code: "HWDP", name: "Heavy Weight Drill Pipe", sort_order: 2, is_system: true }),
  itemBase({ id: "i-tf-3", catalog_code: "tool_families", code: "STAB", name: "Estabilizadores", sort_order: 3, is_system: true }),
  itemBase({ id: "i-tf-4", catalog_code: "tool_families", code: "BHA_TOOLS", name: "BHA Tools (Subs, Bumper, Jar)", sort_order: 4, is_system: true }),
  itemBase({ id: "i-tf-5", catalog_code: "tool_families", code: "FISHING", name: "Herramientas de Pesca", sort_order: 5, is_system: true }),
  itemBase({ id: "i-tf-6", catalog_code: "tool_families", code: "CASING", name: "Casing Tools", sort_order: 6, is_system: true }),

  // connections
  itemBase({ id: "i-cn-1", catalog_code: "connections", code: "NC50", name: "NC50", sort_order: 1, is_system: true }),
  itemBase({ id: "i-cn-2", catalog_code: "connections", code: "NC38", name: "NC38", sort_order: 2, is_system: true }),
  itemBase({ id: "i-cn-3", catalog_code: "connections", code: "REG", name: "Regular (REG)", sort_order: 3, is_system: true }),
  itemBase({ id: "i-cn-4", catalog_code: "connections", code: "IF", name: "Internal Flush (IF)", sort_order: 4, is_system: true }),
  itemBase({ id: "i-cn-5", catalog_code: "connections", code: "FH", name: "Full Hole (FH)", sort_order: 5, is_system: true }),

  // maintenance_types
  itemBase({ id: "i-mt-1", catalog_code: "maintenance_types", code: "PREV", name: "Preventivo", sort_order: 1, is_system: true }),
  itemBase({ id: "i-mt-2", catalog_code: "maintenance_types", code: "CORR", name: "Correctivo", sort_order: 2, is_system: true }),
  itemBase({ id: "i-mt-3", catalog_code: "maintenance_types", code: "PRED", name: "Predictivo", sort_order: 3, is_system: true }),
  itemBase({ id: "i-mt-4", catalog_code: "maintenance_types", code: "OVERH", name: "Overhaul", sort_order: 4, is_system: true }),

  // failure_modes
  itemBase({ id: "i-fm-1", catalog_code: "failure_modes", code: "FATIG", name: "Fatiga de material", sort_order: 1, is_system: true }),
  itemBase({ id: "i-fm-2", catalog_code: "failure_modes", code: "WEAR", name: "Desgaste", sort_order: 2, is_system: true }),
  itemBase({ id: "i-fm-3", catalog_code: "failure_modes", code: "CORROSION", name: "Corrosión", sort_order: 3, is_system: true }),
  itemBase({ id: "i-fm-4", catalog_code: "failure_modes", code: "TWIST", name: "Twist-off", sort_order: 4, is_system: true }),
  itemBase({ id: "i-fm-5", catalog_code: "failure_modes", code: "CONN_DMG", name: "Daño en conexión", sort_order: 5, is_system: true }),

  // inspection_types
  itemBase({ id: "i-it-1", catalog_code: "inspection_types", code: "VISUAL", name: "Inspección visual", sort_order: 1, is_system: true }),
  itemBase({ id: "i-it-2", catalog_code: "inspection_types", code: "DIMENSIONAL", name: "Dimensional", sort_order: 2, is_system: true }),
  itemBase({ id: "i-it-3", catalog_code: "inspection_types", code: "NDT", name: "NDT", sort_order: 3, is_system: true }),
  itemBase({ id: "i-it-4", catalog_code: "inspection_types", code: "FUNC", name: "Funcional", sort_order: 4, is_system: true }),

  // ndt_methods
  itemBase({ id: "i-nd-1", catalog_code: "ndt_methods", code: "MPI", name: "MPI — Magnetic Particle", description: "Inspección por partículas magnéticas", sort_order: 1, is_system: true }),
  itemBase({ id: "i-nd-2", catalog_code: "ndt_methods", code: "LPI", name: "LPI — Líquidos Penetrantes", sort_order: 2, is_system: true }),
  itemBase({ id: "i-nd-3", catalog_code: "ndt_methods", code: "UT", name: "UT — Ultrasonido", sort_order: 3, is_system: true }),
  itemBase({ id: "i-nd-4", catalog_code: "ndt_methods", code: "EMI", name: "EMI — Electromagnético", sort_order: 4, is_system: true }),
  itemBase({ id: "i-nd-5", catalog_code: "ndt_methods", code: "DRIFT", name: "Drift Test", sort_order: 5, is_system: true }),
  itemBase({ id: "i-nd-6", catalog_code: "ndt_methods", code: "PT", name: "Pressure Test", sort_order: 6, is_system: true }),

  // standards
  itemBase({ id: "i-st-1", catalog_code: "standards", code: "API_7-1", name: "API Spec 7-1", description: "Drill Stem Elements", sort_order: 1, is_system: true }),
  itemBase({ id: "i-st-2", catalog_code: "standards", code: "API_7G", name: "API RP 7G", description: "Drill Stem Design", sort_order: 2, is_system: true }),
  itemBase({ id: "i-st-3", catalog_code: "standards", code: "API_8C", name: "API Spec 8C", description: "Hoisting Equipment", sort_order: 3, is_system: true }),
  itemBase({ id: "i-st-4", catalog_code: "standards", code: "ISO_9001", name: "ISO 9001", sort_order: 4, is_system: true }),
  itemBase({ id: "i-st-5", catalog_code: "standards", code: "ISO_45001", name: "ISO 45001", sort_order: 5, is_system: true }),

  // risk_categories
  itemBase({ id: "i-rc-1", catalog_code: "risk_categories", code: "OPERATIONAL", name: "Operacional", sort_order: 1, is_system: true }),
  itemBase({ id: "i-rc-2", catalog_code: "risk_categories", code: "FINANCIAL", name: "Financiero", sort_order: 2, is_system: true }),
  itemBase({ id: "i-rc-3", catalog_code: "risk_categories", code: "COMPLIANCE", name: "Compliance", sort_order: 3, is_system: true }),
  itemBase({ id: "i-rc-4", catalog_code: "risk_categories", code: "HSE", name: "HSE", sort_order: 4, is_system: true }),

  // severities
  itemBase({ id: "i-sv-1", catalog_code: "severities", code: "1", name: "1 — Insignificante", sort_order: 1, is_system: true }),
  itemBase({ id: "i-sv-2", catalog_code: "severities", code: "2", name: "2 — Menor", sort_order: 2, is_system: true }),
  itemBase({ id: "i-sv-3", catalog_code: "severities", code: "3", name: "3 — Moderado", sort_order: 3, is_system: true }),
  itemBase({ id: "i-sv-4", catalog_code: "severities", code: "4", name: "4 — Mayor", sort_order: 4, is_system: true }),
  itemBase({ id: "i-sv-5", catalog_code: "severities", code: "5", name: "5 — Catastrófico", sort_order: 5, is_system: true }),

  // probabilities
  itemBase({ id: "i-pb-1", catalog_code: "probabilities", code: "1", name: "1 — Rara", sort_order: 1, is_system: true }),
  itemBase({ id: "i-pb-2", catalog_code: "probabilities", code: "2", name: "2 — Improbable", sort_order: 2, is_system: true }),
  itemBase({ id: "i-pb-3", catalog_code: "probabilities", code: "3", name: "3 — Posible", sort_order: 3, is_system: true }),
  itemBase({ id: "i-pb-4", catalog_code: "probabilities", code: "4", name: "4 — Probable", sort_order: 4, is_system: true }),
  itemBase({ id: "i-pb-5", catalog_code: "probabilities", code: "5", name: "5 — Casi cierta", sort_order: 5, is_system: true }),

  // kpis
  itemBase({ id: "i-kp-1", catalog_code: "kpis", code: "MTBF", name: "Mean Time Between Failures", description: "Horas promedio entre fallas por familia", sort_order: 1, is_system: true }),
  itemBase({ id: "i-kp-2", catalog_code: "kpis", code: "MTTR", name: "Mean Time To Repair", description: "Horas promedio de reparación", sort_order: 2, is_system: true }),
  itemBase({ id: "i-kp-3", catalog_code: "kpis", code: "UTIL", name: "Utilización de flota", description: "Horas en pozo / horas disponibles", sort_order: 3, is_system: true }),
  itemBase({ id: "i-kp-4", catalog_code: "kpis", code: "CERT_OK", name: "% Certificados Vigentes", description: "Activos con certificación al día", sort_order: 4, is_system: true }),
];
