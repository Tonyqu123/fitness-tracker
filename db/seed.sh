#!/bin/bash

# 数据库文件路径
DB_PATH="./.data/fitness.db"

echo "Seeding exercises data..."

# 检查exercises表是否已经有数据
EXERCISES_COUNT=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM exercises;")

if [ "$EXERCISES_COUNT" -eq "0" ]; then
  # 插入初始训练动作数据
  sqlite3 "$DB_PATH" <<EOF
  INSERT INTO exercises (id, name, category) VALUES 
    ('bench-press', '卧推', '胸部'),
    ('squat', '深蹲', '腿部'),
    ('deadlift', '硬拉', '背部'),
    ('pull-up', '引体向上', '背部'),
    ('shoulder-press', '肩推', '肩部'),
    ('barbell-row', '杠铃划船', '背部'),
    ('leg-press', '腿推', '腿部'),
    ('bicep-curl', '二头弯举', '手臂');
EOF
  
  echo "Inserted 8 exercises."
else
  echo "Exercises already seeded, skipping..."
fi

echo "Seeding completed!" 