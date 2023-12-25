import { config, eas } from "~/config";
import { type Attestation } from "./fetchAttestations";

const query = `
  query Attestations($where: AttestationWhereInput) {
    attestations(where: $where) {
      id
      recipient
    }
  }
`;

export async function fetchApprovedVoter(address: string): Promise<boolean> {
  if (config.skipApprovedVoterCheck) return true;

  return fetch(eas.url, {
    method: "POST",
    body: JSON.stringify({
      query,
      variables: {
        where: {
          recipient: { equals: address },
          schemaId: { equals: eas.schemas.badgeholder },
          attester: { in: config.admins },
          revoked: { equals: false },
        },
      },
    }),
    headers: { "Content-Type": "application/json" },
  })
    .then(async (r) => {
      if (!r.ok) {
        throw new Error("Network error");
      }
      return r.json();
    })
    .then(
      (r: { data: { attestations: Attestation[] } }) =>
        r.data.attestations.length > 0,
    );
}
