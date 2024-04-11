import { forwardRef, type ComponentPropsWithRef } from "react";
import { useFormContext, useController } from "react-hook-form";

import { InputAddon } from "~/components/ui/Form";
import { useRoundToken } from "~/features/distribute/hooks/useAlloPool";
import { NumberInput } from "./NumberInput";
import { cn } from "~/utils/classNames";
import { useCurrentRound } from "~/features/rounds/hooks/useRound";

export const AllocationInput = forwardRef(function AllocationInput(
  {
    name,
    tokenAddon,
    ...props
  }: {
    disabled?: boolean;
    tokenAddon?: boolean;
    error?: boolean;
  } & ComponentPropsWithRef<"input">,
  ref,
) {
  const token = useRoundToken();
  const { data: round } = useCurrentRound();
  const { control } = useFormContext();
  const { field } = useController({ name: name!, control });

  const maxVotesProject = round?.maxVotesProject ?? 0;

  return (
    <NumberInput
      name={name}
      ref={ref}
      {...props}
      decimalScale={0}
      // Enable this to totally stop the number entry if it surpasses max votes for project
      // isAllowed={({ floatValue }) => (floatValue ?? 0) <= maxVotesProject}
      className={cn({
        ["pr-16"]: tokenAddon,
        ["border-red-600 dark:border-red-900"]: field.value > maxVotesProject,
      })}
    >
      {tokenAddon && (
        <InputAddon disabled={props.disabled}>{token.data?.symbol}</InputAddon>
      )}
    </NumberInput>
  );
});
