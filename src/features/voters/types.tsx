import { type Address, isAddress } from "viem";
import { z } from "zod";

export const EthAddressSchema = z.custom<string>(
  (val) =>
    (val as string)
      .split(",")
      .map((address) => address.trim())
      .every((address) => isAddress(address as Address)) ||
    isAddress(val as Address),
  "Invalid address",
);
