"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Field, TextInput, TextArea, Select } from "@/components/ui/Field";
import { CriticalityBadge } from "@/components/ui/StatusPill";
import type { MdmItem, Risk } from "@/lib/types";
import {
  createRiskAction,
  updateRiskAction,
  type RiskActionState,
} from "@/app/(app)/studies/[id]/risks/actions";

const initialState: RiskActionState = { ok: null };

export function RiskForm({
  studyId,
  risk,
  categories,
  onSuccess,
}: {
  studyId: string;
  risk: Risk | null;
  categories: MdmItem[];
  onSuccess: () => void;
}) {
  const action = risk
    ? updateRiskAction.bind(null, studyId, risk.id)
    : createRiskAction.bind(null, studyId);
  const [state, formAction] = useFormState(action, initialState);
  const [probability, setProbability] = useState<number>(risk?.probability ?? 3);
  const [impact, setImpact] = useState<number>(risk?.impact ?? 3);

  if (state.ok) queueMicrotask(onSuccess);

  const criticality = probability * impact;

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Categoría" htmlFor="category_code" required error={state.fieldErrors?.category_code}>
          <Select
            id="category_code"
            name="category_code"
            defaultValue={risk?.category_code ?? ""}
            invalid={Boolean(state.fieldErrors?.category_code)}
            required
          >
            <option value="">— selecciona —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.code}>
                {c.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Estado" htmlFor="status">
          <Select id="status" name="status" defaultValue={risk?.status ?? "open"}>
            <option value="open">Abierto</option>
            <option value="mitigating">Mitigando</option>
            <option value="accepted">Aceptado</option>
            <option value="closed">Cerrado</option>
          </Select>
        </Field>
      </div>

      <Field label="Título" htmlFor="title" required error={state.fieldErrors?.title}>
        <TextInput
          id="title"
          name="title"
          defaultValue={risk?.title ?? ""}
          placeholder="Resumen breve del riesgo"
          invalid={Boolean(state.fieldErrors?.title)}
          maxLength={200}
          required
        />
      </Field>

      <Field label="Descripción" htmlFor="description" error={state.fieldErrors?.description}>
        <TextArea
          id="description"
          name="description"
          defaultValue={risk?.description ?? ""}
          placeholder="Contexto, causa raíz, consecuencias"
          invalid={Boolean(state.fieldErrors?.description)}
          maxLength={1000}
        />
      </Field>

      <div className="grid grid-cols-3 items-end gap-3">
        <Field label="Probabilidad (1-5)" htmlFor="probability" required error={state.fieldErrors?.probability}>
          <Select
            id="probability"
            name="probability"
            value={String(probability)}
            onChange={(e) => setProbability(Number(e.target.value))}
            invalid={Boolean(state.fieldErrors?.probability)}
            required
          >
            <option value="1">1 — Rara</option>
            <option value="2">2 — Improbable</option>
            <option value="3">3 — Posible</option>
            <option value="4">4 — Probable</option>
            <option value="5">5 — Casi cierta</option>
          </Select>
        </Field>
        <Field label="Impacto (1-5)" htmlFor="impact" required error={state.fieldErrors?.impact}>
          <Select
            id="impact"
            name="impact"
            value={String(impact)}
            onChange={(e) => setImpact(Number(e.target.value))}
            invalid={Boolean(state.fieldErrors?.impact)}
            required
          >
            <option value="1">1 — Insignificante</option>
            <option value="2">2 — Menor</option>
            <option value="3">3 — Moderado</option>
            <option value="4">4 — Mayor</option>
            <option value="5">5 — Catastrófico</option>
          </Select>
        </Field>
        <div className="flex flex-col items-center justify-end gap-1">
          <span className="text-2xs uppercase tracking-wider text-ink-mid">Criticidad</span>
          <CriticalityBadge value={criticality} />
        </div>
      </div>

      <Field label="Mitigación" htmlFor="mitigation" error={state.fieldErrors?.mitigation}>
        <TextArea
          id="mitigation"
          name="mitigation"
          defaultValue={risk?.mitigation ?? ""}
          placeholder="Controles, acciones correctivas, plan de respuesta"
          invalid={Boolean(state.fieldErrors?.mitigation)}
          maxLength={1000}
        />
      </Field>

      <Field label="Owner" htmlFor="owner" error={state.fieldErrors?.owner}>
        <TextInput
          id="owner"
          name="owner"
          defaultValue={risk?.owner ?? ""}
          placeholder="Responsable del seguimiento"
          invalid={Boolean(state.fieldErrors?.owner)}
          maxLength={120}
        />
      </Field>

      {state.error ? (
        <p className="rounded border border-signal-crit/40 bg-signal-crit/10 px-3 py-2 text-xs text-signal-crit">
          {state.error}
        </p>
      ) : null}

      <SubmitFooter editing={Boolean(risk)} />
    </form>
  );
}

function SubmitFooter({ editing }: { editing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <div className="flex items-center justify-end gap-2 border-t border-surface-border pt-3">
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent/90 disabled:opacity-60"
      >
        {pending ? "Guardando…" : editing ? "Guardar cambios" : "Crear riesgo"}
      </button>
    </div>
  );
}
