import { z } from "zod";
import {
  createDataFilter,
  createSearchFilter,
  type AttestationFetcher,
} from "~/utils/fetchAttestations";

export const FilterSchema = z.object({
  ids: z.array(z.string()).optional(),
  search: z.string().optional(),
  status: z.enum(["pending", "all"]).optional(),
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
  filter: z.infer<typeof FilterSchema>;
}) {
  return attestationFetcher(["metadata"], {
    orderBy: [{ time: "desc" }],
    where: {
      AND: [
        { id: { in: filter.ids } },
        createDataFilter("type", "bytes32", "application"),
        createDataFilter("round", "bytes32", roundId),
        ...(filter.search ? [createSearchFilter(filter.search)] : []),
      ],
    },
    ...filter,
  });
}
