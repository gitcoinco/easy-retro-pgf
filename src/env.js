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
    NEXT_PUBLIC_CHAIN_NAME: z.enum([
      "ethereum",
      "optimism",
      "optimismGoerli",
      "optimismSepolia",
      "optimismGoerli",
      "optimismSepolia",
      "arbitrum",
      "linea",
      "sepolia",
      "base",
      "baseGoerli",
      "localhost",
    ]),
    NEXT_PUBLIC_SIGN_STATEMENT: z.string().optional(),

    NEXT_PUBLIC_MAX_VOTES_TOTAL: z.string().default("150"),
    NEXT_PUBLIC_MAX_VOTES_PROJECT: z.string().default("50"),
    NEXT_PUBLIC_VOTING_END_DATE: z
      .string()
      .datetime()
      .default(new Date(Date.now() + 1000 * 3600 * 24 * 7).toISOString()),
    NEXT_PUBLIC_FEEDBACK_URL: z.string().default("#"),

    // EAS Schemas
    NEXT_PUBLIC_APPROVED_APPLICATIONS_SCHEMA: z
      .string()
      .default(
        "0xebbf697d5d3ca4b53579917ffc3597fb8d1a85b8c6ca10ec10039709903b9277",
      ),
    NEXT_PUBLIC_APPROVED_APPLICATIONS_ATTESTER: z
      .string()
      .default("0x621477dBA416E12df7FF0d48E14c4D20DC85D7D9"),
    NEXT_PUBLIC_APPLICATIONS_SCHEMA: z
      .string()
      .default(
        "0x76e98cce95f3ba992c2ee25cef25f756495147608a3da3aa2e5ca43109fe77cc",
      ),
    NEXT_PUBLIC_BADGEHOLDER_SCHEMA: z
      .string()
      .default(
        "0xfdcfdad2dbe7489e0ce56b260348b7f14e8365a8a325aef9834818c00d46b31b",
      ),
    NEXT_PUBLIC_BADGEHOLDER_ATTESTER: z
      .string()
      .default("0x621477dBA416E12df7FF0d48E14c4D20DC85D7D9"),
    NEXT_PUBLIC_PROFILE_SCHEMA: z
      .string()
      .default(
        "0xac4c92fc5c7babed88f78a917cdbcdc1c496a8f4ab2d5b2ec29402736b2cf929",
      ),
    NEXT_PUBLIC_LISTS_SCHEMA: z
      .string()
      .default(
        "0x3e3e2172aebb902cf7aa6e1820809c5b469af139e7a4265442b1c22b97c6b2a5",
      ),

    NEXT_PUBLIC_EAS_CONTRACT_ADDRESS: z
      .string()
      .default("0x4200000000000000000000000000000000000021"),

    NEXT_PUBLIC_EASSCAN_URL: z
      .string()
      .default("https://optimism.easscan.org/graphql"),

    NEXT_PUBLIC_ADMIN_ADDRESSES: z.string().startsWith("0x"),
    NEXT_PUBLIC_APPROVAL_SCHEMA: z.string().startsWith("0x"),
    NEXT_PUBLIC_METADATA_SCHEMA: z.string().startsWith("0x"),

    NEXT_PUBLIC_ROUND_ID: z.string(),
    NEXT_PUBLIC_WALLETCONNECT_ID: z.string().optional(),
    NEXT_PUBLIC_ALCHEMY_ID: z.string().optional(),

    NEXT_PUBLIC_SKIP_APPROVED_VOTER_CHECK: z.string(),

    NEXT_PUBLIC_MACI_ADDRESS: z.string().startsWith("0x"),
    NEXT_PUBLIC_MACI_START_BLOCK: z.string().optional(),

    NEXT_PUBLIC_TALLY_URL: z.string().url(),
    NEXT_PUBLIC_ALLO2_ADDRESS: z.string().startsWith("0x"),
    NEXT_PUBLIC_STRATEGY_ADDRESS: z.string().startsWith("0x").default(""),
    NEXT_PUBLIC_TOKEN_ADDRESS: z
      .string()
      .default("0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"),
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

    NEXT_PUBLIC_CHAIN_NAME: process.env.NEXT_PUBLIC_CHAIN_NAME,
    NEXT_PUBLIC_SIGN_STATEMENT: process.env.NEXT_PUBLIC_SIGN_STATEMENT,

    NEXT_PUBLIC_MAX_VOTES_TOTAL: process.env.NEXT_PUBLIC_MAX_VOTES_TOTAL,
    NEXT_PUBLIC_MAX_VOTES_PROJECT: process.env.NEXT_PUBLIC_MAX_VOTES_PROJECT,
    NEXT_PUBLIC_VOTING_END_DATE: process.env.NEXT_PUBLIC_VOTING_END_DATE,
    NEXT_PUBLIC_FEEDBACK_URL: process.env.NEXT_PUBLIC_FEEDBACK_URL,

    NEXT_PUBLIC_APPROVED_APPLICATIONS_SCHEMA:
      process.env.NEXT_PUBLIC_APPROVED_APPLICATIONS_SCHEMA,
    NEXT_PUBLIC_APPROVED_APPLICATIONS_ATTESTER:
      process.env.NEXT_PUBLIC_APPROVED_APPLICATIONS_ATTESTER,
    NEXT_PUBLIC_APPLICATIONS_SCHEMA:
      process.env.NEXT_PUBLIC_APPLICATIONS_SCHEMA,
    NEXT_PUBLIC_BADGEHOLDER_SCHEMA: process.env.NEXT_PUBLIC_BADGEHOLDER_SCHEMA,
    NEXT_PUBLIC_BADGEHOLDER_ATTESTER:
      process.env.NEXT_PUBLIC_BADGEHOLDER_ATTESTER,
    NEXT_PUBLIC_PROFILE_SCHEMA: process.env.NEXT_PUBLIC_PROFILE_SCHEMA,
    NEXT_PUBLIC_LISTS_SCHEMA: process.env.NEXT_PUBLIC_LISTS_SCHEMA,

    NEXT_PUBLIC_EAS_CONTRACT_ADDRESS:
      process.env.NEXT_PUBLIC_EAS_CONTRACT_ADDRESS,
    NEXT_PUBLIC_EASSCAN_URL: process.env.NEXT_PUBLIC_EASSCAN_URL,
    NEXT_PUBLIC_WALLETCONNECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_ID,
    NEXT_PUBLIC_ALCHEMY_ID: process.env.NEXT_PUBLIC_ALCHEMY_ID,
    NEXT_PUBLIC_SKIP_APPROVED_VOTER_CHECK:
      process.env.NEXT_PUBLIC_SKIP_APPROVED_VOTER_CHECK,

    NEXT_PUBLIC_ADMIN_ADDRESSES: process.env.NEXT_PUBLIC_ADMIN_ADDRESSES,
    NEXT_PUBLIC_APPROVAL_SCHEMA: process.env.NEXT_PUBLIC_APPROVAL_SCHEMA,
    NEXT_PUBLIC_METADATA_SCHEMA: process.env.NEXT_PUBLIC_METADATA_SCHEMA,

    NEXT_PUBLIC_ROUND_ID: process.env.NEXT_PUBLIC_ROUND_ID,

    NEXT_PUBLIC_MACI_ADDRESS: process.env.NEXT_PUBLIC_MACI_ADDRESS,
    NEXT_PUBLIC_MACI_START_BLOCK: process.env.NEXT_PUBLIC_MACI_START_BLOCK,

    NEXT_PUBLIC_TALLY_URL: process.env.NEXT_PUBLIC_TALLY_URL,
    NEXT_PUBLIC_ALLO2_ADDRESS: process.env.NEXT_PUBLIC_ALLO2_ADDRESS,
    NEXT_PUBLIC_STRATEGY_ADDRESS: process.env.NEXT_PUBLIC_STRATEGY_ADDRESS,
    NEXT_PUBLIC_TOKEN_ADDRESS: process.env.NEXT_PUBLIC_TOKEN_ADDRESS,
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
