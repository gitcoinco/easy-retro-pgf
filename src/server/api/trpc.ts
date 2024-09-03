/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */

import type { Round } from "@prisma/client";
import { initTRPC, TRPCError } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import type { NextApiRequest, NextApiResponse } from "next";
import { type Session } from "next-auth";
import superjson from "superjson";
import { ZodError } from "zod";
import { env } from "~/env";
import type { RoundTypes } from "~/features/rounds/types";

import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";
import {
  type AttestationFetcher,
  createAttestationFetcher,
} from "~/utils/fetchAttestations";
import { hashApiKey } from "~/utils/hashApiKey";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 */

export interface CreateContextOptions {
  session: Session | null;
  domain?: string;
  round?: Round;
  // round?: {
  //   id: string;
  //   admins: string[];
  //   network: string | null;
  //   type: string | null;
  //   startsAt: Date | null;
  //   reviewAt: Date | null;
  //   votingAt: Date | null;
  //   resultAt: Date | null;
  //   payoutAt: Date | null;
  // } | null;
  res: NextApiResponse;
  fetchAttestations?: AttestationFetcher;
}

/**
 * This helper generates the "internals" for a tRPC context. If you need to use it, you can export
 * it from here.
 *
 * Examples of things you may need it for:
 * - testing, so we don't have to mock Next.js' req/res
 * - tRPC's `createSSGHelpers`, where we don't have req/res
 *
 * @see https://create.t3.gg/en/usage/trpc#-serverapitrpcts
 */
const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    ...opts,
    session: opts.session,
    db,
    res: opts.res,
  };
};

/**
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  // Get the session from the server using the getServerSession wrapper function
  const session =
    (await getServerAuthSession({ req, res })) || (await getApiKeySession(req));

  // If the request is not from a trusted site, and there is no session, throw an error
  if (!isSameSiteRequest(req) && !session) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
  }
  // Get the current round domain
  const domain = req.headers["round-id"] as string;

  return createInnerTRPCContext({ session, res, domain });
};

/**
 * Check if calling site is trusted. Otherwise an API key is required.
 * Note: this is only a soft security check because any client could forge the headers.
 * It's just a failsafe to prevent random people from using the API.
 * If we want to harden this, we could use CSRF tokens.
 */
const trustedSites = [
  ...[process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL].map(
    (url) => `https://${url}`,
  ),
  process.env.NEXTAUTH_URL,
];
function isSameSiteRequest(req: NextApiRequest) {
  const origin = req.headers.origin ?? req.headers.referer;
  return origin && trustedSites.some((url) => origin.startsWith(url!));
}

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/** Reusable middleware that enforces users are logged in before running the procedure. */
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

const roundMiddleware = t.middleware(async ({ ctx, next }) => {
  // TODO: should really be replaced with roundId
  const domain = ctx.domain;

  if (!domain)
    throw new TRPCError({ code: "BAD_REQUEST", message: "Domain is required" });

  const round = await ctx.db.round.findFirst({
    where: { domain },
    select: {
      id: true,
      admins: true,
      network: true,
      type: true,
      startsAt: true,
      reviewAt: true,
      votingAt: true,
      resultAt: true,
      calculationConfig: true,
      calculationType: true,
      payoutAt: true,
      maxVotesProject: true,
      maxVotesTotal: true,
      metrics: true,
    },
  });

  if (!round)
    throw new TRPCError({ code: "NOT_FOUND", message: "Round not found" });

  return next({ ctx: { ...ctx, round: round as Round } });
});

const attestationMiddleware = t.middleware(async ({ ctx, next }) => {
  if (!ctx.round)
    throw new TRPCError({ code: "BAD_REQUEST", message: "No round found" });

  return next({
    ctx: {
      ...ctx,
      round: ctx.round,
      fetchAttestations: createAttestationFetcher(ctx.round),
    },
  });
});

