import { z } from "zod";
import { EthAddressSchema } from "~/features/distribute/types";

export const RoundNameSchema = z.string().max(50);

const RoundVotes = z.object({
  maxVotesTotal: z.number().nullable(),
  maxVotesProject: z.number().nullable(),
});

export const RoundVotesSchema = RoundVotes.refine(
  (schema) => (schema?.maxVotesTotal ?? 0) >= (schema?.maxVotesProject ?? 0),
  {
    path: ["maxVotesTotal"],
    message: "Total votes must be at least equal to votes per project",
  },
);

export const RoundSchema = z
  .object({
    id: z.string(),
    name: RoundNameSchema,
    domain: z.string(),
    admins: z.array(EthAddressSchema),
    description: z.string().nullable(),
    network: z.string().nullable(),
    tokenAddress: EthAddressSchema.nullable(),
    startsAt: z.date().nullable(),
    reviewAt: z.date().nullable(),
    votingAt: z.date().nullable(),
    resultAt: z.date().nullable(),
    payoutAt: z.date().nullable(),
    poolId: z.number().nullable(),
    calculation: z.record(z.string().or(z.number())).nullable(),
  })
  .merge(RoundVotes);

export type RoundSchema = z.infer<typeof RoundSchema>;
