import { easApiEndpoints, type networks } from "~/config";
import { getContracts } from "~/lib/eas/createEAS";
import { createCachedFetch } from "../fetch";

import type {
  Attestation,
  AttestationFetcher,
  AttestationsFilter,
  AttestationWithMetadata,
  PartialRound,
  SchemaType,
} from "./types";
import { parseDecodedMetadata } from "./parseDecodedMetadata";

const ONE_WEEK_IN_MS = 60 * 60 * 1000 * 24 * 7;
const TEN_MINUTES_IN_MS = 1000 * 60 * 10;

const fetch = createCachedFetch({ ttl: TEN_MINUTES_IN_MS });

const AttestationsQuery = `
  query Attestations($where: AttestationWhereInput, $orderBy: [AttestationOrderByWithRelationInput!], $take: Int, $skip: Int) {
    attestations(take: $take, skip: $skip, orderBy: $orderBy, where: $where) {
      id
      refUID
      decodedDataJson
      attester
      recipient
      revoked
      schemaId
      time
      time
    }
  }
`;

function parseAttestation({
  decodedDataJson,
  ...attestation
}: AttestationWithMetadata): Attestation {
  return { ...attestation, ...parseDecodedMetadata(decodedDataJson) };
}

export function createAttestationFetcher(
  round: PartialRound,
): AttestationFetcher {
  return (schema: SchemaType[], filter?: AttestationsFilter) => {
    const startsAt = Math.floor(
      Number(round?.startsAt ?? new Date()) / 1000 - ONE_WEEK_IN_MS,
    );
    const easURL = easApiEndpoints[round?.network as keyof typeof networks];
    if (!easURL) throw new Error("Round network not configured");

    const contracts = getContracts(String(round?.network));
    const schemas = schema.map((type) => contracts.schemas[type]);

    return fetch<{ attestations: AttestationWithMetadata[] }>(easURL, {
      method: "POST",
      body: JSON.stringify({
        query: AttestationsQuery,
        variables: {
          ...filter,
          where: {
            schemaId: { in: schemas },
            revoked: { equals: false },
            time: { gte: startsAt },
            ...filter?.where,
          },
        },
      }),
    }).then((r) => r.data?.attestations.map(parseAttestation));
  };
}
