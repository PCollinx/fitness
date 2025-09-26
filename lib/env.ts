import { z } from "zod";

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),
  DIRECT_URL: z.string().url("DIRECT_URL must be a valid URL").optional(),

  // NextAuth
  NEXTAUTH_URL: z.string().url("NEXTAUTH_URL must be a valid URL"),
  NEXTAUTH_SECRET: z
    .string()
    .min(32, "NEXTAUTH_SECRET must be at least 32 characters"),

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),

  // Email (Optional)
  EMAIL_SERVER: z.string().optional(),
  EMAIL_PORT: z.string().optional(),
  EMAIL_USERNAME: z.string().optional(),
  EMAIL_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),

  // Environment
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  NEXT_PUBLIC_ENV: z.enum(["development", "production"]).default("development"),

  // Build flags
  SKIP_ENV_VALIDATION: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

let env: Env;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (process.env.SKIP_ENV_VALIDATION !== "true") {
    console.error("❌ Invalid environment variables:");
    console.error(error);
    process.exit(1);
  } else {
    console.warn("⚠️ Environment validation skipped");
    // Fallback for build-time when env vars aren't set
    env = {} as Env;
  }
}

export { env };
