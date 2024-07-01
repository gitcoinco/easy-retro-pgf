"use client";

import { useMemo } from "react";

import { MetricWithProjects } from "~/utils/fetchMetrics";
import { SidebarWithChart } from "./SidebarWithChart";
import { api } from "~/utils/api";

const parseBallotData = (ballot: MetricWithProjects[]) => {
  const totalAmounts = ballot.reduce((sum, item) => sum + item.total, 0);

  return ballot.map(({ id, name, total }) => ({
    id,
    name,
    amount: total,
    fraction: total / totalAmounts,
  }));
};

//! TODO parse data to get the voters VS total votes, or a different approach

export function BallotSidebar() {
  const { data, error, isPending } = api.metrics.forBallot.useQuery();

  const ballot = data || [];

  const allocationData = useMemo(() => parseBallotData(ballot), ballot);

  return (
    <SidebarWithChart
      title="Ballot Distribution"
      allocationData={allocationData}
      isPending={isPending}
      error={error}
    />
  );
}
