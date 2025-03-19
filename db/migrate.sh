#!/bin/bash

# 确保.data目录存在
mkdir -p .data

# 数据库文件路径
DB_PATH="./.data/fitness.db"

# 迁移文件路径
MIGRATION_FILE="./db/migrations/0001_create_tables.sql"

echo "Running migrations..."

# 使用SQLite CLI执行迁移文件
sqlite3 "$DB_PATH" < "$MIGRATION_FILE"

echo "Migrations completed!" 