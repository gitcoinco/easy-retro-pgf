import * as config from "~/config";

export function getEASAddress(): string {
  return config.eas.contracts.eas;
}
