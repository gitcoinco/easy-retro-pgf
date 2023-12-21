export const mergeParams = (prev: object, next: object = {}) =>
  new URLSearchParams({ ...prev, ...next }).toString();
