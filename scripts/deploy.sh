#!/bin/bash
# OWA Production Deploy Script
# Usage: ./scripts/deploy.sh [production|staging]

set -euo pipefail

ENVIRONMENT="${1:-production}"
PROJECT_DIR="/opt/owa"
COMPOSE_FILE="docker-compose.prod.yml"
BACKUP_DIR="/opt/owa/backups"

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
    command -v docker >/dev/null || error "Docker not installed"
    command -v docker compose >/dev/null || error "Docker Compose not installed"
    [[ -f "$PROJECT_DIR/.env.production" ]] || error ".env.production not found in $PROJECT_DIR"
    [[ -f "$PROJECT_DIR/$COMPOSE_FILE" ]] || error "$COMPOSE_FILE not found in $PROJECT_DIR"
    success "Requirements OK"
}

# Backup database
backup_db() {
    log "Backing up MongoDB..."
    mkdir -p "$BACKUP_DIR"
    local backup_file="$BACKUP_DIR/mongodb_$(date +%Y%m%d_%H%M%S).gz"
    docker exec owa-mongodb mongodump --archive --gzip --db="${DB_NAME:-owa_db}" > "$backup_file" 2>/dev/null || warn "Backup failed (container may not exist yet)"
    [[ -f "$backup_file" ]] && success "Backup saved: $backup_file"
}

# Pull latest images
pull_images() {
    log "Pulling latest images..."
    cd "$PROJECT_DIR"
    docker compose -f "$COMPOSE_FILE" pull || error "Failed to pull images"
    success "Images pulled"
}

# Deploy with zero-downtime
deploy() {
    log "Deploying $ENVIRONMENT..."
    cd "$PROJECT_DIR"

    # Start new containers alongside old ones (nginx handles routing)
    docker compose -f "$COMPOSE_FILE" up -d --no-deps backend frontend || error "Failed to start new containers"

    # Wait for health checks
    log "Waiting for health checks..."
    local max_wait=60
    local elapsed=0
    while [[ $elapsed -lt $max_wait ]]; do
        if docker compose -f "$COMPOSE_FILE" ps --format '{{.Status}}' | grep -q "healthy"; then
            success "Services healthy"
            break
        fi
        sleep 3
        elapsed=$((elapsed + 3))
    done

    # Reload nginx to pick up new upstream
    docker exec owa-nginx nginx -s reload 2>/dev/null || warn "Nginx reload failed"

    success "Deploy complete"
}

# Verify deployment
verify() {
    log "Verifying deployment..."
    local checks=0
    local passed=0

    # Frontend
    ((checks++))
    if curl -sf --max-time 10 https://owawild.com/health >/dev/null 2>&1; then
        success "Frontend: OK"
        ((passed++))
    else
        error "Frontend: FAILED"
    fi

    # Backend API
    ((checks++))
    if curl -sf --max-time 10 https://owawild.com/api/ >/dev/null 2>&1; then
        success "Backend API: OK"
        ((passed++))
    else
        error "Backend API: FAILED"
    fi

    # HTTPS redirect
    ((checks++))
    if curl -sf --max-time 10 -I http://owawild.com 2>&1 | grep -q "301"; then
        success "HTTPS Redirect: OK"
        ((passed++))
    else
        warn "HTTPS Redirect: Check manually"
    fi

    # SSL
    ((checks++))
    if curl -sf --max-time 10 -I https://owawild.com 2>&1 | grep -q "200"; then
        success "SSL: OK"
        ((passed++))
    else
        warn "SSL: Check manually"
    fi

    log "Verification: $passed/$checks passed"
    [[ $passed -eq $checks ]] || error "Some checks failed"
}

# Cleanup old images
cleanup() {
    log "Cleaning up old images..."
    docker image prune -f --filter "until=24h" >/dev/null 2>&1 || true
    success "Cleanup done"
}

# Rollback function
rollback() {
    warn "Rolling back..."
    cd "$PROJECT_DIR"
    docker compose -f "$COMPOSE_FILE" down
    # Restore from latest backup if needed
    local latest_backup=$(ls -t "$BACKUP_DIR"/mongodb_*.gz 2>/dev/null | head -1)
    [[ -n "$latest_backup" ]] && log "Latest backup: $latest_backup"
    docker compose -f "$COMPOSE_FILE" up -d
    error "Rollback initiated - check manually"
}

# Main
main() {
    log "🚀 OWA Deploy - $ENVIRONMENT"
    log "Project: $PROJECT_DIR"

    check_requirements
    backup_db
    pull_images
    deploy
    verify
    cleanup

    success "🎉 Deploy successful!"
    log "🌐 https://owawild.com"
    log "📊 https://owawild.com/api/docs"
}

# Trap errors for rollback hint
trap 'error "Deploy failed! Run rollback manually if needed."' ERR

main "$@"