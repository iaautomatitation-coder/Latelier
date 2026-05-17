"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Field, TextInput, TextArea, Select } from "@/components/ui/Field";
import type { MdmItem, MdmCatalog } from "@/lib/types";
import {
  createMdmItemAction,
  updateMdmItemAction,
  type ActionState,
} from "@/app/(app)/master-data/[catalog]/actions";

const initialState: ActionState = { ok: null };

export function ItemForm({
  catalog,
  item,
  parents,
  onSuccess,
}: {
  catalog: MdmCatalog;
  item: MdmItem | null;
  parents: MdmItem[]; // existing items in the same catalog, for parent selector
  onSuccess: () => void;
}) {
  const action = item
    ? updateMdmItemAction.bind(null, catalog.code, item.id)
    : createMdmItemAction.bind(null, catalog.code);
  const [state, formAction] = useFormState(action, initialState);

  if (state.ok) {
    // Defer to allow React to commit, then close from parent.
    queueMicrotask(onSuccess);
  }

  const codeDisabled = Boolean(item?.is_system);
  const parentOptions = parents.filter((p) => p.id !== item?.id);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Código" htmlFor="code" required error={state.fieldErrors?.code}>
          <TextInput
            id="code"
            name="code"
            defaultValue={item?.code ?? ""}
            placeholder="EJ_CODIGO"
            invalid={Boolean(state.fieldErrors?.code)}
            disabled={codeDisabled}
            maxLength={50}
            required
            autoComplete="off"
          />
        </Field>
        <Field label="Orden" htmlFor="sort_order" error={state.fieldErrors?.sort_order}>
          <TextInput
            id="sort_order"
            name="sort_order"
            type="number"
            min={0}
            max={9999}
            defaultValue={item?.sort_order ?? ""}
            placeholder="auto"
            invalid={Boolean(state.fieldErrors?.sort_order)}
          />
        </Field>
      </div>

      <Field label="Nombre" htmlFor="name" required error={state.fieldErrors?.name}>
        <TextInput
          id="name"
          name="name"
          defaultValue={item?.name ?? ""}
          placeholder="Nombre visible"
          invalid={Boolean(state.fieldErrors?.name)}
          maxLength={200}
          required
        />
      </Field>

      <Field label="Descripción" htmlFor="description" error={state.fieldErrors?.description}>
        <TextArea
          id="description"
          name="description"
          defaultValue={item?.description ?? ""}
          placeholder="Descripción opcional"
          invalid={Boolean(state.fieldErrors?.description)}
          maxLength={1000}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Estado" htmlFor="status">
          <Select id="status" name="status" defaultValue={item?.status ?? "active"}>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
            <option value="draft">Borrador</option>
            <option value="archived">Archivado</option>
          </Select>
        </Field>

        {catalog.hierarchical ? (
          <Field label="Padre" htmlFor="parent_id" hint="Solo catálogos jerárquicos">
            <Select
              id="parent_id"
              name="parent_id"
              defaultValue={item?.parent_id ?? ""}
              disabled={codeDisabled}
            >
              <option value="">— sin padre (raíz) —</option>
              {parentOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.code})
                </option>
              ))}
            </Select>
          </Field>
        ) : (
          <div />
        )}
      </div>

      {codeDisabled ? (
        <p className="rounded border border-signal-warn/30 bg-signal-warn/10 px-3 py-2 text-2xs text-signal-warn">
          Este item es de sistema. El código y la jerarquía no son editables.
        </p>
      ) : null}

      {state.error ? (
        <p className="rounded border border-signal-crit/40 bg-signal-crit/10 px-3 py-2 text-xs text-signal-crit">
          {state.error}
        </p>
      ) : null}

      <SubmitFooter editing={Boolean(item)} />
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
        {pending ? "Guardando…" : editing ? "Guardar cambios" : "Crear item"}
      </button>
    </div>
  );
}
