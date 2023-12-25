import { fromHex, type Address } from "viem";
import { eas } from "~/config";
import { createCachedFetch } from "./fetch";
import { ethers } from "ethers";

const fetch = createCachedFetch({ ttl: 1000 * 60 * 10 });

export type AttestationWithMetadata = {
  id: string;
  refUID: string;
  attester: Address;
  recipient: string;
  revoked: boolean;
  decodedDataJson: string;
  schemaId: string;
};

export type Attestation = Omit<AttestationWithMetadata, "decodedDataJson"> & {
  name: string;
  metadataPtr: string;
};

type AttestationsFilter = {
  take?: number;
  skip?: number;
  where?: {
    id?: { equals?: string; in?: string[] };
    attester?: { in: string[] };
    schemaId?: { in: string[] };
    decodedDataJson?: { contains: string };
  };
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
  }).then((r) => r.data?.attestations.map(parseAttestation));
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
};

export function createDataFilter(name: string, type: "bytes32", value: string) {
  const formatter = typeMaps[type];
  return {
    decodedDataJson: {
      contains: `"name":"${name}","type":"${type}","value":"${formatter(
        value,
      )}"}`,
    },
  };
}
