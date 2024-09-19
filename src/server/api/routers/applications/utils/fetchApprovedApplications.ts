import type { Round } from "@prisma/client";
import {
  createDataFilter,
  type AttestationFetcher,
} from "~/utils/fetchAttestations";
import { fetchApplications } from "./fetchApplications";
import { fetchApprovals } from "./fetchApprovals";
import { possibleSpamIds } from "public/possibleSpamIds";
import { THE_SUNNYS_ROUND_ID } from "~/roundIDs";

export async function fetchApprovedApplications({
  attestationFetcher,
  round,
}: {
  attestationFetcher: AttestationFetcher;
  round: Round;
}) {
  const { id: roundId } = round;

  if (roundId === THE_SUNNYS_ROUND_ID) {
    const approvedApplications = await attestationFetcher(
      ["metadata"],
      {
        where: {
          AND: [
            createDataFilter("type", "bytes32", "application"),
            createDataFilter("round", "bytes32", roundId),
            { id: { not: { in: possibleSpamIds } } },
          ],
        },
      },
      ["id", "decodedDataJson", "recipient"],
    );
    return approvedApplications;
  } else {
    const approvedApplicationsIds = await fetchApprovals({ round }).then(
      (approvedApplicationsAttestations) =>
        approvedApplicationsAttestations.map(
          (attestation) => attestation.refUID,
        ),
    );

    const applications = await fetchApplications({
      attestationFetcher,
      roundId,
    });

    const approvedApplications = applications.filter((application) =>
      approvedApplicationsIds.includes(application.id),
    );

    return approvedApplications;
  }
}
