import { type z } from "zod";
import { tv } from "tailwind-variants";
import {
  type ComponentPropsWithRef,
  type PropsWithChildren,
  type ReactElement,
  type ComponentPropsWithoutRef,
  forwardRef,
  cloneElement,
  useEffect,
} from "react";
import {
  FormProvider,
  useForm,
  useFormContext,
  type UseFormProps,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createComponent } from ".";
// import { Search } from "../icons";
import clsx from "clsx";

const inputBase = [
  "flex",
  "w-full",
  "border",
  "border-gray-300",
  "bg-background",
  "px-3",
  "py-2",
  "bg-transparent",
  "text-gray-900",
  "dark:text-gray-100",
  "ring-offset-background",
  "file:border-0",
  "placeholder:text-gray-600",
  "focus-visible:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-ring",
  "focus-visible:ring-offset-2",
  "disabled:cursor-not-allowed",
  "disabled:bg-gray-200",
  "disabled:dark:bg-gray-800",
  "disabled:opacity-50",
];
export const Input = createComponent(
  "input",
  tv({
    base: [...inputBase, "h-12"],
    variants: {
      error: {
        true: "ring-primary-500",
      },
    },
  }),
);
export const InputWrapper = createComponent(
  "div",
  tv({
    base: "flex w-full relative",
    variants: {},
  }),
);
export const InputAddon = createComponent(
  "div",
  tv({
    base: "absolute right-0 text-gray-900 dark:text-gray-100 inline-flex items-center justify-center h-full border-gray-300 border-l px-4 font-semibold",
    variants: {
      disabled: {
        true: "text-gray-500 dark:text-gray-500",
      },
    },
  }),
);

export const InputIcon = createComponent(
  "div",
  tv({
    base: "absolute text-gray-600 left-0 inline-flex items-center justify-center h-full px-4",
  }),
);

export const SearchInput = forwardRef(function SearchInput(
  { ...props }: ComponentPropsWithRef<typeof Input>,
  ref,
) {
  return (
    <InputWrapper className="">
      <InputIcon>
        SEARCH
        {/* <Search /> */}
      </InputIcon>
      <Input ref={ref} {...props} className="pl-10" />
    </InputWrapper>
  );
});

export const Label = createComponent("label", tv({ base: "pb-1 block" }));
export const Textarea = createComponent("textarea", tv({ base: inputBase }));

export const FormControl = ({
  name,
  label,
  hint,
  required,
  children,
  className,
}: {
  name: string;
  label: string;
  required?: boolean;
  hint?: string;
} & ComponentPropsWithoutRef<"fieldset">) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];
  return (
    <fieldset className={clsx("mb-4", className)}>
      <Label htmlFor={name}>
        {label}
        {required ? <span className="text-red-300">*</span> : ""}
      </Label>
      {cloneElement(children as ReactElement, { id: name, ...register(name) })}
      {hint ? <div className="pt-1 text-xs text-gray-500">{hint}</div> : null}
      {error ? (
        <div className="pt-1 text-xs text-red-500">
          {error.message as string}
        </div>
      ) : null}
    </fieldset>
  );
};

export interface FormProps<S extends z.Schema> extends PropsWithChildren {
  defaultValues?: UseFormProps<z.infer<S>>["defaultValues"];
  schema: S;
  onSubmit: (values: z.infer<S>) => void;
  onChange?: (values: z.infer<S>) => void;
}

export function Form<S extends z.Schema>({
  defaultValues,
  schema,
  children,
  onSubmit,
  onChange,
}: FormProps<S>) {
  // Initialize the form with defaultValues and schema for validation
  const form = useForm({
    defaultValues,
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const formValues = form.watch();
  useEffect(() => {
    onChange?.(formValues);
  }, [formValues, onChange]);

  // Pass the form methods to a FormProvider. This lets us access the form from components without passing props.
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit((values) => onSubmit(values))}>
        {children}
      </form>
    </FormProvider>
  );
}
