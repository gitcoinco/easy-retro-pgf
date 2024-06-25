import { createHash } from "crypto";

export function hashApiKey(apiKey: string) {
  return createHash("sha256").update(apiKey).digest("hex");
}
