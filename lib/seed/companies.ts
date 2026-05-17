import type { Company } from "@/lib/types";

export const companies: Company[] = [
  {
    id: "c-001",
    code: "OTS-DEMO",
    name: "Oilfield Tools Services Demo",
    industry: "Oil & Gas — Tool Rental & Maintenance",
    country: "México",
    status: "active",
    created_at: "2026-01-12T09:00:00Z",
  },
  {
    id: "c-002",
    code: "PEMEX-EXP",
    name: "Operadora de Exploración Norte",
    industry: "Oil & Gas — Upstream",
    country: "México",
    status: "active",
    created_at: "2026-02-04T09:00:00Z",
  },
  {
    id: "c-003",
    code: "DRILL-MX",
    name: "Servicios de Perforación del Golfo",
    industry: "Oil & Gas — Drilling Services",
    country: "México",
    status: "active",
    created_at: "2026-03-22T09:00:00Z",
  },
];
