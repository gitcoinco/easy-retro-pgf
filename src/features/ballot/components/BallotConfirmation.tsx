import { tv } from "tailwind-variants";
import Link from "next/link";
import React from "react";
import { Lock } from "lucide-react";

import { AllocationList } from "./AllocationList";
import { Button } from "~/components/ui/Button";
import { createComponent } from "~/components/ui";
import { type Vote } from "../types";
import { config } from "~/config";

const feedbackUrl = process.env.NEXT_PUBLIC_FEEDBACK_URL;

const Card = createComponent(
  "div",
  tv({ base: "rounded-3xl border p-8 dark:border-gray-700" }),
);

export const BallotConfirmation = ({ votes }: { votes: Vote[] }) => {
  return (
    <section>
      <div className="grid gap-6">
        <Card>
          <div className="flex flex-col items-center gap-10 sm:flex-row sm:gap-16">
            <div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-gray-100 md:text-4xl">
                Your vote has been received 🥳
              </h3>
              <p className="mb-10 text-gray-700 dark:text-gray-300">
                Thank you for participating in RetroPGF 3. Please help us
                improve the process by providing feedback on your experience as
                a badgeholder!
              </p>
              <Button
                variant="primary"
                as={Link}
                target="_blank"
                href={feedbackUrl}
              >
                Share your feedback
              </Button>
            </div>
            <div className="h-[400px] max-h-[30vw] w-[400px] max-w-[30vw] flex-shrink-0 rounded-[40px]" />
          </div>
        </Card>

        <Card>
          <div className="mb-6">
            <h5 className="mb-3 text-2xl font-bold">
              Here&apos;s how you voted!
            </h5>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Lock className="h-4 w-4 " />
              <p>Your vote will always be private</p>
            </div>
          </div>
          <div className="flex items-center justify-between border-b py-3 text-gray-600 dark:border-gray-700 dark:text-gray-300">
            <p>Project name</p>
            <p>{config.tokenName} allocated by you</p>
          </div>

          <section className="max-h-[480px] overflow-y-scroll">
            {votes && <AllocationList votes={votes} />}
          </section>
        </Card>
        <Card>
          <div>
            <h5 className="mb-3 text-2xl font-bold">
              Help us improve next round of RetroPGF
            </h5>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Your anonymized feedback will be influential to help us iterate on
              Optimism&apos;s RetroPGF process.
            </p>
            <Button
              variant="primary"
              as={Link}
              target="_blank"
              href={feedbackUrl}
            >
              Share your feedback
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};
