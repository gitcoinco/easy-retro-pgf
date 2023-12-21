import { createGlobalState, useHarmonicIntervalFn } from "react-use";
import { tv } from "tailwind-variants";

import { calculateTimeLeft } from "~/utils/time";
import { createComponent } from "~/components/ui";

const VOTING_END_DATE =
  process.env.NEXT_PUBLIC_VOTING_END_DATE ??
  new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).toISOString();

const useEndDate = createGlobalState<[number, number, number, number]>([
  0, 0, 0, 0,
]);
export function useVotingTimeLeft() {
  const [state, setState] = useEndDate();

  useHarmonicIntervalFn(
    () => setState(calculateTimeLeft(new Date(VOTING_END_DATE))),
    1000,
  );

  return state;
}
export const VotingEndsIn = () => {
  const [days, hours, minutes, seconds] = useVotingTimeLeft();

  if (seconds < 0) {
    return <div>Voting has ended</div>;
  }

  return (
    <div>
      <TimeSlice>{days}d</TimeSlice>:<TimeSlice>{hours}h</TimeSlice>:
      <TimeSlice>{minutes}m</TimeSlice>:<TimeSlice>{seconds}s</TimeSlice>
    </div>
  );
};

const TimeSlice = createComponent(
  "span",
  tv({ base: "text-gray-900 dark:text-gray-300" }),
);
