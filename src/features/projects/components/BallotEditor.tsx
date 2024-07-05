"use client";
import { useMemo } from "react";
import Link from "next/link";
import { NumericFormat } from "react-number-format";
import { Lock, Minus, Plus, Trash2, Unlock } from "lucide-react";
import { Skeleton } from "~/components/ui/Skeleton";
import { Button } from "~/components/ui/Button";
import { cn } from "~/utils/classNames";
import { useSortBallot } from "~/features/ballot/hooks/useBallotEditor";
import { useBallotContext } from "~/features/ballot/components/provider";
import { useCurrentDomain } from "~/features/rounds/hooks/useRound";

export function BallotEditor({
  projects = [],
  isLoading,
  maxAllocation = 100,
}: {
  projects?: { id: string; name: string }[];
  isLoading: boolean;
  maxAllocation?: number;
}) {
  const domain = useCurrentDomain();
  const { state, inc, dec, set, remove } = useBallotContext();
  const { sorted } = useSortBallot(projects);

  const projectById = useMemo(
    () => Object.fromEntries(projects.map((p) => [p.id, p])),
    [projects],
  );

  console.log(projects.map((p) => ({ ...p, state: state[p.id] })));
  return (
    <div>
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
                  <Link href={`/${domain}/projects/${id}`} tabIndex={-1}>
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
                      value={amount !== undefined ? amount : undefined}
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
