#!/bin/bash

# DeepNeed AI 自动备份脚本

set -e

# 配置
BACKUP_DIR="/backup"
RETENTION_DAYS=30
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="$BACKUP_DIR/$DATE"

# 创建备份目录
mkdir -p "$BACKUP_PATH"

echo "🔄 开始备份 - $(date)"

# 备份数据库
echo "📦 备份数据库..."
PGPASSWORD="$POSTGRES_PASSWORD" pg_dump \
    -h "$POSTGRES_HOST" \
    -U "$POSTGRES_USER" \
    -d "$POSTGRES_DB" \
    --no-password \
    --format=custom \
    --compress=9 \
    --file="$BACKUP_PATH/database.backup"

# 压缩备份文件
echo "🗜️ 压缩备份文件..."
cd "$BACKUP_DIR"
tar -czf "${DATE}.tar.gz" "$DATE"
rm -rf "$DATE"

# 清理旧备份
echo "🧹 清理旧备份..."
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete

echo "✅ 备份完成 - $(date)"
echo "📁 备份文件: $BACKUP_DIR/${DATE}.tar.gz" 