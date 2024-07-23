import { z } from "zod";

export const VoteSchema = z.object({
  projectId: z.string(),
  amount: z.number().min(0),
});

export const BallotSchema = z.object({
  votes: z.array(VoteSchema),
});

export const BallotPublishSchema = z.object({
  chainId: z.number(),
  signature: z.custom<`0x${string}`>(),
  message: z.object({
    total_votes: z.bigint(),
    project_count: z.bigint(),
    hashed_votes: z.string(),
  }),
});

export type Vote = z.infer<typeof VoteSchema>;
export type Ballot = z.infer<typeof BallotSchema>;
export type BallotPublish = z.infer<typeof BallotPublishSchema>;

export const AllocationSchema = z.object({
  id: z.string(),
  amount: z.number().min(0),
  locked: z.boolean().default(true),
});
export const BallotV2Schema = z.object({
  allocations: z.array(AllocationSchema),
});

export type Allocation = z.infer<typeof AllocationSchema>;
export type BallotV2 = z.infer<typeof BallotV2Schema>;
