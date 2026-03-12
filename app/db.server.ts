import { PrismaClient } from "@prisma/client";

declare global {
  var prismaGlobal: PrismaClient;
}

// Enhanced Prisma client with retry logic and connection handling
const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
};

if (process.env.NODE_ENV !== "production") {
  if (!global.prismaGlobal) {
    global.prismaGlobal = createPrismaClient();
  }
}

const prisma = global.prismaGlobal ?? createPrismaClient();

// Retry wrapper for database operations
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      // Check if it's a connection error that we should retry
      if (
        error instanceof Error &&
        (error.message.includes("Can't reach database server") ||
         error.message.includes("connection") ||
         error.message.includes("timeout") ||
         error.message.includes("ECONNREFUSED") ||
         error.message.includes("ENOTFOUND"))
      ) {
        if (attempt < maxRetries) {
          console.warn(`Database connection attempt ${attempt} failed, retrying in ${delay}ms...`, error.message);
          await new Promise(resolve => setTimeout(resolve, delay * attempt)); // Exponential backoff
          continue;
        }
      }

      // If it's not a connection error or we've exhausted retries, throw the error
      throw lastError;
    }
  }

  throw lastError!;
};

// Health check function for database connection
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    await withRetry(async () => {
      await prisma.$queryRaw`SELECT 1`;
    }, 2, 500);
    return true;
  } catch (error) {
    console.error("Database health check failed:", error);
    return false;
  }
};

// Enhanced session operations with retry logic
export const safeSessionOperations = {
  findUnique: async (args: any) => {
    return withRetry(() => prisma.session.findUnique(args));
  },

  findMany: async (args: any) => {
    return withRetry(() => prisma.session.findMany(args));
  },

  create: async (args: any) => {
    return withRetry(() => prisma.session.create(args));
  },

  update: async (args: any) => {
    return withRetry(() => prisma.session.update(args));
  },

  delete: async (args: any) => {
    return withRetry(() => prisma.session.delete(args));
  },
};

export default prisma;
