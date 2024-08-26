import { useMutation } from "@tanstack/react-query";
import { Application } from "~/features/applications/types";
import { api } from "~/utils/api";

export function useMetadata<T>(metadataPtr?: string) {
  const query = api.metadata.get.useQuery(
    { metadataPtr: String(metadataPtr) },
    { enabled: Boolean(metadataPtr) },
  );

  return {
    ...query,
    data: query.data as T,
  };
}

export function useBatchMetadata(metadataPtrs?: string[]) {
  // Utilize the trpc hook generated based on the 'getBatch' procedure defined in your tRPC router
  const query = api.metadata.getBatch.useQuery(
    { metadataPtrs: metadataPtrs??[].map(metadataPtr => String(metadataPtr)) },
    { enabled: Boolean(metadataPtrs) },
  );
  return {
    ...query,
    data: query.data as unknown as Application[] | undefined,
  };
}

export function useUploadMetadata() {
  return useMutation({
    mutationFn: async (data: Record<string, unknown> | File) => {
      const formData = new FormData();

      if (!(data instanceof File)) {
        const blob = new Blob([JSON.stringify(data)], {
          type: "application/json",
        });
        data = new File([blob], "metadata.json");
      }

      formData.append("file", data);
      return fetch(`/api/blob?filename=${data.name}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data,
      }).then(async (r) => {
        if (!r.ok) throw new Error("Network error");
        return (await r.json()) as { url: string };
      });
    },
  });
}
