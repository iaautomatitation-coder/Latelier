"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Field, TextInput, TextArea, Select } from "@/components/ui/Field";
import type { Company, Study } from "@/lib/types";
import {
  createStudyAction,
  updateStudyAction,
  type StudyActionState,
} from "@/app/(app)/studies/actions";

const initialState: StudyActionState = { ok: null };

export function StudyForm({
  companies,
  study,
  onSuccess,
}: {
  companies: Company[];
  study: Study | null;
  onSuccess?: () => void;
}) {
  const action = study ? updateStudyAction.bind(null, study.id) : createStudyAction;
  const [state, formAction] = useFormState(action, initialState);

  if (state.ok && onSuccess) queueMicrotask(onSuccess);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Empresa" htmlFor="company_id" required={!study} error={state.fieldErrors?.company_id}>
          <Select
            id="company_id"
            name="company_id"
            defaultValue={study?.company_id ?? ""}
            invalid={Boolean(state.fieldErrors?.company_id)}
            disabled={Boolean(study)}
            required={!study}
          >
            <option value="">— selecciona —</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} · {c.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Código del estudio" htmlFor="code" required error={state.fieldErrors?.code}>
          <TextInput
            id="code"
            name="code"
            defaultValue={study?.code ?? ""}
            placeholder="EST-XXX-NNN"
            invalid={Boolean(state.fieldErrors?.code)}
            maxLength={50}
            required
          />
        </Field>
      </div>

      <Field label="Nombre" htmlFor="name" required error={state.fieldErrors?.name}>
        <TextInput
          id="name"
          name="name"
          defaultValue={study?.name ?? ""}
          placeholder="Diagnóstico de…"
          invalid={Boolean(state.fieldErrors?.name)}
          maxLength={200}
          required
        />
      </Field>

      <Field label="Descripción" htmlFor="description" error={state.fieldErrors?.description}>
        <TextArea
          id="description"
          name="description"
          defaultValue={study?.description ?? ""}
          placeholder="Alcance, objetivos, contexto"
          invalid={Boolean(state.fieldErrors?.description)}
          maxLength={1000}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Lead" htmlFor="lead" error={state.fieldErrors?.lead}>
          <TextInput
            id="lead"
            name="lead"
            defaultValue={study?.lead ?? ""}
            placeholder="Responsable del estudio"
            invalid={Boolean(state.fieldErrors?.lead)}
            maxLength={120}
          />
        </Field>
        <Field label="Estado" htmlFor="status">
          <Select id="status" name="status" defaultValue={study?.status ?? "draft"}>
            <option value="draft">Borrador</option>
            <option value="in_progress">En curso</option>
            <option value="review">Revisión</option>
            <option value="closed">Cerrado</option>
          </Select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Fecha inicio" htmlFor="started_at" error={state.fieldErrors?.started_at}>
          <TextInput
            id="started_at"
            name="started_at"
            type="date"
            defaultValue={isoToDate(study?.started_at)}
            invalid={Boolean(state.fieldErrors?.started_at)}
          />
        </Field>
        <Field label="Fecha cierre objetivo" htmlFor="target_end_at" error={state.fieldErrors?.target_end_at}>
          <TextInput
            id="target_end_at"
            name="target_end_at"
            type="date"
            defaultValue={isoToDate(study?.target_end_at)}
            invalid={Boolean(state.fieldErrors?.target_end_at)}
          />
        </Field>
      </div>

      {study ? (
        <div className="grid grid-cols-2 gap-3">
          <Field label="Madurez (0-100)" htmlFor="maturity_score" error={state.fieldErrors?.maturity_score}>
            <TextInput
              id="maturity_score"
              name="maturity_score"
              type="number"
              min={0}
              max={100}
              defaultValue={study.maturity_score}
              invalid={Boolean(state.fieldErrors?.maturity_score)}
            />
          </Field>
          <Field label="Avance (0-100)" htmlFor="progress" error={state.fieldErrors?.progress}>
            <TextInput
              id="progress"
              name="progress"
              type="number"
              min={0}
              max={100}
              defaultValue={study.progress}
              invalid={Boolean(state.fieldErrors?.progress)}
            />
          </Field>
        </div>
      ) : (
        <>
          <input type="hidden" name="maturity_score" value="0" />
          <input type="hidden" name="progress" value="0" />
        </>
      )}

      {!study ? (
        <p className="rounded border border-accent/30 bg-accent/10 px-3 py-2 text-2xs text-accent-ring">
          Al crear el estudio se inicializan automáticamente las 9 áreas funcionales desde el catálogo MDM.
        </p>
      ) : null}

      {state.error ? (
        <p className="rounded border border-signal-crit/40 bg-signal-crit/10 px-3 py-2 text-xs text-signal-crit">
          {state.error}
        </p>
      ) : null}

      <SubmitFooter editing={Boolean(study)} />
    </form>
  );
}

function isoToDate(iso?: string): string {
  if (!iso) return "";
  return iso.slice(0, 10);
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
        {pending ? "Guardando…" : editing ? "Guardar cambios" : "Crear estudio"}
      </button>
    </div>
  );
}
