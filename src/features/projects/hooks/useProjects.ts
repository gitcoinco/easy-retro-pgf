import { useMetadata } from "~/hooks/useMetadata";
import { api } from "~/utils/api";
import { type Application } from "~/features/applications/types";
import { useFilter } from "~/features/filter/hooks/useFilter";
import { SortOrder, type Filter } from "~/features/filter/types";
import { type Attestation as EASAttestation } from "@ethereum-attestation-service/eas-sdk/dist/eas";
import { type Attestation as CustomAttestation } from "~/utils/fetchAttestations";
import { shuffleProjects } from "~/utils/shuffleProjects";
import { convertAndDownload } from "~/utils/csv";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { type RoundId, roundsMap } from "~/config";
import { useRoundProjects } from "~/hooks/useRoundProjects";
export function useProjectById(id: string, startsAt?: number) {
  const query = api.projects.get.useQuery(
    { ids: [id], startsAt },
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
      {
        round: roundsMap[filter.round as keyof typeof roundsMap],
      },
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
      round: roundsMap[filter.round as keyof typeof roundsMap],
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
  const { round } = useFilter();

  const roundId = roundsMap[round as keyof typeof roundsMap] as RoundId;

  const { data, isLoading } = useRoundProjects({
    round: roundId,
  });

  const preparedData = useMemo(() => {
    if (isLoading || !data) return [];

    return shuffleProjects(data);
  }, [data]);

  const downloadMetadata = () => {
    if (!data || preparedData.length === 0) return;
    convertAndDownload({
      data: preparedData,
      round: roundId,
    });
  };

  return {
    downloadMetadata,
    isLoading: isLoading,
    count: data?.length,
  };
}

export function useDecryption(iv: string, data: string) {
  const decrypt = api.encryption.decrypt.useMutation();
  const query = useQuery({
    queryKey: ["decryption", iv, data],
    queryFn: async () => {
      const result = await decrypt.mutateAsync({ iv, data });
      return result.decrypted;
    },
    enabled: Boolean(iv && data),
  });
  return {
    decryptedData: query.data,
    error: query.error,
    isLoading: query.isLoading,
  };
}
