import { type ComponentPropsWithRef, forwardRef } from "react";
import { useController, useFormContext } from "react-hook-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { DateInput } from "./Form";
import { Calendar } from "./Calendar";
import { format } from "date-fns";

export const DatePicker = forwardRef(function DatePicker({
  name,
  ...props
}: { name: string } & ComponentPropsWithRef<typeof Calendar>) {
  const { control } = useFormContext();
  const { field } = useController({ name: name, control });

  return (
    <Popover>
      <PopoverTrigger>
        <DateInput value={format(field.value, "PPP")} />
      </PopoverTrigger>
      <PopoverContent
        sideOffset={4}
        className="relative !z-10 w-auto rounded  border bg-white p-0"
      >
        <Calendar
          mode="single"
          defaultMonth={field.value as Date}
          selected={field.value as Date}
          onSelect={field.onChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
});
