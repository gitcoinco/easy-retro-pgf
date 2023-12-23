import { config, eas } from "~/config";
import { type Attestation } from "~/features/projects/types";

const query = `
  query Attestations($where: AttestationWhereInput) {
    attestations(where: $where) {
      id
      recipient
    }
  }
`;

export async function fetchApprovedVoter(address: string) {
  return fetch(eas.url, {
    method: "POST",
    body: JSON.stringify({
      query,
      variables: {
        where: {
          recipient: { equals: address },
          schemaId: { equals: eas.schemas.badgeholder },
          attester: { in: eas.admins },
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
        config.skipApprovedVoterCheck ?? r.data.attestations.length > 0,
    );
}
