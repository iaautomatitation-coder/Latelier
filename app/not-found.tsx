import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-6">
      <div className="max-w-md rounded-md border border-surface-border bg-surface p-8 text-center shadow-panel">
        <div className="mx-auto mb-4 inline-flex rounded border border-surface-border bg-canvas-raised p-3 text-accent-ring">
          <Compass className="h-6 w-6" />
        </div>
        <h1 className="text-lg font-semibold text-ink-high">Recurso no encontrado</h1>
        <p className="mt-2 text-sm text-ink-mid">
          La ruta solicitada no existe o el recurso fue archivado. Verifica el código del estudio o el catálogo desde el sidebar.
        </p>
        <Link
          href="/dashboard"
          className="mt-5 inline-flex rounded bg-accent px-3 py-1.5 text-sm font-semibold text-white hover:bg-accent/90"
        >
          Volver al dashboard
        </Link>
      </div>
    </div>
  );
}
