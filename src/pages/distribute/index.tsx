import { useState } from "react";
import { Input, Label, Select } from "~/components/ui/Form";
import ConfigurePool from "~/features/distribute/components/CreatePool";
import { Distributions } from "~/features/distribute/components/Distributions";
import { Layout } from "~/layouts/DefaultLayout";
import { PayoutOptions } from "~/utils/calculateResults";
import { getAppState } from "~/utils/state";

export default function DistributePage() {
  const [payoutOptions, setPayoutOptions] = useState<PayoutOptions>({
    style: "custom",
    threshold: 3,
  });

  console.log({ payoutOptions });

  return (
    <Layout sidebar="left" sidebarComponent={<ConfigurePool />}>
      {getAppState() === "RESULTS" ? (
        <>
          <div className="mb-2 flex justify-end gap-2">
            <Label>
              Payout style
              <Select
                value={payoutOptions.style}
                className={"w-full"}
                onChange={(e) =>
                  setPayoutOptions((s) => ({
                    ...s,
                    style: e.target.value as PayoutOptions["style"],
                  }))
                }
              >
                <option value="custom">Custom</option>
                <option value="op">OP-Style</option>
              </Select>
            </Label>
            <Label>
              Minimum quorum
              <Input
                disabled={payoutOptions.style !== "op"}
                value={payoutOptions.threshold}
                type="number"
                className="block w-44"
                onChange={(e) =>
                  setPayoutOptions((s) => ({
                    ...s,
                    threshold: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  }))
                }
              />
            </Label>
          </div>
          <Distributions payoutOptions={payoutOptions} />
        </>
      ) : (
        <div>Round hasn&apos;t ended yet</div>
      )}
    </Layout>
  );
}
