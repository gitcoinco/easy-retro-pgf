import { type Address } from "viem";
import { eas } from "~/config";
import { createCachedFetch } from "./fetch";

const fetch = createCachedFetch({ ttl: 1000 * 60 * 10 });

type AttestationsFilter = {
  take?: number;
  skip?: number;
  where?: {
    id?: { equals?: string; in?: string[] };
    attester?: { equals: string };
    schemaId?: { in: string[] };
  };
};

export type AttestationWithMetadata = {
  id: string;
  refUID: string;
  attester: Address;
  recipient: string;
  revoked: boolean;
  decodedDataJson: string;
  schemaId: string;
};

const AttestationsQuery = `
  query Attestations($where: AttestationWhereInput, $take: Int, $skip: Int) {
    attestations(take: $take, skip: $skip, orderBy: { attester: desc }, where: $where) {
      id
      refUID
      decodedDataJson
      attester
      recipient
      revoked
      schemaId
      time
    }
  }
`;

export async function fetchAttestations(
  schema: string[],
  filter?: AttestationsFilter,
) {
  return fetch<{ attestations: AttestationWithMetadata[] }>(eas.url, {
    method: "POST",
    body: JSON.stringify({
      query: AttestationsQuery,
      variables: {
        ...filter,
        where: {
          schemaId: { in: schema },
          revoked: { equals: false },
          ...filter?.where,
        },
      },
    }),
  }).then((r) => r.data?.attestations);
}

export function parseDecodedJSON<T>(json: string): T {
  const data = JSON.parse(json) as { name: string; value: { value: string } }[];
  return data.reduce<T>(
    (acc, x) => ({ ...acc, [x.name]: x.value.value }),
    {} as T,
  );
}
