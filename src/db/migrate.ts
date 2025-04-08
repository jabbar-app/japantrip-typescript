import { migrate } from 'drizzle-orm/mysql2/migrator';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

(async () => {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });

  const db = drizzle(connection);

  console.log('🚀 Running migrations...');
  await migrate(db, { migrationsFolder: './drizzle/migrations' });
  console.log('✅ Migrations applied successfully!');

  process.exit(0);
})();
