import { config } from "~/config";
import { useMetadata } from "~/hooks/useMetadata";
import { api } from "~/utils/api";
import { type ListMetadata } from "../types";
import { useMemo } from "react";

export function useListById(id: string) {
  return api.lists.get.useQuery({ id }, { enabled: Boolean(id) });
}
export function useLists() {
  return api.lists.query.useInfiniteQuery(
    { limit: config.pageSize },
    {
      getNextPageParam: (_, pages) => pages.length + 1,
    },
  );
}

export function useListMetadata(metadataPtr?: string) {
  const metadata = useMetadata<ListMetadata>(metadataPtr);

  const listContent = useMemo(() => {
    return (
      metadata.data?.listContent.map((p) => {
        const { RPGF3_Application_UID, OPAmount, projectId, amount } =
          p as unknown as {
            RPGF3_Application_UID: string;
            OPAmount: number;
            projectId: string;
            amount: number;
          };
        return {
          projectId: RPGF3_Application_UID ?? projectId,
          amount: OPAmount ?? amount,
        };
      }) ?? []
    );
  }, [metadata.data]);

  if (metadata.data?.listContent) {
    metadata.data.listContent = listContent;
  }

  return metadata;
  //   if (metadata.data?.listContent) {
  //     console.log(metadata.data.listContent);
  //     // Map from RetroPGF3-specific data model to a more generic one
  // metadata.data.listContent = [...metadata.data.listContent].map((p) => {
  //   const { RPGF3_Application_UID, OPAmount, projectId, amount } =
  //     p as unknown as {
  //       RPGF3_Application_UID: string;
  //       OPAmount: number;
  //       projectId: string;
  //       amount: number;
  //     };
  //   return {
  //     projectId: RPGF3_Application_UID ?? projectId,
  //     amount: OPAmount ?? amount,
  //   };
  // });
  // }

  return metadata;
}
