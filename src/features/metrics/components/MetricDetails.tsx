"use client";

import { Heading } from "~/components/ui/Heading";
import { Markdown } from "~/components/ui/Markdown";
import { Spinner } from "~/components/ui/Spinner";
import { AddToBallotButton } from "./Buttons/AddToBallotButton";
import Link from "next/link";
import { ViewCalculationButton } from "./Buttons";

type MetricDetailsProps = {
  name: string;
  description: string;
  isPending?: boolean;
  id?: string;
};

export default function MetricDetails({
  name = "",
  description = "",
  isPending = false,
  id = "1",
}: MetricDetailsProps) {
  const calculationUrl = ""; // Provide a valid URL here

  return (
    <div className="space-y-6">
      {isPending ? (
        <div className="flex h-[500px] w-[580px] flex-col items-center justify-center rounded-[20px] bg-gray-200 shadow-md">
          <Spinner className="mb-4 h-8 w-8" />
          <p className="text-gray-700">Loading...</p>
        </div>
      ) : (
        <>
          <Heading as="h2" size="2xl">
            {name}
          </Heading>
          <Markdown>{description}</Markdown>
        </>
      )}
      <div className="flex items-center gap-2">
        <AddToBallotButton variant="destructive" id={id} />
        <Link href={calculationUrl} target="_blank">
          <ViewCalculationButton />
        </Link>
      </div>
    </div>
  );
}
