import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { resolve } from 'path';
import { existsSync, mkdirSync, readFileSync } from 'fs';

// 确保数据库文件目录存在
const dbDir = resolve(process.cwd(), '.data');
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

// 数据库文件路径
const dbPath = resolve(dbDir, 'fitness.db');
console.log(`Database path: ${dbPath}`);

// 初始化数据库连接
try {
  const sqlite = new Database(dbPath);
  const db = drizzle(sqlite);

  console.log('Running migrations...');
  
  // 读取SQL迁移文件
  const migrationSQL = readFileSync(resolve(process.cwd(), 'db/migrations/0001_create_tables.sql'), 'utf8');
  
  // 执行SQL语句
  sqlite.exec(migrationSQL);
  
  console.log('Migrations completed!');

  // 关闭数据库连接
  sqlite.close();
} catch (error) {
  console.error('Error during migration:', error);
  process.exit(1);
} 