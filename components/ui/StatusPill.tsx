import { Badge } from "@/components/ui/Badge";
import type {
  Priority,
  RecordStatus,
  RequirementStatus,
  RiskStatus,
  StudyStatus,
} from "@/lib/types";

const studyMap: Record<StudyStatus, { label: string; tone: "neutral" | "ok" | "warn" | "accent" | "info" }> = {
  draft: { label: "Borrador", tone: "neutral" },
  in_progress: { label: "En curso", tone: "accent" },
  review: { label: "Revisión", tone: "warn" },
  closed: { label: "Cerrado", tone: "ok" },
};

const reqMap: Record<RequirementStatus, { label: string; tone: "neutral" | "ok" | "warn" | "accent" | "info" | "crit" }> = {
  identified: { label: "Identificado", tone: "neutral" },
  validated: { label: "Validado", tone: "info" },
  in_design: { label: "En diseño", tone: "accent" },
  delivered: { label: "Entregado", tone: "ok" },
  rejected: { label: "Rechazado", tone: "crit" },
};

const riskMap: Record<RiskStatus, { label: string; tone: "neutral" | "ok" | "warn" | "accent" | "crit" }> = {
  open: { label: "Abierto", tone: "crit" },
  mitigating: { label: "Mitigando", tone: "warn" },
  accepted: { label: "Aceptado", tone: "neutral" },
  closed: { label: "Cerrado", tone: "ok" },
};

const priorityMap: Record<Priority, { label: string; tone: "neutral" | "info" | "warn" | "crit" }> = {
  low: { label: "Baja", tone: "neutral" },
  medium: { label: "Media", tone: "info" },
  high: { label: "Alta", tone: "warn" },
  critical: { label: "Crítica", tone: "crit" },
};

const recordMap: Record<RecordStatus, { label: string; tone: "neutral" | "ok" | "warn" | "accent" }> = {
  active: { label: "Activo", tone: "ok" },
  inactive: { label: "Inactivo", tone: "neutral" },
  draft: { label: "Borrador", tone: "warn" },
  archived: { label: "Archivado", tone: "neutral" },
};

export function StudyStatusBadge({ status }: { status: StudyStatus }) {
  const m = studyMap[status];
  return <Badge tone={m.tone}>{m.label}</Badge>;
}

export function RequirementStatusBadge({ status }: { status: RequirementStatus }) {
  const m = reqMap[status];
  return <Badge tone={m.tone}>{m.label}</Badge>;
}

export function RiskStatusBadge({ status }: { status: RiskStatus }) {
  const m = riskMap[status];
  return <Badge tone={m.tone}>{m.label}</Badge>;
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const m = priorityMap[priority];
  return <Badge tone={m.tone}>{m.label}</Badge>;
}

export function RecordStatusBadge({ status }: { status: RecordStatus }) {
  const m = recordMap[status];
  return <Badge tone={m.tone}>{m.label}</Badge>;
}

export function CriticalityBadge({ value }: { value: number }) {
  const tone = value >= 16 ? "crit" : value >= 9 ? "warn" : value >= 5 ? "info" : "neutral";
  return <Badge tone={tone}>{value}</Badge>;
}
