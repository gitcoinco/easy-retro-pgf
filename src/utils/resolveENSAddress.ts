import { normalize } from "viem/ens";
import { publicClient } from "~/server/publicClient";

export const resolveENSAddress = async (val: string) => {
  try {
    const ensAddress = await publicClient.getEnsAddress({
      name: normalize(val),
    });
    if (ensAddress !== null) {
      return ensAddress; // Return the validated ENS address
    }
    throw new Error("Invalid address");
  } catch (error) {
    throw new Error("Invalid address");
  }
};
