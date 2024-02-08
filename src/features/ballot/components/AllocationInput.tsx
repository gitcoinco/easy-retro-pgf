import { type ComponentPropsWithRef } from "react";
import { NumericFormat } from "react-number-format";
import { useFormContext, Controller } from "react-hook-form";

import { Input, InputAddon, InputWrapper } from "~/components/ui/Form";
import { config } from "~/config";
import { usePoolToken } from "~/features/distribute/hooks/useAlloPool";

export const AllocationInput = ({
  votingMaxProject,
  name,
  onBlur,
  tokenAddon,
  ...props
}: {
  votingMaxProject: number;
  disabled?: boolean;
  tokenAddon?: boolean;
  error?: boolean;
} & ComponentPropsWithRef<"input">) => {
  const form = useFormContext();

  const token = usePoolToken();

  return (
    <InputWrapper className="min-w-[160px]">
      <Controller
        control={form.control}
        name={name!}
        {...props}
        render={({ field }) => (
          <NumericFormat
            aria-label="allocation-input"
            customInput={Input}
            error={props.error}
            {...field}
            autoComplete="off"
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
      {tokenAddon && (
        <InputAddon disabled={props.disabled}>{token.data?.symbol || config.tokenName}</InputAddon>
      )}
    </InputWrapper>
  );
};
