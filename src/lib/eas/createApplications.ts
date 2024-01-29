import "dotenv/config";
import { config, eas } from "~/config";
import { type MultiAttestationRequest } from "@ethereum-attestation-service/eas-sdk";
import {
  fetchAttestations,
  createDataFilter,
  type Attestation,
} from "~/utils/fetchAttestations";
import { createAttestation } from "./createAttestation";
import { ethers, providers } from "ethers";
import { createEAS } from "./createEAS";
import pLimit from "p-limit";
import { formatEther } from "viem";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

const limit = pLimit(5);
const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY!).connect(
  new providers.AlchemyProvider(
    config.network.network,
    process.env.NEXT_PUBLIC_ALCHEMY_ID,
  ),
) as unknown as providers.JsonRpcSigner;

console.log(wallet.getAddress());
wallet
  .getBalance()
  .then((r) => console.log(formatEther(r.toBigInt())))
  .catch(console.log);

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
  "TrueBlocks and the Unchained Index",
  "PLUME: Pseudonymously Linked Unique Message Entities, aka Verifiably Deterministic Signatures on Ethereum",
  "Blockhead: portfolio tracker, block explorer and web3 browser",
  "Ethereum Staking Guides by CoinCashew",
  "Ephemery Testnet",
  "D4C : Fuzzing the Ethereum Network",
  "eth-pkg",
  "ethRPCtoREST",

  "Revoke.cash",
  "OmniBTC",
  "JediSwap",
  "Hey.xyz (formerly Lenster)",
  "DefiLlama",
  "IDriss - A more usable web3 for everyone",
  "Umbra",
  "BrightID 🔆 Universal Proof of Uniqueness",
  "IDENA",
  "Hypercerts Foundation",
  "Carmine Options AMM",
  "The Tor Project",
  "Tape (formerly Lenstube)",
  "Iron Wallet",
  "Sybil Defense for Public Goods - with privacy",
  "Kleo Network",
  "POAPin",
  "Mirror",
  "Starksheet",
  "Citizen Wallet - an open source wallet with account abstraction for your community",
  "Zk- Block | Tools for Zk & Web3 Dapps",
  "Impersonator",
  "Web3 GPT",
  "4EVERLAND",
  "Glo Dollar",
  "Gitcoin Passport Plugin for Discourse",
  "Astral",
  "Gitcoin Grants Data Portal",
  "Sybil-scorer",
  "ZeroPool",
  "Rouge Ticket",
  "Commons Stack",
  "ZKP2P Fiat On Ramp",
  "Epoch Protocol",
  "ENS Wayback Machine",
  "1Hive Gardens",
  "growthepie.xyz 🥧📏 - Layer 2 and Blockspace Analytics",
  "dm3 protocol - the interoperability initiative",
  "Open Source Observer",
  "Qortal",
  "Ether Alpha",
  "WTF Academy",
  "DappReader",
  "dSentra",
  "zkVRF",

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
  "Rhino Review - Ethereum Staking Journal",
  "Web3beach",
  "MetaGame",
  "Fractal Visions",
  "LexDAO",
  "Web3 Security",
  "Regens Unite - bridging the gap between web3 and local regens",
  "Decentralized Science on Gitcoin",
  "LensPlay",
  "Public Nouns Operations",
  "DeBox",
  "The Noun Square",
  "Gravity DAO",
  "Blocktrend（區塊勢）",
  "Boring Security",
  "Upgrading Ethereum Book",
  "Urbanika and the Self-Management Neighborhood Course",
  "ENS DAO Newsletter:  Providing news and core ENS development to the global Ethereum community.",
  "ReFi DAO - A New Chapter…",
  "The Blockchain Socialist",
  "Coin Center",
  "Metagov",
  "Crypto Altruism – Accessible Web3 Education for Nonprofits and Changemakers",
  "Biteye",
  "Psychedelic Puppet Show DAO",
  "JobStash",
  "Public Good Africa",
  "Onlyfun",
  "Dream DAO",
  "OpenData Community",
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
              time: undefined,
              ...createDataFilter("displayName", "string", name),
            },
          },
        ).then(async ([attestation]) => {
          if (!attestation) return null;
          const application = attestation as Attestation & {
            applicationMetadataPtr: string;
            displayName: string;
          };
          const [profile] = (await fetchAttestations(
            [
              "0xac4c92fc5c7babed88f78a917cdbcdc1c496a8f4ab2d5b2ec29402736b2cf929",
            ],
            {
              take: 1000,
              where: {
                time: undefined,
                attester: { equals: attestation.attester },
              },
            },
          )) as [Attestation & { profileMetadataPtr: string }];
          if (!profile) return null;

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
              recipient: application.attester,
              values: {
                name: application.displayName,
                metadataType: 0, // "http"
                metadataPtr: application?.applicationMetadataPtr,
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
    .then(async (attestations) => {
      console.log(attestations);
      console.log(attestations.length);

      if (
        ["y", "yes"].includes(
          await createInterface({ input: stdin, output: stdout }).question(
            `Do you want to create ${attestations.length} attestations? (y/yes)\n`,
          ),
        )
      ) {
        const EAS = createEAS(wallet);
        // Only attest 10 at a time (could cause error if more)
        return chunk(attestations, 10).map((parts) => {
          const data = parts
            .filter(Boolean)
            .map((att) => ({ ...att, data: [att?.data] }));
          return EAS.multiAttest(data as MultiAttestationRequest[]);
        });
      } else {
        console.log("Exiting");
        return;
      }
    });
}

function chunk<T>(array: T[], chunkSize: number) {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

createApplications()
  .then((res) => {
    console.log(res);
    console.log("Done!");
  })
  .catch((err) => {
    console.log(err);
    console.log("Error creating attestations");
  })
  .finally(() => process.exit(0));
