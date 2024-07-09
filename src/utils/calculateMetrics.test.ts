import { expect, test } from "vitest";
import { calculateMetricsBallot } from "./calculateMetrics";
import { OSOMetrics } from "./fetchMetrics";

test("calculate metrics", () => {
  const actual = calculateMetricsBallot(projects, metricsById);

  console.log(JSON.stringify(actual, null, 2));
  expect(actual).toMatchInlineSnapshot(`
    [
      {
        "amount": 9.146575150001642,
        "id": "SNdMHnnes04aSQQwpNdWT0uBt6VdKyT3Zog7miIsaK0=",
        "metrics": [
          {
            "amount": 7590,
            "fraction": 8.908450704225352,
            "id": "days_since_first_transaction",
          },
          {
            "amount": 594,
            "fraction": 0.005538668108833896,
            "id": "address_count",
          },
          {
            "amount": 0.4155091059340066,
            "fraction": 0.23258577766745545,
            "id": "gas_fees_sum",
          },
        ],
        "name": "gitcoin",
      },
      {
        "amount": 12.709042815161943,
        "id": "XyKL4912vsx41aNjTJDLDexSgi4_BcPkilZ8twJlqxI=",
        "metrics": [
          {
            "amount": 9999,
            "fraction": 11.735915492957746,
            "id": "days_since_first_transaction",
          },
          {
            "amount": 83325,
            "fraction": 0.776952054155866,
            "id": "address_count",
          },
          {
            "amount": 0.35046257363883765,
            "fraction": 0.196175268048333,
            "id": "gas_fees_sum",
          },
        ],
        "name": "aave",
      },
      {
        "amount": 64.30384835023173,
        "id": "XSDgPwFuQVcj57ARcKTGrm2w80KKlqJxaBWF6jZqe7w=",
        "metrics": [
          {
            "amount": 99,
            "fraction": 0.11619718309859155,
            "id": "days_since_first_transaction",
          },
          {
            "amount": 3435498,
            "fraction": 32.03381011879231,
            "id": "address_count",
          },
          {
            "amount": 57.44209246294635,
            "fraction": 32.15384104834083,
            "id": "gas_fees_sum",
          },
        ],
        "name": "uniswap",
      },
      {
        "amount": 12.840533684604688,
        "id": "PZA75rAKiN4P9poFNpkZYK-yrF1r3WgpEHmbvwPjbXk=",
        "metrics": [
          {
            "amount": 10428,
            "fraction": 12.23943661971831,
            "id": "days_since_first_transaction",
          },
          {
            "amount": 19701,
            "fraction": 0.18369915894299088,
            "id": "address_count",
          },
          {
            "amount": 0.745671693499818,
            "fraction": 0.4173979059433878,
            "id": "gas_fees_sum",
          },
        ],
        "name": "zora",
      },
    ]
  `);
});
const metricsById = {
  days_since_first_transaction: 33,
  address_count: 33,
  gas_fees_sum: 33,
};

const projects = [
  {
    event_source: "BASE",
    display_name: "Gitcoin",
    project_id: "SNdMHnnes04aSQQwpNdWT0uBt6VdKyT3Zog7miIsaK0=",
    project_name: "gitcoin",
    project_namespace: "oso",
    project_source: "OSS_DIRECTORY",
    days_since_first_transaction: 230,
    address_count: 18,
    gas_fees_sum: 0.012591185028303229,
  },
  {
    event_source: "BASE",
    display_name: "Aave",
    project_id: "XyKL4912vsx41aNjTJDLDexSgi4_BcPkilZ8twJlqxI=",
    project_name: "aave",
    project_namespace: "oso",
    project_source: "OSS_DIRECTORY",
    days_since_first_transaction: 303,
    address_count: 2525,
    gas_fees_sum: 0.010620077989055687,
  },
  {
    event_source: "BASE",
    display_name: "Uniswap",
    project_id: "XSDgPwFuQVcj57ARcKTGrm2w80KKlqJxaBWF6jZqe7w=",
    project_name: "uniswap",
    project_namespace: "oso",
    project_source: "OSS_DIRECTORY",
    days_since_first_transaction: 3,
    address_count: 104106,
    gas_fees_sum: 1.7406694685741317,
  },
  {
    event_source: "BASE",
    display_name: "Zora",
    project_id: "PZA75rAKiN4P9poFNpkZYK-yrF1r3WgpEHmbvwPjbXk=",
    project_name: "zora",
    project_namespace: "oso",
    project_source: "OSS_DIRECTORY",
    days_since_first_transaction: 316,
    address_count: 597,
    gas_fees_sum: 0.022596111924236908,
  },
] as OSOMetrics;
