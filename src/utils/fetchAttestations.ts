import { ethers } from "ethers";
import { fromHex, type Address } from "viem";
import { config, eas, easApiEndpoints, type networks } from "~/config";
import { createCachedFetch } from "./fetch";

const fetch = createCachedFetch({ ttl: 1000 * 60 * 10 });

export type AttestationWithMetadata = {
  id: string;
  refUID: string;
  attester: Address;
  recipient: Address;
  revoked: boolean;
  time: number;
  decodedDataJson: string;
  schemaId: string;
};

export type Attestation = Omit<AttestationWithMetadata, "decodedDataJson"> & {
  name: string;
  metadataPtr: string;
};

type MatchFilter = { equals?: string; in?: string[]; gte?: number };
type MatchWhere = {
  id?: MatchFilter;
  attester?: MatchFilter;
  recipient?: MatchFilter;
  refUID?: MatchFilter;
  schemaId?: MatchFilter;
  time?: MatchFilter;
  decodedDataJson?: { contains: string };
  AND?: MatchWhere[];
};
type AttestationsFilter = {
  take?: number;
  skip?: number;
  orderBy?: {
    time?: "asc" | "desc";
  }[];
  where?: MatchWhere;
};

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

type PartialRound = {
  id: string | null;
  startsAt: Date | null;
  network: string | null;
};
export type AttestationFetcher = (
  schema: string[],
  filter?: AttestationsFilter,
) => Attestation[];
export function createAttestationFetcher(round: PartialRound) {
  return (schema: string[], filter?: AttestationsFilter) => {
    const startsAt = Math.floor(Number(round?.startsAt ?? new Date()) / 1000);
    const easURL = easApiEndpoints[round?.network as keyof typeof networks];
    if (!easURL) throw new Error("Round network not configured");

    return fetch<{ attestations: AttestationWithMetadata[] }>(easURL, {
      method: "POST",
      body: JSON.stringify({
        query: AttestationsQuery,
        variables: {
          ...filter,
          where: {
            schemaId: { in: schema },
            revoked: { equals: false },
            time: { gte: startsAt },
            ...filter?.where,
          },
        },
      }),
    }).then((r) => r.data?.attestations.map(parseAttestation));
  };
}

export async function fetchApprovedVoter(round: PartialRound, address: string) {
  // if (config.skipApprovedVoterCheck) return true;
  if (!round.id) throw new Error("Round ID must be defined");
  return createAttestationFetcher(round)([eas.schemas.approval], {
    where: {
      recipient: { equals: address },
      AND: [
        createDataFilter("type", "bytes32", "voter"),
        createDataFilter("round", "bytes32", round.id),
      ],
    },
  }).then((attestations) => attestations.length);
}

function parseAttestation({
  decodedDataJson,
  ...attestation
}: AttestationWithMetadata): Attestation {
  return { ...attestation, ...parseDecodedMetadata(decodedDataJson) };
}

type Metadata = {
  name: string;
  metadataPtr: string;
  round: string;
  type: string;
};
export function parseDecodedMetadata(json: string): Metadata {
  const data = JSON.parse(json) as { name: string; value: { value: string } }[];
  const metadata = data.reduce(
    (acc, x) => ({ ...acc, [x.name]: x.value.value }),
    {} as Metadata,
  );
  return {
    ...metadata,
    // type: parseBytes(metadata.type),
    // round: parseBytes(metadata.round),
  };
}

export const parseBytes = (hex: string) =>
  ethers.decodeBytes32String(fromHex(hex as Address, "bytes"));

export const formatBytes = (string: string) =>
  ethers.encodeBytes32String(string);

const typeMaps = {
  bytes32: (v: string) => formatBytes(v),
  string: (v: string) => v,
};

export function createSearchFilter(value: string) {
  const formatter = typeMaps.string;
  return {
    decodedDataJson: {
      contains: `${formatter(value)}`,
    },
  };
}

export function createDataFilter(
  name: string,
  type: "bytes32" | "string",
  value: string,
) {
  const formatter = typeMaps[type];
  return {
    decodedDataJson: {
      contains: `"name":"${name}","type":"${type}","value":"${formatter(
        value,
      )}`,
    },
  };
}
