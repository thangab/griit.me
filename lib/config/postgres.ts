import { Pool } from 'pg';

const globalForPostgres = globalThis as typeof globalThis & {
  griitPostgresPool?: Pool;
};

function createPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('Missing DATABASE_URL environment variable.');
  }

  const isLocal = /localhost|127\.0\.0\.1/.test(connectionString);
  return new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 8_000,
    ssl: isLocal ? undefined : { rejectUnauthorized: false },
  });
}

export function getPostgresPool() {
  if (!globalForPostgres.griitPostgresPool) {
    globalForPostgres.griitPostgresPool = createPool();
  }
  return globalForPostgres.griitPostgresPool;
}
