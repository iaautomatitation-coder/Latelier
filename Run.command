#!/bin/bash
# Double-click this file on macOS Finder to install deps and start the dev server.
# Requires Node 18+ installed. Get it from https://nodejs.org/

set -e

cd "$(dirname "$0")"

echo "════════════════════════════════════════════════════"
echo "  ToolTrack Blueprint Studio"
echo "════════════════════════════════════════════════════"
echo ""

if ! command -v node >/dev/null 2>&1; then
  echo "❌ Node.js no está instalado."
  echo "   Descárgalo desde https://nodejs.org/ (versión LTS) y vuelve a correr."
  read -p "Presiona Enter para cerrar…"
  exit 1
fi

NODE_VERSION=$(node -v)
echo "✓ Node ${NODE_VERSION}"

if [ ! -d "node_modules" ]; then
  echo ""
  echo "→ Instalando dependencias (primera vez, ~1-2 min)…"
  npm install --no-audit --no-fund
fi

echo ""
echo "→ Levantando dev server en http://localhost:3000"
echo "  Presiona Ctrl+C en esta ventana para detenerlo."
echo ""
sleep 1

# Open the browser after a short delay so the server has time to compile.
( sleep 5 && open "http://localhost:3000" ) &

npm run dev
