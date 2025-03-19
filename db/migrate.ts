import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';
import { resolve } from 'path';

const { Pool } = pg;

async function main() {
  // 数据库连接配置
  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'fitness',
    password: 'password',
    database: 'fitness',
  });

  try {
    // 初始化drizzle
    const db = drizzle(pool);
    console.log('Running migrations...');
    
    // 执行迁移
    await migrate(db, { migrationsFolder: 'db/migrations' });
    
    console.log('Migrations completed!');
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main(); 