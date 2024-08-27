import { Heading } from "~/components/ui/Heading";
import { suffixNumber } from "~/utils/suffixNumber";
import type { Application } from "~/features/applications/types";

export function FundingSources({
  fundingSources,
}: {
  fundingSources: Application["fundingSources"];
}) {
  return (
    <>
      <Heading as="h3" size="2xl">
        Past grants and funding
      </Heading>
      <div className="space-y-4">
        {fundingSources?.map((source, i) => {
          const type =
            {
              OTHER: "Other",
              RETROPGF_2: "RetroPGF2",
              GOVERNANCE_FUND: "Governance Fund",
              PARTNER_FUND: "Partner Fund",
              REVENUE: "Revenue",
            }[source.type] ?? source.type;
          return (
            <div key={i} className="flex items-center gap-4">
              <div className="flex-1 truncate text-xl">
                {source.description}
              </div>
              <div className="text-sm tracking-widest text-gray-700 dark:text-gray-400">
                {type}
              </div>
              <div className="w-32 text-xl font-medium">
                {suffixNumber(source.amount)} {source.currency}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
