import { type Address } from "viem";

export type AttestationFetcher = (
  schema: SchemaType[],
  filter?: AttestationsFilter,
) => Promise<Attestation[]>;

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
export type AttestationsFilter = {
  take?: number;
  skip?: number;
  orderBy?: {
    time?: "asc" | "desc";
  }[];
  where?: MatchWhere;
};

export type PartialRound = {
  id: string | null;
  startsAt: Date | null;
  network: string | null;
};

export type SchemaType = "approval" | "metadata";

export type Metadata = {
  name: string;
  metadataPtr: string;
  round: string;
  type: string;
};
