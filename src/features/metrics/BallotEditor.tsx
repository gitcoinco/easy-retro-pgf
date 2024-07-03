"use client";
import { useMemo } from "react";
import Link from "next/link";
import { NumericFormat } from "react-number-format";
import { Lock, Minus, Plus, Trash2, Unlock } from "lucide-react";
import { Metric } from "./types";
import { Skeleton } from "~/components/ui/Skeleton";
import { Button } from "~/components/ui/Button";
import { cn } from "~/utils/classNames";
import { useBallotContext } from "../ballot/components/provider";
import { useSortBallot } from "../ballot/hooks/useBallotEditor";

const BallotFilter = () => <div>Ballot filter</div>;
export function BallotEditor({
  metrics = [],
  isLoading,
}: {
  metrics?: Metric[];
  isLoading: boolean;
}) {
  const { state, inc, dec, set, remove } = useBallotContext();
  const { sorted } = useSortBallot(state);

  const count = useMemo(() => Object.keys(state).length, [state]);
  const metricById = useMemo(
    () => Object.fromEntries(metrics.map((m) => [m.id, m])),
    [metrics],
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="mb-4">
          <h3 className="text-3xl font-semibold">Your ballot</h3>
          <div className="text-sm">
            You&apos;ve added {count} of {metrics.length} metrics
          </div>
        </div>
        <BallotFilter />
      </div>

      <div className="divide-y border-y">
        {isLoading &&
          Array(3)
            .fill(0)
            .map((_, i) => (
              <div className="py-4" key={i}>
                <Skeleton key={i} className="h-10" />
              </div>
            ))}
        {sorted
          .filter((id) => state[id])
          .map((id) => {
            const { amount = 0, locked } = state[id] ?? {};
            const { name } = metricById[id] ?? {};

            return (
              <div key={id} className="flex items-center justify-between py-4">
                <h3
                  className="text-sm font-medium underline-offset-4 hover:underline"
                  tabIndex={-1}
                >
                  <Link href={`/metrics/${id}`}>{name}</Link>
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
                      min={0}
                      max={100}
                      suffix={"%"}
                      allowNegative={false}
                      allowLeadingZeros={false}
                      isAllowed={(values) => (values?.floatValue ?? 0) <= 100}
                      customInput={(p) => (
                        <input
                          className="w-24 text-center"
                          {...p}
                          max={100}
                          min={0}
                        />
                      )}
                      placeholder="--%"
                      value={
                        amount !== undefined ? amount.toFixed(2) : undefined
                      }
                      onBlur={(e) => {
                        e.preventDefault();
                        const updated = parseFloat(e.target.value);
                        amount !== updated && set(id, updated);
                      }}
                    />
                    <Button
                      size={"icon"}
                      variant="ghost"
                      icon={Plus}
                      tabIndex={-1}
                      disabled={amount >= 100}
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
