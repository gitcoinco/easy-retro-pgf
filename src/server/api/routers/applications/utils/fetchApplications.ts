import { z } from "zod";
import {
  createDataFilter,
  createSearchFilter,
  type AttestationFetcher,
} from "~/utils/fetchAttestations";
import { type MatchWhere } from "~/utils/fetchAttestations/types";

export const FilterSchema = z.object({
  ids: z.array(z.string()).optional(),
  search: z.string().optional(),
  status: z.enum(["pending", "approved", "rejected", "spam", "all"]).optional(),
  take: z.number().default(10),
  skip: z.number().default(0),
});

export async function fetchApplications({
  attestationFetcher,
  roundId,
  filter,
}: {
  attestationFetcher: AttestationFetcher;
  roundId: string;
  filter?: z.infer<typeof FilterSchema>;
}) {
  const AND: MatchWhere[] = [
    createDataFilter("type", "bytes32", "application"),
    createDataFilter("round", "bytes32", roundId),
  ];
  if (filter?.ids?.length) AND.push({ id: { in: filter.ids } });
  if (filter?.search) AND.push(createSearchFilter(filter.search));

  return attestationFetcher(["metadata"], {
    where: { AND },
    ...filter,
  });
}
