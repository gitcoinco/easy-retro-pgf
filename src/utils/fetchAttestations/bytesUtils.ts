import { ethers } from "ethers";
import { fromHex, type Address } from "viem";

export const parseBytes = (hex: string) =>
  ethers.decodeBytes32String(fromHex(hex as Address, "bytes"));

export const formatBytes = (string: string) =>
  ethers.encodeBytes32String(string);
