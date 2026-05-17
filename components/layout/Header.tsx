import { Search, Bell, HelpCircle, Settings } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-surface-border bg-canvas/90 px-4 backdrop-blur">
      <div className="flex flex-1 items-center gap-3">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-low" />
          <input
            type="search"
            placeholder="Buscar estudios, requerimientos, catálogos…"
            className="w-full rounded border border-surface-border bg-canvas-raised py-1.5 pl-8 pr-3 text-sm text-ink-high placeholder:text-ink-low focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="rounded border border-transparent p-1.5 text-ink-mid hover:bg-surface-hover hover:text-ink-high"
          aria-label="Ayuda"
        >
          <HelpCircle className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="relative rounded border border-transparent p-1.5 text-ink-mid hover:bg-surface-hover hover:text-ink-high"
          aria-label="Notificaciones"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-signal-warn" />
        </button>
        <button
          type="button"
          className="rounded border border-transparent p-1.5 text-ink-mid hover:bg-surface-hover hover:text-ink-high"
          aria-label="Ajustes"
        >
          <Settings className="h-4 w-4" />
        </button>
        <div className="ml-2 flex items-center gap-2 border-l border-surface-border pl-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/15 text-2xs font-semibold uppercase text-accent-ring ring-1 ring-accent/30">
            RC
          </div>
          <div className="hidden flex-col leading-tight lg:flex">
            <span className="text-xs font-medium text-ink-high">R. Cervantes</span>
            <span className="text-2xs uppercase tracking-wider text-ink-low">Arq. Senior</span>
          </div>
        </div>
      </div>
    </header>
  );
}
