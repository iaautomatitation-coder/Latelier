"use server";

import { revalidatePath } from "next/cache";
import {
  createItem,
  updateItem,
  softDeleteItem,
  moveItem,
  hasCode,
  getItem,
} from "@/lib/data/mdm-store";
import type { RecordStatus } from "@/lib/types";

export interface ActionState {
  ok: boolean | null;
  error?: string;
  fieldErrors?: Partial<Record<"code" | "name" | "description" | "sort_order", string>>;
  itemId?: string;
}

const CODE_RE = /^[A-Za-z0-9_\-./]+$/;
const STATUSES: RecordStatus[] = ["active", "inactive", "draft", "archived"];

function readForm(formData: FormData) {
  const code = String(formData.get("code") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const sortRaw = String(formData.get("sort_order") ?? "").trim();
  const parentRaw = String(formData.get("parent_id") ?? "").trim();
  const statusRaw = String(formData.get("status") ?? "active").trim() as RecordStatus;
  const sortOrder = sortRaw === "" ? undefined : Number.parseInt(sortRaw, 10);
  const parent_id = parentRaw === "" ? null : parentRaw;
  const status = STATUSES.includes(statusRaw) ? statusRaw : "active";
  return { code, name, description, sort_order: sortOrder, parent_id, status };
}

function validate(
  input: { code: string; name: string; description: string; sort_order?: number },
  catalogCode: string,
  exceptId?: string,
): ActionState["fieldErrors"] | null {
  const errors: ActionState["fieldErrors"] = {};
  if (!input.code) errors.code = "Requerido";
  else if (input.code.length > 50) errors.code = "Máximo 50 caracteres";
  else if (!CODE_RE.test(input.code)) errors.code = "Solo letras, números, _ . - /";
  else if (hasCode(catalogCode, input.code, exceptId)) errors.code = "Código duplicado en este catálogo";

  if (!input.name) errors.name = "Requerido";
  else if (input.name.length > 200) errors.name = "Máximo 200 caracteres";

  if (input.description && input.description.length > 1000) errors.description = "Máximo 1000 caracteres";

  if (input.sort_order !== undefined) {
    if (!Number.isFinite(input.sort_order) || input.sort_order < 0 || input.sort_order > 9999) {
      errors.sort_order = "Entero entre 0 y 9999";
    }
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

export async function createMdmItemAction(
  catalogCode: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const input = readForm(formData);
  const fieldErrors = validate(input, catalogCode);
  if (fieldErrors) return { ok: false, fieldErrors };
  const item = createItem({
    catalog_code: catalogCode,
    code: input.code,
    name: input.name,
    description: input.description,
    parent_id: input.parent_id,
    sort_order: input.sort_order,
    status: input.status,
  });
  revalidatePath(`/master-data/${catalogCode}`);
  return { ok: true, itemId: item.id };
}

export async function updateMdmItemAction(
  catalogCode: string,
  itemId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const existing = getItem(itemId);
  if (!existing) return { ok: false, error: "Item no encontrado" };
  if (existing.is_system) {
    // System items: allow only name/description/sort_order/status edits, not code or parent.
    const input = readForm(formData);
    const fieldErrors = validate(
      { code: existing.code, name: input.name, description: input.description, sort_order: input.sort_order },
      catalogCode,
      itemId,
    );
    if (fieldErrors) return { ok: false, fieldErrors };
    updateItem(itemId, {
      name: input.name,
      description: input.description,
      sort_order: input.sort_order,
      status: input.status,
    });
  } else {
    const input = readForm(formData);
    const fieldErrors = validate(input, catalogCode, itemId);
    if (fieldErrors) return { ok: false, fieldErrors };
    updateItem(itemId, {
      code: input.code,
      name: input.name,
      description: input.description,
      parent_id: input.parent_id,
      sort_order: input.sort_order,
      status: input.status,
    });
  }
  revalidatePath(`/master-data/${catalogCode}`);
  return { ok: true, itemId };
}

export async function deleteMdmItemAction(catalogCode: string, itemId: string): Promise<ActionState> {
  const existing = getItem(itemId);
  if (!existing) return { ok: false, error: "Item no encontrado" };
  if (existing.is_system) return { ok: false, error: "Items de sistema no se pueden eliminar" };
  softDeleteItem(itemId);
  revalidatePath(`/master-data/${catalogCode}`);
  return { ok: true };
}

export async function moveMdmItemAction(
  catalogCode: string,
  itemId: string,
  direction: "up" | "down",
): Promise<ActionState> {
  const moved = moveItem(itemId, direction);
  if (!moved) return { ok: false, error: "No se pudo mover" };
  revalidatePath(`/master-data/${catalogCode}`);
  return { ok: true };
}
