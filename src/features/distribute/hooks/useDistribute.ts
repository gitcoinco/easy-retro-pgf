import { useMutation } from "@tanstack/react-query";
import { type Distribution } from "../types";

export function useDistribute() {
  //
  return useMutation(async (votes: Distribution[]) => {
    const { recipients, amounts } = votes.reduce(
      (acc, x) => ({
        recipients: acc.recipients.concat(x.payoutAddress),
        amounts: acc.amounts.concat(x.amount),
      }),
      { recipients: [], amounts: [] } as {
        recipients: string[];
        amounts: number[];
      },
    );

    console.log({ recipients, amounts });
  });
}
