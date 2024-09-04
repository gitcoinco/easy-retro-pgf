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
  "cm0ngdr6q0000w7ggc0cuelnn": [
    {
      id: "award1",
      amount: 3e14, // 0.0003
      metrics: ["address_count_90_days", "address_count"],
      eligibleProjects: [
        "89ad5868-1fa5-48b4-84d1-b5037aadf938",
        "c5f48bc4-fa1e-4ad5-b34e-3cc557f4a654",
        "dd369d44-005a-4cb5-986f-c4c4bf66cab1",
      ],
    },
    {
      id: "award2",
      amount: 5e14, // 0.0005
      metrics: [
        "gas_fees_sum",
        "days_since_first_transaction",
        "active_contract_count_90_days",
      ],
      eligibleProjects: [
        "89ad5868-1fa5-48b4-84d1-b5037aadf938",
        "c5f48bc4-fa1e-4ad5-b34e-3cc557f4a654",
      ],
    },
    {
      id: "award3",
      amount: 2e14, // 0.0002
      metrics: [
        "gas_fees_sum",
        "address_count_90_days",
      ],
      eligibleProjects: [
        "89ad5868-1fa5-48b4-84d1-b5037aadf938",
        "dd369d44-005a-4cb5-986f-c4c4bf66cab1",
      ],
    },
  ],
};
