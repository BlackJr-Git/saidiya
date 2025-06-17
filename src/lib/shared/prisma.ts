// lib/shared/prisma.ts

import { PrismaClient } from '../../generated/prisma'

// Cette approche est recommandée par Prisma pour éviter les problèmes de connexions multiples
// https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices

// PrismaClient est attaché à la variable globale en développement pour éviter
// de créer des connexions multiples pendant le hot reloading
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// Exporte une instance unique de PrismaClient pour toute l'application
export const prisma = globalForPrisma.prisma || new PrismaClient();

// Si on n'est pas en production, attache l'instance à la variable globale
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
