import { RoundType } from "@prisma/client";
import { Spinner } from "~/components/ui/Spinner";
import { CalculationForm } from "~/features/admin/components/CalculationForm";
import { RoundAdminLayout } from "~/features/admin/layouts/AdminLayout";
import ConfigurePool from "~/features/distribute/components/CreatePool";
import { Distributions } from "~/features/distribute/components/Distributions";

import {
  useCurrentRound,
  useUpdateRound,
} from "~/features/rounds/hooks/useRound";
import { api } from "~/utils/api";

export default function DistributePage() {
  const utils = api.useUtils();
  const round = useCurrentRound();
  const update = useUpdateRound();

  return (
    <RoundAdminLayout>
      {() => (
        <div className="max-w-screen-md">

          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <ConfigurePool/>
            </div>

            {
              !round.isPending &&
              round.data?.type == RoundType.project &&
              (
                <div className="flex-1">
                  <CalculationForm
                    isLoading={update.isPending}
                    onUpdate={({ calculationType, ...calculationConfig }) => {
                      update.mutate(
                        { id: round.data?.id, calculationType, calculationConfig },
                        {
                          async onSuccess() {
                            return utils.results.votes.invalidate();
                          },
                        },
                      );
                    }}
                  />
                </div>
              )
            }
          </div>

          {update.isPending ? (
            <div className="flex justify-center py-8">
              <Spinner className="size-6" />
            </div>
          ) : (
            <Distributions />
          )}
        </div>
      )}
    </RoundAdminLayout>
  );
}
