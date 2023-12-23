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
  UseFormReturn,
  type UseFormProps,
  type FieldValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createComponent } from ".";
// import { Search } from "../icons";
import clsx from "clsx";
import { useInterval, useLocalStorage } from "react-use";

const inputBase = [
  "w-full",
  // "border-none",
  // "dark:bg-gray-800",
  "dark:bg-gray-900",
  // "!ring-gray-400",
  // "flex",
  // "w-full",
  // "border",
  // "border-gray-300",
  // "bg-background",
  // "px-3",
  // "py-2",
  // "bg-transparent",
  // "text-gray-900",
  // "dark:text-gray-100",
  // "ring-offset-background",
  // "file:border-0",
  // "placeholder:text-gray-600",
  // "focus-visible:outline-none",
  // "focus-visible:ring-2",
  // "focus-visible:ring-ring",
  // "focus-visible:ring-offset-2",
  // "disabled:cursor-not-allowed",
  // "disabled:bg-gray-200",
  // "disabled:dark:bg-gray-800",
  "disabled:opacity-30",
];
export const Input = createComponent(
  "input",
  tv({
    base: [...inputBase],
    variants: {
      error: {
        true: "!border-red-900",
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
    base: "absolute right-0 text-gray-900 dark:text-gray-300 inline-flex items-center justify-center h-full border-gray-300 dark:border-gray-500 border-l px-4 font-semibold",
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

export const Select = createComponent(
  "select",
  tv({
    base: [...inputBase],
    variants: {
      error: {
        true: "!border-red-900",
      },
    },
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

export const Label = createComponent(
  "label",
  tv({
    base: "block tracking-wider dark:text-gray-300",
    variants: { required: { true: "after:content-['*']" } },
  }),
);
export const Textarea = createComponent("textarea", tv({ base: inputBase }));

export const FormControl = ({
  name,
  label,
  hint,
  required,
  children,
  valueAsNumber,
  className,
}: {
  name: string;
  label?: string;
  required?: boolean;
  valueAsNumber?: boolean;
  hint?: string;
} & ComponentPropsWithoutRef<"fieldset">) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  // const error = errors[name];

  // Get error for name - handles field arrays (field.index.prop)
  const error = name.split(".").reduce(
    /* eslint-disable-next-line */
    (err, key) => (err as any)?.[key],
    errors,
  ) as unknown as { message: string };

  return (
    <fieldset className={clsx("mb-4", className)}>
      {label && <Label htmlFor={name} required={required} children={label} />}
      {cloneElement(children as ReactElement, {
        id: name,
        error: Boolean(error),
        ...register(name, { valueAsNumber }),
      })}
      {hint && <div className="pt-1 text-xs text-gray-500">{hint}</div>}
      {error && (
        <div className="pt-1 text-xs text-red-500">{error.message}</div>
      )}
    </fieldset>
  );
};

export interface FormProps<S extends z.Schema> extends PropsWithChildren {
  defaultValues?: UseFormProps<z.infer<S>>["defaultValues"];
  schema: S;
  persist?: string;
  onSubmit: (values: z.infer<S>) => void;
}

export function Form<S extends z.Schema>({
  schema,
  children,
  persist = "",
  defaultValues,
  onSubmit,
}: FormProps<S>) {
  // Initialize the form with defaultValues and schema for validation
  const form = useForm({
    defaultValues,
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  usePersistForm(persist, form);

  // Pass the form methods to a FormProvider. This lets us access the form from components with useFormContext
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit((values) => onSubmit(values))}>
        {children}
      </form>
    </FormProvider>
  );
}

function usePersistForm(persist: string, form: UseFormReturn<FieldValues>) {
  const [draft, saveDraft] = useLocalStorage(persist);

  useInterval(() => {
    if (persist) saveDraft(form?.getValues());
  }, 1000);

  useEffect(() => {
    if (persist && draft) form?.reset(draft);
  }, [persist]);
}
