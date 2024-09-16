import {
  SchemaEncoder,
  SchemaRegistry,
  type SchemaValue,
  type AttestationRequest,
  type SchemaRecord,
} from "@ethereum-attestation-service/eas-sdk";
import { type Signer } from "ethers";

import { eas } from "~/config";

type Params = {
  values: Record<string, unknown>;
  schemaUID: string;
  recipient?: string;
  refUID?: string;
};

export async function createAttestation(
  params: Params,
  signer: Signer,
  contracts: typeof eas.contracts.default,
): Promise<AttestationRequest> {
  console.log("Getting recipient address");
  const recipient = params.recipient ?? (await signer.getAddress());

  const schemaRegistry = new SchemaRegistry(contracts.registry);
  console.log("Connecting signer to SchemaRegistry...");
  schemaRegistry.connect(signer);
  console.log("Getting schema record...", params.schemaUID);
  const schemaRecord = await schemaRegistry.getSchema({
    uid: params.schemaUID,
  });

  console.log("Encoding attestation data");
  const data = await encodeData(params, schemaRecord);

  return {
    schema: params.schemaUID,
    data: {
      recipient,
      expirationTime: 0n,
      revocable: true,
      data,
      refUID: params.refUID,
    },
  };
}

async function encodeData({ values }: Params, schemaRecord: SchemaRecord) {
  console.log("Getting schema record...");

  const schemaEncoder = new SchemaEncoder(schemaRecord.schema);

  console.log("Creating data to encode from schema record...");
  const dataToEncode = schemaRecord?.schema.split(",").map((param) => {
    const [type, name] = param.trim().split(" ");
    if (name && type && values) {
      const value = values[name] as SchemaValue;
      return { name, type, value };
    } else {
      throw new Error(
        `Attestation data: ${name} not found in ${JSON.stringify(values)}`,
      );
    }
  });

  console.log("Encoding data with schema...");
  return schemaEncoder.encodeData(dataToEncode);
}
