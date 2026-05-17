"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Field, TextInput, TextArea, Select } from "@/components/ui/Field";
import type { Finding, StudyArea } from "@/lib/types";
import {
  createFindingAction,
  updateFindingAction,
  type FindingActionState,
} from "@/app/(app)/studies/[id]/diagnostic/actions";

const initialState: FindingActionState = { ok: null };

export function FindingForm({
  studyId,
  finding,
  areas,
  defaultAreaCode,
  onSuccess,
}: {
  studyId: string;
  finding: Finding | null;
  areas: StudyArea[];
  defaultAreaCode?: string;
  onSuccess: () => void;
}) {
  const action = finding
    ? updateFindingAction.bind(null, studyId, finding.id)
    : createFindingAction.bind(null, studyId);
  const [state, formAction] = useFormState(action, initialState);

  if (state.ok) queueMicrotask(onSuccess);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Área" htmlFor="area_code" required error={state.fieldErrors?.area_code}>
          <Select
            id="area_code"
            name="area_code"
            defaultValue={finding?.area_code ?? defaultAreaCode ?? ""}
            invalid={Boolean(state.fieldErrors?.area_code)}
            required
          >
            <option value="">— selecciona —</option>
            {areas.map((a) => (
              <option key={a.id} value={a.area_code}>
                {a.area_code} · {a.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Severidad (1-5)" htmlFor="severity" required error={state.fieldErrors?.severity}>
          <Select
            id="severity"
            name="severity"
            defaultValue={String(finding?.severity ?? 3)}
            invalid={Boolean(state.fieldErrors?.severity)}
            required
          >
            <option value="1">1 — Insignificante</option>
            <option value="2">2 — Menor</option>
            <option value="3">3 — Moderado</option>
            <option value="4">4 — Mayor</option>
            <option value="5">5 — Catastrófico</option>
          </Select>
        </Field>
      </div>

      <Field label="Título" htmlFor="title" required error={state.fieldErrors?.title}>
        <TextInput
          id="title"
          name="title"
          defaultValue={finding?.title ?? ""}
          placeholder="Resumen breve del hallazgo"
          invalid={Boolean(state.fieldErrors?.title)}
          maxLength={200}
          required
        />
      </Field>

      <Field label="Descripción" htmlFor="description" error={state.fieldErrors?.description}>
        <TextArea
          id="description"
          name="description"
          defaultValue={finding?.description ?? ""}
          placeholder="Contexto, evidencia recogida, impacto observado"
          invalid={Boolean(state.fieldErrors?.description)}
          maxLength={1000}
        />
      </Field>

      <Field
        label="Evidencias asociadas"
        htmlFor="evidence_count"
        error={state.fieldErrors?.evidence_count}
        hint="Cantidad de fotos / documentos / capturas adjuntos"
      >
        <TextInput
          id="evidence_count"
          name="evidence_count"
          type="number"
          min={0}
          max={999}
          defaultValue={finding?.evidence_count ?? 0}
          invalid={Boolean(state.fieldErrors?.evidence_count)}
        />
      </Field>

      {state.error ? (
        <p className="rounded border border-signal-crit/40 bg-signal-crit/10 px-3 py-2 text-xs text-signal-crit">
          {state.error}
        </p>
      ) : null}

      <SubmitFooter editing={Boolean(finding)} />
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
        {pending ? "Guardando…" : editing ? "Guardar cambios" : "Crear hallazgo"}
      </button>
    </div>
  );
}
