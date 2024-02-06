import { createCachedFetch } from "./fetch";

// ipfs data never changes
const ttl = 2147483647;
const fetch = createCachedFetch({ ttl });

export async function fetchMetadata<T>(url: string) {
  const ipfsGateway =
    process.env.NEXT_PUBLIC_IPFS_GATEWAY ?? "https://dweb.link/ipfs/";

  if (!url.startsWith("http")) {
    url = `${ipfsGateway}${url}`;
  }

  return fetch<T>(url);
}
