#!/bin/bash
# OWA SiteGround FTP Deploy Script
# Usage: ./scripts/deploy-siteground.sh

set -euo pipefail

# Configuration
FTP_HOST="ftp.owawild.com"
FTP_USER="octano@owawild.com"
FTP_PASS='***REMOVED-FTP-PASSWORD***'
FTP_PORT="21"
REMOTE_PATH="/owawild.com/public_html"
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
    
    lftp -c "
        set ftp:ssl-allow no
        set ftp:passive-mode on
        set net:timeout 30
        set net:max-retries 3
        open -u '$FTP_USER','$FTP_PASS' -p $FTP_PORT $FTP_HOST
        mirror --reverse --delete --verbose --parallel=4 $LOCAL_BUILD_DIR $REMOTE_PATH
        bye
    " || error "FTP deploy failed"
    
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
    log "Target: $FTP_HOST:$REMOTE_PATH"
    
    check_requirements
    build_frontend
    deploy_ftp
    verify
    
    success "🎉 Deploy successful!"
    log "🌐 https://owawild.com"
}

main "$@"