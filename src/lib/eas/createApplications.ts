import "dotenv/config";
import { config, eas } from "~/config";
import { fetchAttestations, createDataFilter } from "~/utils/fetchAttestations";
import { createAttestation } from "./createAttestation";
import { ethers, providers } from "ethers";
import { createEAS } from "./createEAS";
import pLimit from "p-limit";
import { formatEther } from "viem";

const limit = pLimit(5);
const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY!).connect(
  new providers.AlchemyProvider(
    config.network.network,
    process.env.NEXT_PUBLIC_ALCHEMY_ID,
  ),
) as unknown as providers.JsonRpcSigner;

wallet.getBalance().then((r) => console.log(formatEther(r)));
const applications = [
  "L2BEAT",
  "EthStaker",
  "Dappnode",
  "ZK Email",
  "ethers.js",
  "rotki",
  "beaconcha.in",
  "Ethereum Attestation Service",
  "wagmi",
  "Protocol Guild",
  "eth.limo",
  "NiceNode",
  "Ethereum on ARM",
  "Blockscout Block Explorer - Decentralized, Open-Source, Transparent Block Explorer for All Chains",
  "Otterscan",
  "Stereum - Ethereum Node Installer & Manager",
  "Somer Esat Ethereum Staking Guides (Ubuntu)",
  "eth-wizard: An Ethereum validator installation wizard",
  "OpenZeppelin Contracts",
  "Candide Labs",

  "Alpha Insiders",
  "Olimpio Education",
  "Revoke All",
  "BanklessDAO",
  "GreenPill Network",
  "Wizard Bridge EVM",
  "Metopia",
  "Week in Ethereum News",
  "EtherDrops Bot",
  "ITU Blockchain",
  "Funding the Commons",
  "The Rollup",
  "Castle Capital",
  "Bankless Academy",
  "OpenCivics",
  "Unitap",

  "Trustalabs",
  "EtherScore",
  "ZachXBT",
  "Giveth",
  "Alpha Insiders",
  "Olimpio Education",
  "Revoke All",
  "BanklessDAO",
  "GreenPill Network",
  "Wizard Bridge EVM",
  "Metopia",
  "Week in Ethereum News",
  "EtherDrops Bot",
  "ITU Blockchain",
  "Funding the Commons",
  "The Rollup",
  "Castle Capital",
  "Bankless Academy",
  "OpenCivics",
  "Unitap",
];

async function createApplications() {
  return Promise.all(
    applications.map((name) =>
      limit(() =>
        fetchAttestations(
          [
            "0x76e98cce95f3ba992c2ee25cef25f756495147608a3da3aa2e5ca43109fe77cc",
          ],
          {
            take: 1000,
            where: {
              ...createDataFilter("displayName", "string", name),
            },
          },
        ).then(async ([attestation]) => {
          if (!attestation) return null;

          console.log(attestation);
          const [profile] = await fetchAttestations(
            [
              "0xac4c92fc5c7babed88f78a917cdbcdc1c496a8f4ab2d5b2ec29402736b2cf929",
            ],
            {
              take: 1000,
              where: {
                attester: { equals: attestation.attester },
              },
            },
          );

          /* TODO:
            - Download metadata and create new in vercel storage for caching
          */
          console.log(profile);
          const profileAttestation = await createAttestation(
            {
              schemaUID: eas.schemas.metadata,
              recipient: profile.attester,
              values: {
                name: profile.name,
                metadataType: 0, // "http"
                metadataPtr: profile?.profileMetadataPtr,
                type: "profile",
                round: config.roundId,
              },
            },
            wallet,
          );

          const applicationAttestation = await createAttestation(
            {
              schemaUID: eas.schemas.metadata,
              recipient: attestation.attester,
              values: {
                name: attestation.displayName,
                metadataType: 0, // "http"
                metadataPtr: attestation?.applicationMetadataPtr,
                type: "application",
                round: config.roundId,
              },
            },
            wallet,
          );

          return [profileAttestation, applicationAttestation];
        }),
      ),
    ),
  )
    .then((res) => res.flat())
    .then((res) => res.filter(Boolean))
    .then((attestations) => {
      console.log(attestations);
      console.log(attestations.length);

      const EAS = createEAS(wallet);
      return EAS.multiAttest(
        attestations.map((att) => ({ ...att, data: [att.data] })),
      );
    });
}

createApplications()
  .then((res) => {
    console.log(res);
    console.log("Done!");
  })
  .catch(console.log)
  .finally(() => process.exit(0));
