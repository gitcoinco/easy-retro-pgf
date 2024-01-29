import { useMutation } from "@tanstack/react-query";
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

export function useUploadMetadata() {
  return useMutation(async (data: Record<string, unknown> | File) => {
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
  });
}
