"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Field, TextInput, TextArea, Select } from "@/components/ui/Field";
import type { MdmItem, Requirement } from "@/lib/types";
import {
  createRequirementAction,
  updateRequirementAction,
  type ReqActionState,
} from "@/app/(app)/studies/[id]/requirements/actions";

const initialState: ReqActionState = { ok: null };

export function RequirementForm({
  studyId,
  requirement,
  areas,
  processes,
  onSuccess,
}: {
  studyId: string;
  requirement: Requirement | null;
  areas: MdmItem[];
  processes: MdmItem[];
  onSuccess: () => void;
}) {
  const action = requirement
    ? updateRequirementAction.bind(null, studyId, requirement.id)
    : createRequirementAction.bind(null, studyId);
  const [state, formAction] = useFormState(action, initialState);

  if (state.ok) queueMicrotask(onSuccess);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Área" htmlFor="area_code" required error={state.fieldErrors?.area_code}>
          <Select
            id="area_code"
            name="area_code"
            defaultValue={requirement?.area_code ?? ""}
            invalid={Boolean(state.fieldErrors?.area_code)}
            required
          >
            <option value="">— selecciona —</option>
            {areas.map((a) => (
              <option key={a.id} value={a.code}>
                {a.code} · {a.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Proceso" htmlFor="process_code" required error={state.fieldErrors?.process_code}>
          <Select
            id="process_code"
            name="process_code"
            defaultValue={requirement?.process_code ?? ""}
            invalid={Boolean(state.fieldErrors?.process_code)}
            required
          >
            <option value="">— selecciona —</option>
            {processes.map((p) => (
              <option key={p.id} value={p.code}>
                {p.code} · {p.name}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Problema" htmlFor="problem" required error={state.fieldErrors?.problem}>
        <TextArea
          id="problem"
          name="problem"
          defaultValue={requirement?.problem ?? ""}
          placeholder="¿Qué duele hoy?"
          invalid={Boolean(state.fieldErrors?.problem)}
          maxLength={500}
          required
        />
      </Field>

      <Field label="Necesidad" htmlFor="need" required error={state.fieldErrors?.need}>
        <TextArea
          id="need"
          name="need"
          defaultValue={requirement?.need ?? ""}
          placeholder="¿Qué se necesita resolver?"
          invalid={Boolean(state.fieldErrors?.need)}
          maxLength={500}
          required
        />
      </Field>

      <Field
        label="Solución propuesta"
        htmlFor="proposed_solution"
        error={state.fieldErrors?.proposed_solution}
      >
        <TextArea
          id="proposed_solution"
          name="proposed_solution"
          defaultValue={requirement?.proposed_solution ?? ""}
          placeholder="Solución funcional sugerida"
          invalid={Boolean(state.fieldErrors?.proposed_solution)}
          maxLength={500}
        />
      </Field>

      <Field
        label="Módulo sugerido"
        htmlFor="suggested_module"
        error={state.fieldErrors?.suggested_module}
        hint="Mantenimiento, Calidad, Almacén, Finanzas, …"
      >
        <TextInput
          id="suggested_module"
          name="suggested_module"
          defaultValue={requirement?.suggested_module ?? ""}
          invalid={Boolean(state.fieldErrors?.suggested_module)}
          maxLength={80}
        />
      </Field>

      <div className="grid grid-cols-3 gap-3">
        <Field label="Prioridad" htmlFor="priority">
          <Select id="priority" name="priority" defaultValue={requirement?.priority ?? "medium"}>
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
            <option value="critical">Crítica</option>
          </Select>
        </Field>
        <Field label="Riesgo" htmlFor="risk_level">
          <Select id="risk_level" name="risk_level" defaultValue={requirement?.risk_level ?? "medium"}>
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
            <option value="critical">Crítica</option>
          </Select>
        </Field>
        <Field label="Estado" htmlFor="status">
          <Select id="status" name="status" defaultValue={requirement?.status ?? "identified"}>
            <option value="identified">Identificado</option>
            <option value="validated">Validado</option>
            <option value="in_design">En diseño</option>
            <option value="delivered">Entregado</option>
            <option value="rejected">Rechazado</option>
          </Select>
        </Field>
      </div>

      {state.error ? (
        <p className="rounded border border-signal-crit/40 bg-signal-crit/10 px-3 py-2 text-xs text-signal-crit">
          {state.error}
        </p>
      ) : null}

      <SubmitFooter editing={Boolean(requirement)} />
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
        {pending ? "Guardando…" : editing ? "Guardar cambios" : "Crear requerimiento"}
      </button>
    </div>
  );
}
