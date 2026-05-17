"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = "max-w-md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="flex-1 bg-canvas-sunken/60 backdrop-blur-sm transition-opacity"
      />
      <aside
        className={cn(
          "flex h-full w-full flex-col border-l border-surface-border bg-canvas-raised shadow-2xl",
          width,
        )}
      >
        <header className="flex items-start justify-between gap-3 border-b border-surface-border px-4 py-3">
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold uppercase tracking-wide text-ink-high">{title}</h2>
            {subtitle ? <p className="mt-0.5 truncate text-xs text-ink-mid">{subtitle}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-surface-border p-1.5 text-ink-mid hover:bg-surface-hover hover:text-ink-high"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>
        {footer ? <footer className="border-t border-surface-border px-4 py-3">{footer}</footer> : null}
      </aside>
    </div>
  );
}
