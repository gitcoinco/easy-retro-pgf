import {
  forwardRef,
  type ComponentPropsWithRef,
  type PropsWithChildren,
} from "react";
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
    decimalScale?: number;
  } & PropsWithChildren &
    ComponentPropsWithRef<"input">,
  ref,
) {
  const { control, setValue } = useFormContext();
  const { field } = useController({ name: name!, control });

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
        value={field.value}
        disabled={props.disabled}
        defaultValue={props.defaultValue}
        onChange={(v) =>
          // Parse decimal string to number to adhere to AllocationSchema
          setValue(name!, parseFloat(v.target.value.replace(/,/g, "")))
        }
        onBlur={onBlur}
        thousandSeparator=","
        {...props}
      />
      {children}
    </InputWrapper>
  );
});
