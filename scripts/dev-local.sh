#!/bin/bash
# Local test environment for the OWA backend + API-connected frontend.
#   Backend:  FastAPI (uvicorn) on http://localhost:8000  (reads backend/.env)
#   Frontend: CRA dev server on http://localhost:3000 with REACT_APP_API_BASE_URL
#             pointing at the backend, so the admin panel does real CRUD.
#
# Admin login:  admin@owawild.com  /  OwaAdmin2026!
#
# Usage: ./scripts/dev-local.sh          (restart both, detached)
#        ./scripts/dev-local.sh stop     (stop both)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
LOG_DIR="$REPO_ROOT/backups"
mkdir -p "$LOG_DIR"

stop() {
  pkill -f "uvicorn server:app --host 127.0.0.1 --port 8000" 2>/dev/null || true
  pkill -f "REACT_APP_API_BASE_URL=http://localhost:8000" 2>/dev/null || true
  # also stop any CRA dev server holding port 3000
  fuser -k 3000/tcp 2>/dev/null || true
  echo "Servidores detenidos."
}

if [[ "${1:-}" == "stop" ]]; then stop; exit 0; fi

echo "Reiniciando entorno local..."
stop; sleep 1

# Backend
( cd "$REPO_ROOT/backend" && nohup venv/bin/uvicorn server:app --host 127.0.0.1 --port 8000 --log-level warning > "$LOG_DIR/backend.log" 2>&1 & )

# Frontend (API-connected)
( cd "$REPO_ROOT/frontend" && REACT_APP_API_BASE_URL=http://localhost:8000 BROWSER=none PORT=3000 nohup npm start > "$LOG_DIR/frontend.log" 2>&1 & )

echo "Backend  -> http://localhost:8000 (log: backups/backend.log)"
echo "Frontend -> http://localhost:3000 (log: backups/frontend.log) — tarda ~30s en compilar"
echo "Admin:   admin@owawild.com / OwaAdmin2026!  en http://localhost:3000/login"
