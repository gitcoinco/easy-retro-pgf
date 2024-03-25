import {
  SchemaEncoder,
  SchemaRegistry,
  type SchemaValue,
  type AttestationRequest,
} from "@ethereum-attestation-service/eas-sdk";
import { type TransactionSigner } from "@ethereum-attestation-service/eas-sdk/dist/transaction";
import { type JsonRpcSigner } from "ethers";
import * as config from "~/config";

type Params = {
  values: Record<string, unknown>;
  schemaUID: string;
  recipient?: string;
  refUID?: string;
};

export async function createAttestation(
  params: Params,
  signer: JsonRpcSigner,
): Promise<AttestationRequest> {
  console.log("Getting recipient address");
  const recipient = params.recipient ?? (await signer.getAddress());

  console.log("Encoding attestation data");
  const data = await encodeData(params, signer);

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

async function encodeData(
  { values, schemaUID }: Params,
  signer: JsonRpcSigner,
) {
  const schemaRegistry = new SchemaRegistry(
    config.eas.contracts.schemaRegistry,
  );
  console.log("Connecting signer to SchemaRegistry...");
  schemaRegistry.connect(signer as unknown as TransactionSigner);

  console.log("Getting schema record...");
  const schemaRecord = await schemaRegistry.getSchema({ uid: schemaUID });

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
