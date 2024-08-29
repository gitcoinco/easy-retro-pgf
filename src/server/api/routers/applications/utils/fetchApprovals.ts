import type { Round } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import {
  createAttestationFetcher,
  createDataFilter,
} from "~/utils/fetchAttestations";

export async function fetchApprovals({
  round,
  projectIds,
  includeRevoked = false,
  noCache = false,
}: {
  round: Round;
  projectIds?: string[];
  includeRevoked?: boolean;
  noCache?: boolean;
}) {
  if (!round)
    throw new TRPCError({ code: "BAD_REQUEST", message: "No round found" });

  const { id: roundId, admins } = round;

  const attestationFetcher = createAttestationFetcher({
    round,
    includeRevoked,
    noCache,
  });

  const approvals = await attestationFetcher(["approval"], {
    where: {
      attester: { in: admins },
      refUID: projectIds ? { in: projectIds } : undefined,
      AND: [
        createDataFilter("type", "bytes32", "application"),
        createDataFilter("round", "bytes32", roundId),
      ],
    },
  });
  return approvals;
}
