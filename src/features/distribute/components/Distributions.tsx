import { useState } from "react";
import { EmptyState } from "~/components/EmptyState";
import { Button } from "~/components/ui/Button";
import { Spinner } from "~/components/ui/Spinner";
import { type Distribution } from "~/features/distribute/types";
import { ConfirmDistributionDialog } from "./ConfirmDistributionDialog";
import { ExportCSV } from "./ExportCSV";
import { formatNumber } from "~/utils/formatNumber";
import { ImportCSV } from "./ImportCSV";
import React from "react";
import { useDistributeInfo } from "../hooks/useDistributeInfo";
import { usePoolId } from "../hooks/useAlloPool";
import { useIsCorrectNetwork } from "~/hooks/useIsCorrectNetwork";
import { Alert } from "~/components/ui/Alert";
import { ExportVotes } from "./ExportVotes";
import { PayoutsTable } from "./PayoutsTable";
import { DistributionTable } from "./DistributionTable";
import { toast } from "sonner";

export function Distributions() {
  const [importedDistribution, setImportedDistribution] = useState<
    Distribution[]
  >([]);
  const [confirmDistribution, setConfirmDistribution] = useState<
    Distribution[]
  >([]);
  const [payoutsCompleted, setPayoutsCompleted] = useState(false);
  const { data: poolId, isLoading } = usePoolId();

  const info = useDistributeInfo(poolId, importedDistribution);
  const { isCorrectNetwork, correctNetwork } = useIsCorrectNetwork();

  const { data, isFetched } = info;

  const payoutEventsByTransaction = data?.payoutEventsByTransaction;
  const alreadyDistributedProjects = data?.alreadyDistributedProjects;
  const distributionResult = data?.distributionResult.data;
  const explorerUrl = data?.explorerLink;

  const projectIds = distributionResult?.projectIds || [];
  const totalVotes = distributionResult?.totalVotes || 0;
  const network = data?.roundNetwork;

  const togglePayoutsCompleted = () => {
    toast.success("Payouts completed");
    setPayoutsCompleted(!payoutsCompleted);
  };

  const distributions =
    importedDistribution.length > 0
      ? importedDistribution
      : distributionResult?.distributions || [];

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (!poolId) {
    return <EmptyState title="No pool found" />;
  }

  if (!isFetched) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (!isCorrectNetwork && poolId) {
    return (
      <Alert variant="info" className="flex items-center gap-2">
        You must be connected to {correctNetwork?.name}
      </Alert>
    );
  }

  if (projectIds.length === 0) {
    return <EmptyState title="No project votes found" />;
  }

  if (distributions.length === 0) {
    return <EmptyState title="No distribution found" />;
  }
  const finalDistributions = data?.distributions ?? [];
  const morePayoutsRemaining = payoutsCompleted
    ? false
    : finalDistributions.length > 0;

  return (
    <div>
      <div className="my-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm">
          <ExportVotes totalVotes={formatNumber(totalVotes)} />
          <ImportCSV onImport={setImportedDistribution} />
          <ExportCSV votes={distributions} />
        </div>
        <Button
          disabled={!morePayoutsRemaining}
          variant="primary"
          onClick={() => setConfirmDistribution(finalDistributions)}
        >
          {morePayoutsRemaining ? "Distribute tokens" : "Payouts done"}
        </Button>
      </div>
      <div className="mb-4 flex flex-col space-y-1 text-sm font-semibold">
        <span>{`Funded ${distributions?.length - finalDistributions?.length} / ${distributions?.length} projects`}</span>
      </div>
      <div className="min-h-[360px] overflow-auto">
        <DistributionTable
          distributions={distributions}
          alreadyDistributedProjects={alreadyDistributedProjects}
        />
      </div>

      {isFetched && (
        <div className="min-h-[360px] overflow-auto">
          <PayoutsTable
            payoutEventsByTransaction={payoutEventsByTransaction || {}}
            explorerUrl={explorerUrl || ""}
          />
        </div>
      )}
      <ConfirmDistributionDialog
        distribution={confirmDistribution}
        network={network ?? ""}
        onOpenChange={() => setConfirmDistribution([])}
        togglePayoutsCompleted={togglePayoutsCompleted}
      />
    </div>
  );
}
