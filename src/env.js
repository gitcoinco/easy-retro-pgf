import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL_URL ? z.string() : z.string().url(),
    ),

    POSTGRES_URL: z.string().url(),
    POSTGRES_PRISMA_URL: z.string().url(),
    POSTGRES_URL_NON_POOLING: z.string().url(),
    POSTGRES_USER: z.string(),
    POSTGRES_HOST: z.string(),
    POSTGRES_PASSWORD: z.string(),
    POSTGRES_DATABASE: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_SIGN_STATEMENT: z.string().optional(),
    NEXT_PUBLIC_FEEDBACK_URL: z.string().default("#"),

    NEXT_PUBLIC_EAS_CONTRACT_ADDRESS: z.string(),

    NEXT_PUBLIC_APPROVAL_SCHEMA: z.string().startsWith("0x"),
    NEXT_PUBLIC_METADATA_SCHEMA: z.string().startsWith("0x"),

    NEXT_PUBLIC_WALLETCONNECT_ID: z.string(),
    NEXT_PUBLIC_ALCHEMY_ID: z.string().optional(),

    NEXT_PUBLIC_ALLO2_ADDRESS: z.string().startsWith("0x"),
    NEXT_PUBLIC_STRATEGY_ADDRESS: z.string().startsWith("0x"),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    POSTGRES_URL: process.env.POSTGRES_URL,
    POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,
    POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING,
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_HOST: process.env.POSTGRES_HOST,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    POSTGRES_DATABASE: process.env.POSTGRES_DATABASE,

    NEXT_PUBLIC_SIGN_STATEMENT: process.env.NEXT_PUBLIC_SIGN_STATEMENT,

    NEXT_PUBLIC_FEEDBACK_URL: process.env.NEXT_PUBLIC_FEEDBACK_URL,

    NEXT_PUBLIC_EAS_CONTRACT_ADDRESS:
      process.env.NEXT_PUBLIC_EAS_CONTRACT_ADDRESS,
    NEXT_PUBLIC_WALLETCONNECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_ID,
    NEXT_PUBLIC_ALCHEMY_ID: process.env.NEXT_PUBLIC_ALCHEMY_ID,

    NEXT_PUBLIC_APPROVAL_SCHEMA: process.env.NEXT_PUBLIC_APPROVAL_SCHEMA,
    NEXT_PUBLIC_METADATA_SCHEMA: process.env.NEXT_PUBLIC_METADATA_SCHEMA,

    NEXT_PUBLIC_ALLO2_ADDRESS: process.env.NEXT_PUBLIC_ALLO2_ADDRESS,
    NEXT_PUBLIC_STRATEGY_ADDRESS: process.env.NEXT_PUBLIC_STRATEGY_ADDRESS,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
