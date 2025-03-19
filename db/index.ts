import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { resolve } from 'path';

// 初始化PostgreSQL连接池
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'fitness',
  password: 'password',
  database: 'fitness',
});

// 初始化Drizzle ORM
export const db = drizzle(pool);

// 关闭数据库连接的方法，用于在应用关闭时调用
export async function closeDb() {
  await pool.end();
}

// 导出一个获取数据库连接的函数，可用于服务器组件
export function getDb() {
  return db;
} 