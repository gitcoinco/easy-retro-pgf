// import { fetchBuilder, MemoryCache } from "node-fetch-cache";
import NodeFetchCache, { MemoryCache } from "node-fetch-cache";

export function createCachedFetch({ ttl = 1000 * 60 }) {
  const _fetch = NodeFetchCache.create({ cache: new MemoryCache({ ttl }) });

  return function fetch<T>(
    url: string,
    opts?: { method: "POST" | "GET"; body?: string },
  ) {
    return _fetch(url, {
      method: opts?.method ?? "GET",
      body: opts?.body,
      headers: { "Content-Type": "application/json" },
    }).then(async (r) => {
      if (!r.ok) {
        await r.ejectFromCache();
        throw new Error("Network error");
      }

      return (await r.json()) as { data: T; error: Error };
    });
  };
}
