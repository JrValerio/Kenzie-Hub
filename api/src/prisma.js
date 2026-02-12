import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;
const DATABASE_URL = globalThis.process?.env?.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error(
    "DATABASE_URL nao definido. Configure DATABASE_URL para conectar ao PostgreSQL."
  );
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: globalThis.process?.env?.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (globalThis.process?.env?.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
