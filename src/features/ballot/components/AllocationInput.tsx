import { forwardRef, type ComponentPropsWithRef } from "react";
import { NumericFormat } from "react-number-format";
import { useController, useFormContext } from "react-hook-form";

import { Input, InputAddon, InputWrapper } from "~/components/ui/Form";
import { useRoundToken } from "~/features/distribute/hooks/useAlloPool";
import { cn } from "~/utils/classNames";

export const AllocationInput = forwardRef(function AllocationInput(
  {
    name,
    onBlur,
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
  const { control, setValue } = useFormContext();
  const { field } = useController({ name: name!, control });
  return (
    <InputWrapper className="min-w-[160px]">
      <NumericFormat
        aria-label="allocation-input"
        customInput={Input}
        error={props.error}
        name={name}
        ref={ref}
        autoComplete="off"
        className={cn({ ["pr-16"]: tokenAddon })}
        // isAllowed={({ floatValue }) =>
        //   (floatValue ?? 0) <= config.votingMaxProject
        // }
        value={field.value as number}
        disabled={props.disabled}
        defaultValue={props.defaultValue as string}
        onChange={(v) =>
          // Parse decimal string to number to adhere to AllocationSchema
          setValue(name!, parseFloat(v.target.value.replace(/,/g, "")))
        }
        onBlur={onBlur}
        thousandSeparator=","
      />
      {tokenAddon && (
        <InputAddon disabled={props.disabled}>{token.data?.symbol}</InputAddon>
      )}
    </InputWrapper>
  );
});
