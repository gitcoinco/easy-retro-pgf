import { createGlobalState, useHarmonicIntervalFn } from "react-use";
import { tv } from "tailwind-variants";

import { calculateTimeLeft } from "~/utils/time";
import { createComponent } from "~/components/ui";
import { useMaci } from "~/contexts/Maci";

const useEndDate = createGlobalState<[number, number, number, number]>([
  0, 0, 0, 0,
]);

export function useVotingTimeLeft(votingEndsAt: Date) {
  const [state, setState] = useEndDate();

  useHarmonicIntervalFn(() => setState(calculateTimeLeft(votingEndsAt)), 1000);

  return state;
}
export const VotingEndsIn = () => {
  const { isLoading, votingEndsAt } = useMaci();
  const [days, hours, minutes, seconds] = useVotingTimeLeft(votingEndsAt);

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
