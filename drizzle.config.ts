import type { Config } from 'drizzle-kit';
import { resolve } from 'path';

export default {
  schema: './db/schema/schema.ts',
  out: './db/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: resolve(process.cwd(), '.data/fitness.db'),
  },
} satisfies Config; 