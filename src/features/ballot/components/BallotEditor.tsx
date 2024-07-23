"use client";
import { useEffect, useMemo } from "react";
import Link from "next/link";
import { NumericFormat } from "react-number-format";
import { Lock, Minus, Plus, Trash2, Unlock } from "lucide-react";
import { Skeleton } from "~/components/ui/Skeleton";
import { Button } from "~/components/ui/Button";
import { cn } from "~/utils/classNames";
import { useSortBallot } from "~/features/ballot/hooks/useBallotEditor";
import { useBallotContext } from "~/features/ballot/components/BallotProvider";
import {
  useCurrentDomain,
  useCurrentRound,
} from "~/features/rounds/hooks/useRound";
import { RoundTypes } from "~/features/rounds/types";
import { Alert } from "~/components/ui/Alert";
import { formatDate } from "~/utils/time";
import { ExportMetricsCSV, ExportProjectsCSV, ImportCSV } from "./ImportCSV";

export function BallotEditor({
  items = [],
  isLoading,
  maxAllocation = 100,
  type,
}: {
  items?: { id: string; name: string }[];
  isLoading: boolean;
  maxAllocation?: number;
  type: RoundTypes;
}) {
  const domain = useCurrentDomain();
  const round = useCurrentRound();
  const { ballot, state, inc, dec, set, remove } = useBallotContext();
  const { sorted } = useSortBallot(items);
  const projectById = useMemo(
    () => Object.fromEntries(items.map((p) => [p.id, p])),
    [items],
  );

  const publishedAt = ballot?.publishedAt;
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Review your ballot</h1>
      <p className="mb-6">
        Once you have reviewed your vote allocation, you can submit your ballot.
      </p>
      {publishedAt && (
        <Alert variant={"success"} className="mb-2">
          <div className="flex items-center gap-2">
            <p>
              Your ballot was submitted on {formatDate(publishedAt)}. You can
              make changes and resubmit until{" "}
              {round.data?.resultAt && formatDate(round.data?.resultAt)}. To do
              so, simply edit the ballot below and submit again.
            </p>
          </div>
        </Alert>
      )}
      <div className="mb-2 flex items-center gap-2">
        <ImportCSV
          onImport={(allocations) =>
            allocations.map((alloc) => set(alloc.id, alloc.amount))
          }
        />
        {type === RoundTypes.impact ? (
          <ExportMetricsCSV allocations={ballot?.allocations} />
        ) : (
          <ExportProjectsCSV allocations={ballot?.allocations} />
        )}
      </div>
      <div className="divide-y rounded-xl border">
        {isLoading &&
          Array(3)
            .fill(0)
            .map((_, i) => (
              <div className="p-4" key={i}>
                <Skeleton key={i} className="h-10" />
              </div>
            ))}
        {sorted
          .filter((id) => state[id])
          .map((id) => {
            const { amount = 0, locked } = state[id] ?? {};
            const { name } = projectById[id] ?? {};

            return (
              <div key={id} className="flex items-center justify-between p-4">
                <h3 className="text-lg underline-offset-4 hover:underline">
                  <Link href={`/${domain}/${type}/${id}`} tabIndex={-1}>
                    {name}
                  </Link>
                </h3>
                <div className="flex gap-2">
                  <Button
                    size={"icon"}
                    variant={locked ? "secondary" : "ghost"}
                    icon={locked ? Lock : Unlock}
                    className={cn({ ["opacity-50"]: !locked })}
                    tabIndex={-1}
                    onClick={() => {
                      set(id, amount, locked);
                    }}
                  />
                  <div className="flex rounded-lg border">
                    <Button
                      size={"icon"}
                      variant="ghost"
                      icon={Minus}
                      tabIndex={-1}
                      disabled={amount <= 0}
                      onClick={() => {
                        dec(id);
                      }}
                    />
                    <NumericFormat
                      suffix={maxAllocation === 100 ? "%" : undefined}
                      allowNegative={false}
                      allowLeadingZeros={false}
                      isAllowed={(values) =>
                        (values?.floatValue ?? 0) <= maxAllocation
                      }
                      customInput={(p) => (
                        <input
                          className="w-24 border-none text-center"
                          {...p}
                        />
                      )}
                      placeholder="--"
                      thousandSeparator=","
                      value={
                        amount !== undefined
                          ? amount.toFixed(maxAllocation === 100 ? 2 : 0)
                          : undefined
                      }
                      onBlur={(e) => {
                        e.preventDefault();
                        const updated = e.target.value
                          ? parseFloat(
                              // Remove thousandSeparator (,)
                              e.target.value.replace(/(?<=\d),(?=\d)/g, ""),
                            )
                          : 0;

                        amount !== updated && set(id, updated);
                      }}
                    />
                    <Button
                      size={"icon"}
                      variant="ghost"
                      icon={Plus}
                      tabIndex={-1}
                      disabled={amount >= maxAllocation}
                      onClick={() => {
                        inc(id);
                      }}
                    />
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    icon={Trash2}
                    tabIndex={-1}
                    onClick={() => {
                      remove(id);
                    }}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
