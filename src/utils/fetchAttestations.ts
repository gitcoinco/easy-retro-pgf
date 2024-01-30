import { fromHex, type Address } from "viem";
import { config, eas } from "~/config";
import { createCachedFetch } from "./fetch";
import { ethers } from "ethers";

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

export async function fetchAttestations(
  schema: string[],
  filter?: AttestationsFilter,
) {
  const startsAt = Math.floor(+config.startsAt / 1000);

  return fetch<{ attestations: AttestationWithMetadata[] }>(eas.url, {
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
}

export async function fetchApprovedVoter(address: string) {
  if (config.skipApprovedVoterCheck) return true;
  return fetchAttestations([eas.schemas.approval], {
    where: {
      recipient: { equals: address },
      ...createDataFilter("type", "bytes32", "voter"),
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
  ethers.utils.parseBytes32String(fromHex(hex as Address, "bytes"));

export const formatBytes = (string: string) =>
  ethers.utils.formatBytes32String(string);

const typeMaps = {
  bytes32: (v: string) => formatBytes(v),
  string: (v: string) => v,
};

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
