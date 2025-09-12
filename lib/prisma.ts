import { PrismaClient } from "@prisma/client";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Create Prisma Client with additional logging
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

// Only try to connect during runtime, not during build
if (
  process.env.NODE_ENV !== "production" ||
  process.env.NEXT_PHASE !== "phase-production-build"
) {
  try {
    console.log("Initializing Prisma client...");
    // Force a connection to test it, but don't block on it
    prisma
      .$connect()
      .then(() => {
        console.log("Prisma client connected successfully");
      })
      .catch((error) => {
        console.error("Failed to connect to the database:", error);
      });
  } catch (error) {
    console.error("Error initializing Prisma client:", error);
  }
}

// Add to global object in development
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
