#!/bin/bash
# OWA — local backup of the live SiteGround site (public_html).
# Downloads the current remote site into backups/site_<timestamp>/ and keeps
# only the newest N (default 3). Run before each deploy so a broken release can
# be rolled back with scripts/restore.sh.
#
# Usage: ./scripts/backup.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CRED_FILE="${DEPLOY_ENV_FILE:-$SCRIPT_DIR/deploy.env}"
KNOWN_HOSTS="$SCRIPT_DIR/known_hosts"
BACKUP_ROOT="$REPO_ROOT/backups"
KEEP="${BACKUP_KEEP:-3}"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
log() { echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $*"; }
success() { echo -e "${GREEN}✅ $*${NC}"; }
warn() { echo -e "${YELLOW}⚠️  $*${NC}"; }
error() { echo -e "${RED}❌ $*${NC}"; exit 1; }

[[ -f "$CRED_FILE" ]] || error "Credentials file not found: $CRED_FILE"
# shellcheck disable=SC1090
set -a; source "$CRED_FILE"; set +a
for v in SSH_HOST SSH_PORT SSH_USER SSH_KEY SSH_REMOTE_PATH; do
  [[ -n "${!v:-}" ]] || error "Missing $v in $CRED_FILE"
done
SSH_KEY="${SSH_KEY/#\~/$HOME}"
command -v rsync >/dev/null || error "rsync not installed"

RSH="ssh -i $SSH_KEY -p $SSH_PORT -o UserKnownHostsFile=$KNOWN_HOSTS -o StrictHostKeyChecking=yes -o IdentitiesOnly=yes -o BatchMode=yes -o ConnectTimeout=20"

STAMP="$(date +%Y-%m-%d_%H%M%S)"
DEST="$BACKUP_ROOT/site_$STAMP"
mkdir -p "$DEST"

log "Backing up live site -> ${DEST#$REPO_ROOT/}"
if ! rsync -az --delete -e "$RSH" "$SSH_USER@$SSH_HOST:$SSH_REMOTE_PATH/" "$DEST/"; then
  rm -rf "$DEST"
  error "Backup failed (nothing to roll back to). Live site unchanged."
fi

# Manifest for quick reference
{
  echo "created: $(date -Iseconds)"
  echo "source: $SSH_USER@$SSH_HOST:$SSH_REMOTE_PATH"
  echo "files: $(find "$DEST" -type f | wc -l)"
} > "$DEST/.backup-manifest.txt"

# Prune: keep only the newest $KEEP backups (sorted by timestamped name).
mapfile -t OLD < <(ls -1d "$BACKUP_ROOT"/site_* 2>/dev/null | sort -r | tail -n +"$((KEEP + 1))")
for d in "${OLD[@]}"; do rm -rf "$d"; log "pruned old backup ${d#$REPO_ROOT/}"; done

success "Backup complete ($(find "$DEST" -type f | wc -l) files). Keeping newest $KEEP:"
ls -1d "$BACKUP_ROOT"/site_* | sort -r | sed "s#$REPO_ROOT/#  #"
