import { PrismaClient } from "@prisma/client";

// Helper to determine if the DATABASE_URL is valid
const isDatabaseUrlValid = (): boolean => {
  const url = process.env.DATABASE_URL;
  if (!url) return false;

  try {
    // Basic validation - must be a valid URL format
    new URL(url);
    return true;
  } catch (e) {
    console.error("Invalid DATABASE_URL format:", e);
    return false;
  }
};

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Create a dummy client for build time or when the URL is invalid
const createDummyClient = () => {
  console.warn(
    "Creating a dummy Prisma client (database operations will fail)"
  );
  // Return a proxy that logs errors instead of throwing them during build
  return new Proxy({} as PrismaClient, {
    get: (target, prop) => {
      if (prop === "$connect" || prop === "$disconnect") {
        return () => Promise.resolve();
      }

      // For any model access (user, account, etc.) return an object with mock methods
      return new Proxy(
        {},
        {
          get: (_, methodProp) => {
            // Return functions that log and reject for actual database operations
            return (..._args: any[]) => {
              console.error(
                `Database operation ${String(prop)}.${String(
                  methodProp
                )} attempted with invalid connection`
              );
              return Promise.reject(
                new Error(
                  `Database not connected: ${String(
                    methodProp
                  )} operation failed`
                )
              );
            };
          },
        }
      );
    },
  });
};

// Create the appropriate Prisma client based on environment and URL validity
export const prisma =
  globalForPrisma.prisma ||
  (isDatabaseUrlValid()
    ? new PrismaClient({
        log:
          process.env.NODE_ENV === "development"
            ? ["query", "error", "warn"]
            : ["error"],
      })
    : createDummyClient());

// Only try to connect during runtime, not during build
if (
  process.env.NODE_ENV !== "production" ||
  process.env.NEXT_PHASE !== "phase-production-build"
) {
  if (isDatabaseUrlValid()) {
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
  } else {
    console.warn(
      "DATABASE_URL is invalid or missing, skipping connection attempt"
    );
  }
}

// Add to global object in development
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
