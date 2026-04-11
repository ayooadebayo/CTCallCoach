import { PrismaClient } from '@prisma/client';

// Single shared Prisma client instance for the API process.
// See apps/api/src/db/schema/ for Prisma schema definitions.
// See apps/api/src/db/migrations/ for migration history.
// See apps/api/src/db/seeds/ for seeding scripts.

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env['NODE_ENV'] === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env['NODE_ENV'] !== 'production') {
  globalForPrisma.prisma = db;
}
