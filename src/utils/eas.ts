import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { type SignerOrProvider } from "@ethereum-attestation-service/eas-sdk/dist/transaction";

import { type ListAttestation } from "~/hooks/useCreateList";

const EASContractAddress =
  process.env.NEXT_PUBLIC_EAS_CONTRACT_ADDRESS ??
  "0x4200000000000000000000000000000000000021";

const schemaUIDs = new Map([
  ["10", process.env.NEXT_PUBLIC_LISTS_SCHEMA!],
  ["420", process.env.NEXT_PUBLIC_LISTS_SCHEMA_STAGING!],
]);

export async function createAttestation(
  { owner, ...list }: ListAttestation,
  signer: SignerOrProvider,
) {
  console.log("Creating EAS instance...");

  const network = await signer.provider?.getNetwork();
  if (!network?.chainId || !schemaUIDs.get(String(network.chainId))) {
    throw new Error(`No schema found for network: ${network?.name}`);
  }
  const schema = schemaUIDs.get(String(network.chainId))!;
  const eas = new EAS(EASContractAddress);

  console.log("Connecting signer to EAS...");
  eas.connect(signer);

  console.log("Encoding data with schema...");
  const data = encodeData(list);

  console.log("Creating attestation...");
  const tx = await eas.attest({
    schema,
    data: { recipient: owner, expirationTime: 0n, revocable: true, data },
  });
  console.log("Transaction: ", tx);

  return await tx.wait();
}

function encodeData({
  listName,
  listMetadataPtrType,
  listMetadataPtr,
}: Omit<ListAttestation, "owner">) {
  const schemaEncoder = new SchemaEncoder(
    "string listName, uint256 listMetadataPtrType, string listMetadataPtr",
  );
  return schemaEncoder.encodeData([
    { name: "listName", value: listName, type: "string" },
    {
      name: "listMetadataPtrType",
      value: listMetadataPtrType,
      type: "uint256",
    },
    { name: "listMetadataPtr", value: listMetadataPtr, type: "string" },
  ]);
}
