import type { Config } from 'drizzle-kit';

export default {
  schema: './db/schema/schema.ts',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host: 'localhost',
    port: 5432,
    user: 'fitness',
    password: 'password',
    database: 'fitness',
  },
} satisfies Config; 