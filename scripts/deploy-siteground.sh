#!/bin/bash
# OWA SiteGround FTP Deploy Script
# Usage: ./scripts/deploy-siteground.sh

set -euo pipefail

# Resolve repo root so the script works from any CWD
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Credentials are loaded from a gitignored env file (see scripts/deploy.env.example).
# Override the path with DEPLOY_ENV_FILE if needed.
CRED_FILE="${DEPLOY_ENV_FILE:-$SCRIPT_DIR/deploy.env}"

# Non-secret configuration
LOCAL_BUILD_DIR="frontend/build"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $*"; }
success() { echo -e "${GREEN}✅ $*${NC}"; }
warn() { echo -e "${YELLOW}⚠️  $*${NC}"; }
error() { echo -e "${RED}❌ $*${NC}"; exit 1; }

# Load and validate credentials from the gitignored env file
load_credentials() {
    log "Loading credentials from ${CRED_FILE#$REPO_ROOT/}..."
    [[ -f "$CRED_FILE" ]] || error "Credentials file not found: $CRED_FILE
   Copy scripts/deploy.env.example to scripts/deploy.env and fill in the real values."
    # shellcheck disable=SC1090
    set -a; source "$CRED_FILE"; set +a
    local missing=()
    for var in FTP_HOST FTP_USER FTP_PASS FTP_PORT REMOTE_PATH; do
        [[ -n "${!var:-}" ]] || missing+=("$var")
    done
    [[ ${#missing[@]} -eq 0 ]] || error "Missing values in $CRED_FILE: ${missing[*]}"
    success "Credentials loaded"
}

# Check requirements
check_requirements() {
    log "Checking requirements..."
    command -v lftp >/dev/null || error "lftp not installed. Install with: sudo apt-get install lftp"
    [[ -d "frontend" ]] || error "frontend directory not found"
    success "Requirements OK"
}

# Build frontend
build_frontend() {
    log "Building frontend..."
    cd frontend
    npm run build || error "Build failed"
    cd ..
    [[ -d "$LOCAL_BUILD_DIR" ]] || error "Build directory not found after build"
    success "Frontend built successfully"
}

# Deploy via FTP
deploy_ftp() {
    log "Deploying to SiteGround via FTP..."
    
    # Force explicit FTPS (TLS) so the login and the uploaded data travel
    # encrypted. Certificate verification is disabled because SiteGround shared
    # hosting presents a server cert whose CN does not match ftp.<domain>
    # (verified: "certificate common name doesn't match"). TLS still protects
    # the credentials/data in transit; for full cert validation switch to SFTP.
    lftp -c "
        set ftp:ssl-force true
        set ftp:ssl-protect-data true
        set ssl:verify-certificate no
        set ftp:passive-mode on
        set net:timeout 30
        set net:max-retries 3
        open -u '$FTP_USER','$FTP_PASS' -p $FTP_PORT $FTP_HOST
        mirror --reverse --delete --verbose --parallel=4 $LOCAL_BUILD_DIR $REMOTE_PATH
        bye
    " || error "FTPS deploy failed"
    
    success "Deploy complete"
}

# Verify deployment
verify() {
    log "Verifying deployment..."
    if curl -sf --max-time 15 "https://owawild.com/" >/dev/null 2>&1; then
        success "Site accessible at https://owawild.com"
    else
        warn "Could not verify - check manually"
    fi
}

# Main
main() {
    log "🚀 OWA SiteGround Deploy"
    cd "$REPO_ROOT"

    load_credentials
    log "Target: $FTP_HOST:$REMOTE_PATH"

    check_requirements
    build_frontend
    deploy_ftp
    verify
    
    success "🎉 Deploy successful!"
    log "🌐 https://owawild.com"
}

main "$@"