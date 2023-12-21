import { type Address } from "viem";

import { useQuery } from "@tanstack/react-query";
import { type Attestation } from "~/features/projects/types";
import { eas } from "~/config";

const query = `
  query Attestations($where: AttestationWhereInput) {
    attestations(where: $where) {
      id
      recipient
    }
  }
`;

export function useBadgeHolder(address: Address) {
  return useQuery(
    ["badgeholder", address],
    () =>
      fetch(eas.url, {
        method: "POST",
        body: JSON.stringify({
          query,
          variables: {
            where: {
              recipient: { equals: address },
              schemaId: { equals: eas.schemas.badgeholderSchema },
              attester: { equals: eas.schemas.badgeholderAttester },
            },
          },
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(async (r) => {
          if (!r.ok) {
            throw new Error("Network error");
          }
          return r.json();
        })
        .then((r: { data: { attestations: Attestation[] } }) =>
          process.env.NEXT_PUBLIC_SKIP_BADGEHOLDER_CHECK
            ? [true]
            : r.data.attestations,
        ),
    { enabled: Boolean(address) },
  );
}
