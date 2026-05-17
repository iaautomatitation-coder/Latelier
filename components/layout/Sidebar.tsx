"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Stethoscope,
  Workflow,
  ListChecks,
  ShieldAlert,
  FileText,
  Map,
  BarChart3,
  Database,
  Boxes,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface NavGroup {
  label: string;
  items: { href: string; label: string; icon: LucideIcon; badge?: string }[];
}

const navigation: NavGroup[] = [
  {
    label: "Overview",
    items: [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Estudios",
    items: [
      { href: "/studies", label: "Estudios", icon: FolderKanban },
      { href: "/diagnostic", label: "Diagnóstico", icon: Stethoscope },
      { href: "/processes", label: "Procesos", icon: Workflow },
      { href: "/requirements", label: "Requerimientos", icon: ListChecks },
      { href: "/risks", label: "Riesgos", icon: ShieldAlert },
      { href: "/documents", label: "Evidencias", icon: FileText },
      { href: "/roadmap", label: "Roadmap", icon: Map },
      { href: "/reports", label: "Reportes", icon: BarChart3 },
    ],
  },
  {
    label: "Configuración",
    items: [
      { href: "/master-data", label: "Master Data", icon: Database, badge: "MDM" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-60 shrink-0 border-r border-surface-border bg-canvas-sunken md:flex md:flex-col">
      <div className="flex h-14 items-center gap-2 border-b border-surface-border px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded bg-accent/15 text-accent-ring ring-1 ring-accent/30">
          <Boxes className="h-4 w-4" />
        </div>
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="truncate text-sm font-semibold text-ink-high">ToolTrack</span>
          <span className="truncate text-2xs uppercase tracking-wider text-ink-mid">Blueprint Studio</span>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {navigation.map((group) => (
          <div key={group.label} className="mb-4">
            <p className="px-2 pb-1 text-2xs font-semibold uppercase tracking-widest text-ink-low">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors",
                        isActive
                          ? "bg-surface-active text-ink-high"
                          : "text-ink-mid hover:bg-surface-hover hover:text-ink-high",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0",
                          isActive ? "text-accent-ring" : "text-ink-low group-hover:text-ink-mid",
                        )}
                      />
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge ? (
                        <span className="rounded bg-accent/15 px-1.5 py-0.5 font-mono text-2xs uppercase text-accent-ring">
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-surface-border px-3 py-2.5 text-2xs text-ink-low">
        <div className="flex items-center justify-between">
          <span className="font-mono">v0.1.0</span>
          <span className="rounded border border-surface-border bg-canvas-raised px-1.5 py-0.5">MVP</span>
        </div>
      </div>
    </aside>
  );
}
