import { type JsonRpcSigner } from "ethers";
import {
  EAS,
  type TransactionSigner,
} from "@ethereum-attestation-service/eas-sdk";

import * as config from "~/config";

export function createEAS(signer: JsonRpcSigner, network: string): EAS {
  console.log("Creating EAS instance");
  const contracts = getContracts(network);

  const eas = new EAS(contracts.eas);

  console.log(contracts);
  console.log("Connecting signer to EAS");
  return eas.connect(signer as unknown as TransactionSigner);
}

export function getContracts(network: string) {
  return (
    config.eas.contracts[network as keyof typeof config.eas.contracts] ??
    config.eas.contracts.default
  );
}
