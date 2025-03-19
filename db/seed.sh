#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo "=============================="
echo -e "${YELLOW}开始填充训练动作数据${NC}"
echo "=============================="

# 检查PostgreSQL容器是否运行
if ! docker ps | grep -q postgres; then
  echo -e "${RED}错误: PostgreSQL容器未运行${NC}"
  echo "请先运行数据库容器: docker-compose up -d"
  exit 1
fi

# 运行数据库填充脚本
echo -e "${YELLOW}运行填充脚本...${NC}"
if npx tsx ./db/seed.ts; then
  echo -e "${GREEN}✓ 数据填充成功!${NC}"
else
  echo -e "${RED}✗ 数据填充失败!${NC}"
  exit 1
fi

echo "=============================="
exit 0 