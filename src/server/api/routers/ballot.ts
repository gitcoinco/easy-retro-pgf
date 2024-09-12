import { TRPCError } from "@trpc/server";
import { type Address, verifyTypedData, keccak256 } from "viem";
import { isAfter } from "date-fns";
import {
  type BallotPublish,
  BallotPublishSchema,
  BallotSchema,
  type Vote,
} from "~/features/ballot/types";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  protectedRoundProcedure,
} from "~/server/api/trpc";
import { ballotTypedData } from "~/utils/typedData";
import type { Prisma } from "@prisma/client";
import { sumBallot } from "~/features/ballot/hooks/useBallot";
import {
  createAttestationFetcher,
  fetchApprovedVoter,
} from "~/utils/fetchAttestations";
import { fetchVoterLimits } from "~/utils/fetchVoterLimits";

const defaultBallotSelect = {
  votes: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true,
  signature: true,
} satisfies Prisma.BallotSelect;

export const ballotRouter = createTRPCRouter({
  get: protectedProcedure.query(({ ctx }) => {
    const voterId = ctx.session.user.name!;
    const roundId = ctx.round?.id;
    return ctx.db.ballot
      .findFirst({
        select: defaultBallotSelect,
        where: { voterId, roundId },
      })
      .then((ballot) => ({
        ...ballot,
        votes: (ballot?.votes as Vote[]) ?? [],
      }));
  }),
  export: adminProcedure.mutation(({ ctx }) => {
    const roundId = ctx.round?.id;
    return ctx.db.ballot
      .findMany({ where: { publishedAt: { not: null }, roundId } })
      .then(async (ballots) => {
        // Get all unique projectIds from all the votes
        const projectIds = Object.keys(
          Object.fromEntries(
            ballots.flatMap((b) =>
              (b as unknown as { votes: Vote[] }).votes
                .map((v) => v.projectId)
                .map((n) => [n, n]),
            ),
          ),
        );
        const projectsById = await createAttestationFetcher(ctx.round)(
          ["metadata"],
          {
            where: { id: { in: projectIds } },
          },
        ).then((projects) =>
          Object.fromEntries(projects.map((p) => [p.id, p.name])),
        );
        return ballots.flatMap(({ voterId, signature, publishedAt, votes }) =>
          (votes as unknown as Vote[]).map(({ amount, projectId }) => ({
            voterId,
            signature,
            publishedAt,
            amount,
            projectId,
            project: projectsById?.[projectId],
          })),
        );
      });
  }),
  save: protectedRoundProcedure
    .input(BallotSchema)
    .mutation(async ({ input, ctx }) => {
      const voterId = ctx.session.user.name!;
      const roundId = ctx.round.id;

      const round = await ctx.db.round.findFirst({
        where: { id: roundId },
        select: {
          resultAt: true,
          maxVotesTotal: true,
          maxVotesProject: true,
        },
      });
      const ballot = await ctx.db.ballot.findFirst({
        where: {
          voterId,
          roundId,
        },
      });
      if (![round?.resultAt].every(Boolean)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Round not configured properly",
        });
      }

      if (round?.resultAt && isAfter(new Date(), round.resultAt)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Voting has ended" });
      }
      if (ballot?.publishedAt) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Ballot already published",
        });
      }

      return ballot
        ? ctx.db.ballot.update({
            select: defaultBallotSelect,
            where: { id: ballot?.id, roundId, voterId },
            data: input,
          })
        : ctx.db.ballot.create({
            data: { ...input, roundId, voterId },
          });
    }),
  publish: protectedRoundProcedure
    .input(BallotPublishSchema)
    .mutation(async ({ input, ctx }) => {
      const voterId = ctx.session?.user.name as Address;
      const roundId = ctx.round.id;
      const round = await ctx.db.round.findFirstOrThrow({
        where: { id: roundId },
        select: {
          resultAt: true,
          maxVotesTotal: true,
          maxVotesProject: true,
        },
      });
      const ballot = await ctx.db.ballot.findFirstOrThrow({
        where: {
          voterId,
          roundId,
        },
      });

      if (![round.resultAt, round.maxVotesTotal].every(Boolean)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Round not configured properly",
        });
      }

      if (isAfter(new Date(), round.resultAt!)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Voting has ended" });
      }

      if (ballot.publishedAt) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Ballot already published",
        });
      }
      const voterLimits = await fetchVoterLimits(ctx.round, voterId);

      if (!verifyBallotCount(ballot.votes as Vote[], voterLimits)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Ballot must have a maximum of ${voterLimits.maxVotesTotal} votes and ${voterLimits.maxVotesProject} per project.`,
        });
      }

      if (!(await fetchApprovedVoter(ctx.round, voterId))) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Voter is not approved",
        });
      }

      if (
        !(await verifyBallotHash(
          input.message.hashed_votes,
          ballot.votes as Vote[],
        ))
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Votes hash mismatch",
        });
      }
      const { signature } = input;
      if (!(await verifyBallotSignature({ ...input, address: voterId }))) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Signature couldn't be verified",
        });
      }

      return ctx.db.ballot.update({
        where: { id: ballot.id },
        data: { publishedAt: new Date(), signature },
      });
    }),
});

function verifyBallotCount(
  votes: Vote[],
  voterLimits: { maxVotesProject: number; maxVotesTotal: number },
) {
  const sum = sumBallot(votes);
  const validVotes = votes.every(
    (vote) => vote.amount <= voterLimits.maxVotesProject,
  );
  return sum <= voterLimits.maxVotesTotal && validVotes;
}

async function verifyBallotHash(hashed_votes: string, votes: Vote[]) {
  return hashed_votes === keccak256(Buffer.from(JSON.stringify(votes)));
}

async function verifyBallotSignature({
  address,
  signature,
  message,
  chainId,
}: { address: string } & BallotPublish) {
  return await verifyTypedData({
    ...ballotTypedData(chainId),
    address: address as Address,
    message,
    signature,
  });
}
