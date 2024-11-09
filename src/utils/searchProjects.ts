import type { z } from "zod";

import {
  fetchAttestations,
  createDataFilter,
  createSearchFilter,
} from "~/utils/fetchAttestations";
import { eas, filecoinRounds, getStartsAt } from "~/config";
import type { Filter } from "~/features/filter/types";
import { createOrderBy } from "./createOrderBy";

export const searchProjects = async (input: Filter) => {
  const startsAt = +getStartsAt(input.round) / 1000;

  const filters = [
    createDataFilter("type", "bytes32", "application"),
    createDataFilter("round", "bytes32", input.round),
  ];

  if (input.search) {
    filters.push(createSearchFilter(input.search));
  }

  return fetchAttestations(
    [eas.schemas.approval],
    {
      where: {
        attester: {
          in: filecoinRounds[input.round as keyof typeof filecoinRounds],
        },
        ...createDataFilter("type", "bytes32", "application"),
      },
    },
    startsAt,
  ).then((attestations = []) => {
    const approvedIds = attestations
      .map(({ refUID }) => refUID)
      .filter(Boolean);

    return fetchAttestations(
      [eas.schemas.metadata],
      {
        take: input.limit,
        skip: input.cursor * input.limit,
        orderBy: [createOrderBy(input.orderBy, input.sortOrder)],
        where: {
          id: { in: approvedIds },
          AND: filters,
        },
      },
      startsAt,
    );
  });
};
