import { type ComponentPropsWithRef } from "react";
import { NumericFormat } from "react-number-format";
import { useFormContext, Controller } from "react-hook-form";

import { Input, InputAddon, InputWrapper } from "~/components/ui/Form";
import { config } from "~/config";

export const AllocationInput = ({
  votingMaxProject,
  name,
  onBlur,
  ...props
}: {
  votingMaxProject: number;
  disabled?: boolean;
  error?: boolean;
} & ComponentPropsWithRef<"input">) => {
  const form = useFormContext();

  return (
    <InputWrapper className="min-w-[160px]">
      <Controller
        control={form.control}
        name={name!}
        render={({ field }) => (
          <NumericFormat
            aria-label="allocation-input"
            customInput={Input}
            error={props.error}
            {...field}
            className="pr-16"
            isAllowed={({ floatValue }) =>
              (floatValue ?? 0) <= votingMaxProject
            }
            disabled={props.disabled}
            defaultValue={props.defaultValue as string}
            onChange={(v) =>
              // Parse decimal string to number to adhere to AllocationSchema
              field.onChange(parseFloat(v.target.value.replace(/,/g, "")))
            }
            onBlur={onBlur}
            thousandSeparator=","
          />
        )}
      />
      <InputAddon disabled={props.disabled}>{config.tokenName}</InputAddon>
    </InputWrapper>
  );
};
