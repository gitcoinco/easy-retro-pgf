import {
  EAS,
  SchemaEncoder,
  SchemaRegistry,
  type SchemaValue,
} from "@ethereum-attestation-service/eas-sdk";
import { type SignerOrProvider } from "@ethereum-attestation-service/eas-sdk/dist/transaction";
import { type Signer } from "ethers";

const EASContractAddress =
  process.env.NEXT_PUBLIC_EAS_CONTRACT_ADDRESS ??
  "0x4200000000000000000000000000000000000021";

const SchemaRegistryContractAddress =
  process.env.NEXT_PUBLIC_EAS_SCHEMA_REGISTRY_ADDRESS ??
  "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0";

export async function createAttestation(
  { values, schemaUID }: { values: Record<string, unknown>; schemaUID: string },
  signer: SignerOrProvider,
) {
  console.log("Creating EAS instance...");

  const eas = new EAS(EASContractAddress);
  console.log("Connecting signer to EAS...");
  eas.connect(signer);

  const schemaRegistry = new SchemaRegistry(SchemaRegistryContractAddress);
  console.log("Connecting signer to SchemaRegistry...");
  schemaRegistry.connect(signer);

  console.log("Getting schema record...");
  const schemaRecord = await schemaRegistry.getSchema({ uid: schemaUID });
  const schemaEncoder = new SchemaEncoder(schemaRecord.schema);

  console.log("Creating data to encode from schema record...");
  const dataToEncode = schemaRecord?.schema.split(",").map((param) => {
    const [name, type] = param.split(" ");
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
  const data = schemaEncoder.encodeData(dataToEncode);

  console.log("Getting recipient address...");
  const recipient = await (signer as unknown as Signer).getAddress();
  console.log({ recipient });

  console.log("Creating attestation...");
  const tx = await eas.attest({
    schema: schemaUID,
    data: { recipient, expirationTime: 0n, revocable: true, data },
  });

  console.log("Transaction: ", tx);

  return await tx.wait();
}
