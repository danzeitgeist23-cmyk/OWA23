#!/bin/bash
# OWA SiteGround SFTP (SSH) Deploy Script — preferred, secure deploy path.
#
# Advantages over the FTPS script: SSH key authentication (no password on the
# wire) and real host-key verification via a pinned scripts/known_hosts, so
# there is no "certificate CN doesn't match" tradeoff.
#
# One-time setup (see scripts/deploy.env.example):
#   1. Add scripts/../~/.ssh/owa_siteground_deploy.pub in SiteGround
#      Site Tools -> Devs -> SSH Keys Manager (import/authorize the public key).
#   2. Fill SSH_USER (and confirm SSH_REMOTE_PATH) in scripts/deploy.env.
#
# Usage: ./scripts/deploy-siteground-sftp.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CRED_FILE="${DEPLOY_ENV_FILE:-$SCRIPT_DIR/deploy.env}"
KNOWN_HOSTS="$SCRIPT_DIR/known_hosts"
LOCAL_BUILD_DIR="frontend/build"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
log() { echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $*"; }
success() { echo -e "${GREEN}✅ $*${NC}"; }
warn() { echo -e "${YELLOW}⚠️  $*${NC}"; }
error() { echo -e "${RED}❌ $*${NC}"; exit 1; }

load_credentials() {
    log "Loading credentials from ${CRED_FILE#$REPO_ROOT/}..."
    [[ -f "$CRED_FILE" ]] || error "Credentials file not found: $CRED_FILE
   Copy scripts/deploy.env.example to scripts/deploy.env and fill in the values."
    # shellcheck disable=SC1090
    set -a; source "$CRED_FILE"; set +a
    local missing=()
    for var in SSH_HOST SSH_PORT SSH_USER SSH_KEY SSH_REMOTE_PATH; do
        [[ -n "${!var:-}" ]] || missing+=("$var")
    done
    [[ ${#missing[@]} -eq 0 ]] || error "Missing values in $CRED_FILE: ${missing[*]}
   (SFTP needs SSH_HOST, SSH_PORT, SSH_USER, SSH_KEY, SSH_REMOTE_PATH.)"
    SSH_KEY="${SSH_KEY/#\~/$HOME}"
    success "Credentials loaded"
}

check_requirements() {
    log "Checking requirements..."
    command -v lftp >/dev/null || error "lftp not installed. Install with: sudo apt-get install lftp"
    [[ -f "$SSH_KEY" ]] || error "SSH key not found: $SSH_KEY"
    [[ -f "$KNOWN_HOSTS" ]] || error "Pinned host key file not found: $KNOWN_HOSTS"
    [[ -d "frontend" ]] || error "frontend directory not found"
    success "Requirements OK"
}

build_frontend() {
    log "Building frontend..."
    (cd frontend && npm run build) || error "Build failed"
    [[ -d "$LOCAL_BUILD_DIR" ]] || error "Build directory not found after build"
    success "Frontend built successfully"
}

deploy_sftp() {
    log "Deploying to SiteGround via SFTP (SSH key + pinned host key)..."
    local ssh_cmd="ssh -a -x -i $SSH_KEY -p $SSH_PORT -o UserKnownHostsFile=$KNOWN_HOSTS -o StrictHostKeyChecking=yes"
    lftp -c "
        set sftp:connect-program \"$ssh_cmd\"
        set net:timeout 30
        set net:max-retries 3
        open sftp://$SSH_USER@$SSH_HOST
        mirror --reverse --delete --verbose --parallel=4 $LOCAL_BUILD_DIR $SSH_REMOTE_PATH
        bye
    " || error "SFTP deploy failed"
    success "Deploy complete"
}

verify() {
    log "Verifying deployment..."
    if curl -sf --max-time 15 "https://owawild.com/" >/dev/null 2>&1; then
        success "Site accessible at https://owawild.com"
    else
        warn "Could not verify - check manually"
    fi
}

main() {
    log "🚀 OWA SiteGround Deploy (SFTP)"
    cd "$REPO_ROOT"
    load_credentials
    log "Target: $SSH_USER@$SSH_HOST:$SSH_PORT $SSH_REMOTE_PATH"
    check_requirements
    build_frontend
    deploy_sftp
    verify
    success "🎉 Deploy successful!"
    log "🌐 https://owawild.com"
}

main "$@"
