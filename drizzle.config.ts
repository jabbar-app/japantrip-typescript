import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',         // ✅ path ke schema
  out: './drizzle/migrations',          // ✅ path ke folder output migration
  dialect: 'mysql',                     // ✅ wajib
  dbCredentials: {
    host: process.env.MYSQL_HOST!,
    port: 3306,
    user: process.env.MYSQL_USER!,
    password: process.env.MYSQL_PASSWORD!,
    database: process.env.MYSQL_DATABASE!,
  },
} satisfies Config;
