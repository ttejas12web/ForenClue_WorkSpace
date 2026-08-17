import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
import * as schema from './schema.ts';
import dotenv from 'dotenv';
dotenv.config();

declare global {
  var _postgresPool: pkg.Pool | undefined;
}

export const createPool = () => {
  if (!global._postgresPool) {
    global._postgresPool = new pkg.Pool({
      host: process.env.SQL_HOST,
      port: process.env.SQL_PORT ? parseInt(process.env.SQL_PORT) : 5432,
      user: process.env.SQL_ADMIN_USER,
      password: process.env.SQL_ADMIN_PASSWORD,
      database: process.env.SQL_DB_NAME,
      max: 10,
      connectionTimeoutMillis: 15000,
    });

    global._postgresPool.on('error', (err) => {
      console.error('Unexpected error on idle SQL pool client:', err);
    });
  }
  return global._postgresPool;
};

export const pool = createPool();

export const db = drizzle(pool, { schema });
