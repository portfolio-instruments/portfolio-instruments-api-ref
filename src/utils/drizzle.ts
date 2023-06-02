import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool, PoolConfig } from 'pg';
import config from '../config';
import * as userSchema from '../modules/user/schema/user.db.schema';

const poolConfig: PoolConfig = {
  host: config.DB_HOST,
  port: config.DB_PORT,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
};

const pool = new Pool(poolConfig);

const db = drizzle(pool, { schema: { ...userSchema } });
export default db;
