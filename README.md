# ToolTrack Blueprint Studio

Plataforma interna para estudios de arquitectura operacional, trazabilidad y
requerimientos para empresas de renta, mantenimiento e inspección de
herramientas O&G.

Stack: Next.js 14 (App Router) + React 18 + TypeScript estricto + Tailwind 3.4
+ @supabase/ssr.

## Cómo arrancar en la Mac

Requisitos: Node 18+ (recomendado 20 o 22), npm.

```bash
npm install
npm run dev
```

Abrir http://localhost:3000 en el navegador.

## Sin Supabase

La app corre contra un seed en memoria si no hay credenciales. Funciona el CRUD
completo (Studies, Findings, Requirements, Risks, Master Data) pero los cambios
se pierden al reiniciar el server.

## Con Supabase

```bash
cp .env.example .env.local
# Pega NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Aplicar el schema desde `supabase/migrations/20260517000000_init.sql` y
seguidamente `supabase/seed.sql`.

## Rutas disponibles

- `/dashboard` — KPIs ejecutivos
- `/studies` — Portafolio de estudios
- `/studies/new` — Crear estudio (auto-inicializa 9 áreas desde MDM)
- `/studies/[id]` — Detalle con tabs y botón "Editar"
- `/studies/[id]/diagnostic` — Hallazgos por área
- `/studies/[id]/requirements` — Matriz editable de 9 columnas
- `/studies/[id]/risks` — Heatmap 5×5 + tabla editable
- `/master-data` — 9 dominios · 47 catálogos
- `/master-data/[catalog]` — CRUD con reordenar e jerarquías

## Scripts

```bash
npm run dev        # desarrollo
npm run build      # build producción
npm run start      # arrancar build
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```
