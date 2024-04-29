import { expect, test, vi } from "vitest";
import { createAttestation } from "../createAttestation";
import type { Transaction } from "@ethereum-attestation-service/eas-sdk/dist/transaction";
import { ethers, type JsonRpcSigner } from "ethers";
import type {
  AttestationRequest,
  SchemaRecord,
} from "@ethereum-attestation-service/eas-sdk";
import { createEAS } from "../createEAS";

const signer = ethers.Wallet.createRandom().connect(
  ethers.getDefaultProvider(),
) as unknown as JsonRpcSigner;
test("createAttestation", async () => {
  const application = {
    name: "foo",
    metadataType: 1,
    metadataPtr: "metadata",
    type: "application",
    round: "0x0",
  };

  const attestation = await createAttestation(
    {
      values: application,
      schemaUID:
        "0x76e98cce95f3ba992c2ee25cef25f756495147608a3da3aa2e5ca43109fe77cc",
    },
    signer,
  );

  expect(attestation.data.recipient).toEqual(await signer.getAddress());
});

test("createEAS", async () => {
  const eas = createEAS(signer);

  expect(eas.attest.bind(eas)).toBeDefined();
});

vi.hoisted(() => ({
  attestMock: vi
    .fn<[AttestationRequest], Transaction<string>>()
    .mockResolvedValue({} as Transaction<string>),
}));

vi.mock("@ethereum-attestation-service/eas-sdk", async () => {
  const actual = await import("@ethereum-attestation-service/eas-sdk");
  const metadataSchemaRecord: SchemaRecord = {
    resolver: "0x0000000000000000000000000000000000000000",
    revocable: true,
    schema:
      "string name,uint256 metadataType,string metadataPtr,bytes32 type,bytes32 round",
    uid: "0x58e80750f091c47b3e55ac89942b30df23de405399edad95920fe15bd22309b7",
  };
  return {
    ...actual,
    // EAS: class extends actual.EAS {
    //   async attest(req: AttestationRequest) {
    //     return attestMock(req);
    //   }
    // },
    SchemaRegistry: class extends actual.SchemaRegistry {
      async getSchema() {
        return Promise.resolve(metadataSchemaRecord);
      }
    },
  };
});
