// Mutable in-memory store for MDM items.
//
// In the MVP without a real database, this wraps the seed array so Server
// Actions can mutate it (create / update / soft delete / reorder). Mutations
// persist within the same Node.js process and are lost on rebuild.
// When SUPABASE_URL is set, swap the bodies of these functions for queries
// against the `mdm_items` table — the public API of this module stays the same.

import { mdmItems as seed } from "@/lib/seed/master-data";
import type { MdmItem, RecordStatus } from "@/lib/types";

const store: MdmItem[] = [...seed];

let counter = 1000;
function nextId(prefix = "i"): string {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter.toString(36)}`;
}

export function listItems(catalogCode: string): MdmItem[] {
  return store
    .filter((i) => i.catalog_code === catalogCode && i.deleted_at === null)
    .sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name));
}

export function getItem(id: string): MdmItem | null {
  return store.find((i) => i.id === id) ?? null;
}

export function hasCode(catalogCode: string, code: string, exceptId?: string): boolean {
  return store.some(
    (i) =>
      i.catalog_code === catalogCode &&
      i.deleted_at === null &&
      i.code.toLowerCase() === code.toLowerCase() &&
      i.id !== exceptId,
  );
}

export interface CreateItemInput {
  catalog_code: string;
  code: string;
  name: string;
  description?: string;
  parent_id?: string | null;
  sort_order?: number;
  status?: RecordStatus;
}

export function createItem(input: CreateItemInput): MdmItem {
  const now = new Date().toISOString();
  const siblings = listItems(input.catalog_code);
  const sortOrder = input.sort_order ?? (siblings.at(-1)?.sort_order ?? 0) + 1;
  const item: MdmItem = {
    id: nextId(),
    company_id: null,
    catalog_code: input.catalog_code,
    parent_id: input.parent_id ?? null,
    code: input.code,
    name: input.name,
    description: input.description ?? "",
    metadata: {},
    status: input.status ?? "active",
    sort_order: sortOrder,
    is_system: false,
    created_at: now,
    updated_at: now,
    deleted_at: null,
  };
  store.push(item);
  return item;
}

export interface UpdateItemInput {
  code?: string;
  name?: string;
  description?: string;
  parent_id?: string | null;
  sort_order?: number;
  status?: RecordStatus;
}

export function updateItem(id: string, patch: UpdateItemInput): MdmItem | null {
  const item = store.find((i) => i.id === id);
  if (!item) return null;
  if (patch.code !== undefined) item.code = patch.code;
  if (patch.name !== undefined) item.name = patch.name;
  if (patch.description !== undefined) item.description = patch.description;
  if (patch.parent_id !== undefined) item.parent_id = patch.parent_id;
  if (patch.sort_order !== undefined) item.sort_order = patch.sort_order;
  if (patch.status !== undefined) item.status = patch.status;
  item.updated_at = new Date().toISOString();
  return item;
}

export function softDeleteItem(id: string): MdmItem | null {
  const item = store.find((i) => i.id === id);
  if (!item) return null;
  if (item.is_system) return null;
  const now = new Date().toISOString();
  item.deleted_at = now;
  item.updated_at = now;
  return item;
}

export function moveItem(id: string, direction: "up" | "down"): boolean {
  const item = store.find((i) => i.id === id);
  if (!item) return false;
  const siblings = listItems(item.catalog_code).filter((s) => s.parent_id === item.parent_id);
  const idx = siblings.findIndex((s) => s.id === id);
  if (idx === -1) return false;
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= siblings.length) return false;
  const other = siblings[swapIdx];
  const tmp = item.sort_order;
  item.sort_order = other.sort_order;
  other.sort_order = tmp;
  const now = new Date().toISOString();
  item.updated_at = now;
  other.updated_at = now;
  return true;
}
