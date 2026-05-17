import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/layout/Breadcrumbs";

export function PageShell({
  crumbs,
  children,
}: {
  crumbs: Crumb[];
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col">
      <div className="border-b border-surface-border bg-canvas-sunken/40 px-6 py-3">
        <Breadcrumbs items={crumbs} />
      </div>
      <div className="flex-1 px-6 py-6">{children}</div>
    </div>
  );
}
