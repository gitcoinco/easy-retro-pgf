import { Attestation } from "~/utils/fetchAttestations";
import { fetchMetadata } from "~/utils/fetchMetadata";

export type PayoutAddresses = Record<string, string>;

export async function getPayoutAddressesFromAttestations(
  attestations: Attestation[],
): Promise<PayoutAddresses> {
  return Promise.all(
    attestations.map((attestation) =>
      fetchMetadata(attestation.metadataPtr).then((data) => {
        const { payoutAddress } = data as unknown as {
          payoutAddress: string;
        };

        console.log({ payoutAddress });
        return { projectId: attestation.id, payoutAddress };
      }),
    ),
  ).then((projects) =>
    projects.reduce(
      (acc, x) => ({ ...acc, [x.projectId]: x.payoutAddress }),
      {} as PayoutAddresses,
    ),
  );
}
