#!/bin/bash
# OWA — restore a local site backup to the live SiteGround site.
# Lists available backups when run without an argument.
#
# Usage:
#   ./scripts/site-restore.sh                 # list backups
#   ./scripts/site-restore.sh latest          # restore the newest backup
#   ./scripts/site-restore.sh site_2026-08-13_101500

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CRED_FILE="${DEPLOY_ENV_FILE:-$SCRIPT_DIR/deploy.env}"
KNOWN_HOSTS="$SCRIPT_DIR/known_hosts"
BACKUP_ROOT="$REPO_ROOT/backups"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
log() { echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $*"; }
success() { echo -e "${GREEN}✅ $*${NC}"; }
error() { echo -e "${RED}❌ $*${NC}"; exit 1; }

mapfile -t BACKUPS < <(ls -1d "$BACKUP_ROOT"/site_* 2>/dev/null | sort -r || true)

list_backups() {
  echo "Backups disponibles (más reciente primero):"
  local i=1
  for b in "${BACKUPS[@]}"; do
    local when files
    when="$(grep -m1 '^created:' "$b/.backup-manifest.txt" 2>/dev/null | cut -d' ' -f2- || echo '?')"
    files="$(find "$b" -type f 2>/dev/null | wc -l)"
    printf "  %d) %s  (%s files, %s)\n" "$i" "$(basename "$b")" "$files" "$when"
    i=$((i + 1))
  done
}

[[ ${#BACKUPS[@]} -gt 0 ]] || error "No hay backups en $BACKUP_ROOT (ejecuta scripts/site-backup.sh primero)."

TARGET="${1:-}"
if [[ -z "$TARGET" ]]; then
  list_backups
  echo ""
  echo "Para restaurar:  ./scripts/site-restore.sh latest   |   ./scripts/site-restore.sh <nombre>"
  exit 0
fi

if [[ "$TARGET" == "latest" ]]; then
  CHOSEN="${BACKUPS[0]}"
else
  CHOSEN="$BACKUP_ROOT/$(basename "$TARGET")"
fi
[[ -d "$CHOSEN" ]] || error "Backup no encontrado: $CHOSEN"

# Load SSH credentials
[[ -f "$CRED_FILE" ]] || error "Credentials file not found: $CRED_FILE"
# shellcheck disable=SC1090
set -a; source "$CRED_FILE"; set +a
for v in SSH_HOST SSH_PORT SSH_USER SSH_KEY SSH_REMOTE_PATH; do
  [[ -n "${!v:-}" ]] || error "Missing $v in $CRED_FILE"
done
SSH_KEY="${SSH_KEY/#\~/$HOME}"
RSH="ssh -i $SSH_KEY -p $SSH_PORT -o UserKnownHostsFile=$KNOWN_HOSTS -o StrictHostKeyChecking=yes -o IdentitiesOnly=yes -o BatchMode=yes -o ConnectTimeout=20"

log "Restaurando $(basename "$CHOSEN") ($(find "$CHOSEN" -type f | wc -l) files) -> $SSH_HOST:$SSH_REMOTE_PATH"
if [[ "${2:-}" == "--dry-run" || "${DRY_RUN:-}" == "1" ]]; then
  rsync -az --delete --dry-run --itemize-changes -e "$RSH" \
    --exclude '.backup-manifest.txt' "$CHOSEN/" "$SSH_USER@$SSH_HOST:$SSH_REMOTE_PATH/"
  success "DRY-RUN: nada modificado."
  exit 0
fi
rsync -az --delete -e "$RSH" --exclude '.backup-manifest.txt' "$CHOSEN/" "$SSH_USER@$SSH_HOST:$SSH_REMOTE_PATH/" \
  || error "La restauración falló."
success "Sitio restaurado desde $(basename "$CHOSEN"). Purga la Dynamic Cache en SiteGround."
