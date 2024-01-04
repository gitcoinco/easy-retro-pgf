export const reverseKeys = (obj: Record<string, string>) =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [v, k]));
