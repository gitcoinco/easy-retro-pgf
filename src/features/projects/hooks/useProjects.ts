import { useMetadata } from "~/hooks/useMetadata";
import { api } from "~/utils/api";
import { type Application } from "~/features/applications/types";
import { useFilter } from "~/features/filter/hooks/useFilter";
import { SortOrder, type Filter } from "~/features/filter/types";
import { Attestation as EASAttestation } from "@ethereum-attestation-service/eas-sdk/dist/eas";
import { Attestation as CustomAttestation } from "~/utils/fetchAttestations";
import { shuffleProjects } from "~/utils/shuffleProjects";
export function useProjectById(id: string) {
  const query = api.projects.get.useQuery(
    { ids: [id] },
    { enabled: Boolean(id) },
  );

  return { ...query, data: query.data?.[0] };
}

export function useProjectsById(ids: string[]) {
  return api.projects.get.useQuery({ ids }, { enabled: Boolean(ids.length) });
}

export function useSearchProjects(filterOverride?: Partial<Filter>) {
  const { setFilter, isRandom, ...filter } = useFilter();
  const searching = filter.search && filterOverride?.search !== "";

  if (isRandom && !searching) {
    return api.projects.search.useQuery(
      {},
      {
        select: (data: CustomAttestation[]): EASAttestation[] => {
          const transformedData = data as unknown as EASAttestation[];
          return shuffleProjects(transformedData);
        },
      },
    );
  } else {
    return api.projects.search.useQuery({
      ...filter,
      // Override to allow searching for projects when random
      sortOrder: isRandom && searching ? SortOrder.asc : filter.sortOrder,
      ...filterOverride,
    });
  }
}

export function useProjectMetadata(metadataPtr?: string) {
  return useMetadata<Application>(metadataPtr);
}

export function useProjectCount() {
  return api.projects.count.useQuery();
}
