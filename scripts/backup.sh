#!/bin/bash
# OWA Automated Backup Script
# Add to crontab: 0 3 * * * /opt/owa/scripts/backup.sh

set -euo pipefail

BACKUP_DIR="/opt/owa/backups"
DB_NAME="${DB_NAME:-owa_db}"
RETENTION_DAYS=30
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/mongodb_${DB_NAME}_${DATE}.gz"

mkdir -p "$BACKUP_DIR"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

log "Starting MongoDB backup..."

# Create backup
if docker exec owa-mongodb mongodump --archive --gzip --db="$DB_NAME" > "$BACKUP_FILE" 2>/dev/null; then
    SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    log "✅ Backup created: $BACKUP_FILE ($SIZE)"
else
    log "❌ Backup failed"
    exit 1
fi

# Cleanup old backups
log "Cleaning backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -name "mongodb_${DB_NAME}_*.gz" -mtime +$RETENTION_DAYS -delete
REMAINING=$(ls -1 "$BACKUP_DIR"/mongodb_${DB_NAME}_*.gz 2>/dev/null | wc -l)
log "📦 $REMAINING backups retained"

log "Backup complete"