const enforceUserIsAdmin = t.middleware(({ ctx, next }) => {
  const address = ctx.session?.user.name as `0x${string}`;
  if (!ctx.round?.admins.includes(address)) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Must be admin to access this route",
    });
  }
  return next({ ctx });
});

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure;

/**
 * Public Procedure that uses roundMiddleware to add round data to the context.
 *
 * This procedure is accessible to anyone and includes the round data in the context,
 * allowing the handling of round-specific logic.
 */
export const roundProcedure = publicProcedure.use(roundMiddleware);

/**
 * Public Procedure that uses roundMiddleware to add round data to the context,
 * and attestationMiddleware to add attestation data to the context.
 *
 * This procedure is accessible to anyone and includes both round and attestation data
 * in the context, allowing the handling of more complex logic involving attestations.
 */
export const attestationProcedure = publicProcedure
  .use(roundMiddleware)
  .use(attestationMiddleware);

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);

/**
 * Protected Procedure that uses roundMiddleware to add round data to the context.
 *
 * This procedure is accessible only to authenticated users and includes the round data in the context,
 * allowing the handling of round-specific logic for authenticated users.
 */
export const protectedRoundProcedure = protectedProcedure.use(roundMiddleware);

/**
 * Protected Procedure that uses roundMiddleware to add round data to the context and ballot data.
 *
 * This procedure is accessible only to authenticated users and includes both round and ballot data
 * in the context, allowing the handling of more complex logic involving ballots.
 */
export const ballotProcedure = protectedProcedure.use(roundMiddleware).use(
  t.middleware(async ({ ctx, next }) => {
    const voterId = ctx.session?.user.name!;
    const roundId = ctx.round?.id!;
    const type = ctx.round?.type as RoundTypes;

    // Find or create ballot
    const ballot = await ctx.db.ballotV2.upsert({
      where: { voterId_roundId_type: { voterId, roundId, type } },
      update: {},
      create: { voterId, roundId, type },
      include: { allocations: true },
    });
    return next({
      ctx: { ...ctx, voterId, roundId, ballotId: ballot.id, ballot },
    });
  }),
);

/**
 * Protected procedure combining ballot and attestation middleware.
 *
 * This procedure is accessible only to authenticated users and enriches the context with
 * round, ballot, and attestation data. It supports complex logic that requires access
 * to user ballots and related attestations within the current round.
 */
export const ballotAttestationProcedure = ballotProcedure.use(
  attestationMiddleware,
);

/**
 * Protected Procedure that uses enforceUserIsAdmin to ensure the user is an admin,
 * and roundMiddleware to add round data to the context.
 *
 * This procedure is accessible only to authenticated users who are also admins, and includes
 * the round data in the context, allowing the handling of admin-specific logic for the round.
 */
export const adminProcedure = protectedProcedure
  // This order is important!
  .use(roundMiddleware)
  .use(enforceUserIsAdmin);

/**
 * Protected Procedure that uses enforceUserIsAdmin to ensure the user is an admin,
 * roundMiddleware to add round data to the context, and attestationMiddleware to add attestation data.
 *
 * This procedure is accessible only to authenticated users who are also admins, and includes both
 * round and attestation data in the context, allowing the handling of admin-specific logic involving
 * attestations.
 */
export const adminAttestationProcedure = protectedProcedure
  // This order is important!
  .use(roundMiddleware)
  .use(enforceUserIsAdmin)
  .use(attestationMiddleware);

/**
 * Helper function to validate the API key and retrieve the corresponding session.
 *
 * @param req - Request object containing the API key in header.
 * @returns The session if the API key is valid, otherwise null.
 */
export async function getApiKeySession(req: NextApiRequest) {
  const apiKey = req.headers["x-api-key"] as string;
  if (!apiKey) return null;

  // Find API key
  const key = await db.apiKey.findFirst({ where: { key: hashApiKey(apiKey) } });

  // Return a session with the admin user who created the API key
  if (key?.creatorId) return { user: { name: key.creatorId } } as Session;

  return null;
}
