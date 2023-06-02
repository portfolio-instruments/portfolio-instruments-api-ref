import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';
import { migrate as drizzleMigrate } from 'drizzle-orm/postgres-js/migrator';
import config from '../src/config';
import postgres from 'postgres';
import * as path from 'path';
import Logger from '../src/utils/Logger';

function getPostgresConnectionString(): string {
  return `postgresql://${config.DB_USER}:${config.DB_PASSWORD}@${config.DB_HOST}:${config.DB_PORT}/${config.DB_NAME}`;
}

async function migrate(): Promise<void> {
  try {
    const connectionString: string = getPostgresConnectionString();
    const migrationClient = postgres(connectionString, { max: 1 });
    const db: PostgresJsDatabase = drizzle(migrationClient);

    await drizzleMigrate(db, { migrationsFolder: path.resolve('.drizzle', 'migrations') });
    Logger.info('Migration completed successfully');
    process.exit();
  } catch (e) {
    const err = e as Error;
    Logger.error('Migration failed: ', err);
    process.exit();
  }
}

void migrate();
