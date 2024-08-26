import { useBatchMetadata, useMetadata } from "~/hooks/useMetadata";
import { api } from "~/utils/api";
import { type Application } from "~/features/applications/types";
import { useFilter } from "~/features/filter/hooks/useFilter";
import { SortOrder, type Filter } from "~/features/filter/types";
import { Attestation as EASAttestation } from "@ethereum-attestation-service/eas-sdk/dist/eas";
import { Attestation as CustomAttestation } from "~/utils/fetchAttestations";
import { shuffleProjects } from "~/utils/shuffleProjects";
import { convertAndDownload } from "~/utils/csv";
import { useMemo, useState } from "react";

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
  const { isRandom, ...filter } = useFilter();
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
      sortOrder:
        isRandom && searching ? SortOrder.asc : (filter.sortOrder as SortOrder),
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

export function useDownloadProjects() {
  const projs = api.projects.search.useQuery(
    {},
    {
      select: (data: CustomAttestation[]): EASAttestation[] => {
        const transformedData = data as unknown as EASAttestation[];
        return shuffleProjects(transformedData);
      },
    },
  );
  const attestations = useMemo(
    () => (projs.data ?? []) as unknown as CustomAttestation[],
    [projs],
  );
  const metadataPtrs = attestations.map(
    (attestation) => attestation.metadataPtr,
  );
  const [loading, setLoading] = useState(false);
  const { data, isLoading } = useBatchMetadata(metadataPtrs);

  const preparedData = useMemo(() => {
    if (isLoading || !data) return [];

    return data;
  }, [data]);

  // Function to initiate download
  const downloadMetadata = () => {
    if (!data || preparedData.length === 0) return;
    convertAndDownload(preparedData);
  };

  return {
    downloadMetadata,
    isLoading: isLoading || attestations.length === 0,
  };
}
