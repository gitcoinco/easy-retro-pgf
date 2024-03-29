import { forwardRef, type ComponentPropsWithRef } from "react";
import { NumericFormat } from "react-number-format";
import { useController, useFormContext } from "react-hook-form";

import { Input, InputWrapper } from "~/components/ui/Form";

export const NumberInput = forwardRef(function NumberInput(
  {
    name,
    children,
    onBlur,
    ...props
  }: {
    disabled?: boolean;
    error?: boolean;
  } & ComponentPropsWithRef<"input">,
  ref,
) {
  const { control, setValue } = useFormContext();
  const { field } = useController({ name: name!, control });
  console.log(props.className);
  return (
    <InputWrapper className="min-w-[160px]">
      <NumericFormat
        aria-label="number-input"
        customInput={Input}
        error={props.error}
        name={name}
        ref={ref}
        autoComplete="off"
        className={props.className}
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
      {children}
    </InputWrapper>
  );
});
