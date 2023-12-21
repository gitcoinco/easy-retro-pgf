import { type ComponentPropsWithRef } from "react";
import { NumericFormat } from "react-number-format";
import { useFormContext, Controller } from "react-hook-form";

import { MAX_ALLOCATION_PROJECT } from "~/features/projects/components/AddToBallot";
import { Input, InputAddon, InputWrapper } from "~/components/ui/Form";

export const AllocationInput = ({
  name,
  onBlur,
  ...props
}: {
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
            customInput={Input}
            error={props.error}
            {...field}
            className="pr-16"
            isAllowed={({ floatValue }) =>
              (floatValue ?? 0) <= MAX_ALLOCATION_PROJECT
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
      <InputAddon disabled={props.disabled}>OP</InputAddon>
    </InputWrapper>
  );
};
