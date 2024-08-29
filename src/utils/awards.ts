export type RoundAwards = {
  [roundId: string]: Award[];
};

export type Award = {
  id: string;
  amount: number;
  metrics: string[];
  eligibleProjects: string[];
};

export const roundAwards: RoundAwards = {
  "cm0dl93qb003q1381pklk5ib8": [
    {
      id: "award1",
      amount: 3e14, // 0.0003
      metrics: ["address_count_90_days", "address_count"],
      eligibleProjects: [
        "bfcecf54-5f57-42f9-80e1-613cb5cbd38d",
        "afba08a9-db09-49db-8fa3-58255bc2b528",
        "3f3f5ee5-3a0b-4a46-800c-3b2a0bf203b4",
      ],
    },
    {
      id: "award2",
      amount: 7e14, // 0.0007
      metrics: [
        "gas_fees_sum",
        "days_since_first_transaction",
        "active_contract_count_90_days",
      ],
      eligibleProjects: [
        "bfcecf54-5f57-42f9-80e1-613cb5cbd38d",
        "afba08a9-db09-49db-8fa3-58255bc2b528",
      ],
    },
  ],
};