import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { resolve } from 'path';
import { existsSync, mkdirSync } from 'fs';

// 确保数据库文件目录存在
const dbDir = resolve(process.cwd(), '.data');
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

// 数据库文件路径
const dbPath = resolve(dbDir, 'fitness.db');

// 初始化数据库连接
const sqlite = new Database(dbPath);
export const db = drizzle(sqlite);

// 关闭数据库连接的方法，用于在应用关闭时调用
export function closeDb() {
  sqlite.close();
}

// 导出一个获取数据库连接的函数，可用于服务器组件
export function getDb() {
  return db;
} 