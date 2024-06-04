import { type z } from "zod";
import { tv } from "tailwind-variants";
import {
  type ComponentPropsWithRef,
  type PropsWithChildren,
  type ReactElement,
  type ComponentPropsWithoutRef,
  type ReactNode,
  type ComponentProps,
  forwardRef,
  cloneElement,
} from "react";
import {
  FormProvider,
  useForm,
  useFormContext,
  type UseFormReturn,
  type UseFormProps,
  useFieldArray,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createComponent } from ".";
import { cn } from "~/utils/classNames";
import { IconButton } from "./Button";
import { PlusIcon, Search, Trash } from "lucide-react";

const inputBase = [
  "dark:bg-gray-900",
  "dark:text-gray-300",
  "dark:border-gray-700",
  "rounded",
  "disabled:opacity-30",
  "checked:bg-gray-800",
];
export const Input = createComponent(
  "input",
  tv({
    base: ["w-full", ...inputBase],
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
    base: "absolute right-0 text-gray-900 dark:text-gray-300 inline-flex items-center justify-center h-full border-gray-300 dark:border-gray-800 border-l px-4 font-semibold",
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

export const Checkbox = createComponent(
  "input",
  tv({
    base: [
      ...inputBase,
      "checked:focus:dark:bg-gray-700 checked:hover:dark:bg-gray-700",
    ],
  }),
);

export const Label = createComponent(
  "label",
  tv({
    base: "block tracking-wider dark:text-gray-300 font-semibold",
    variants: { required: { true: "after:content-['*']" } },
  }),
);
export const Textarea = createComponent(
  "textarea",
  tv({ base: [...inputBase, "w-full"] }),
);

export const SearchInput = forwardRef(function SearchInput(
  { ...props }: ComponentPropsWithRef<typeof Input>,
  ref,
) {
  return (
    <InputWrapper className="">
      <InputIcon>
        <Search />
      </InputIcon>
      <Input ref={ref} {...props} className="rounded-full pl-10" />
    </InputWrapper>
  );
});

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

  // Get error for name - handles field arrays (field.index.prop)
  const error = name.split(".").reduce(
    /* eslint-disable-next-line */
    (err, key) => (err as any)?.[key],
    errors,
  ) as unknown as { message: string };

  return (
    <fieldset className={cn("mb-4", className)}>
      {label && (
        <Label
          className="mb-1"
          htmlFor={name}
          required={required}
          children={label}
        />
      )}
      {cloneElement(children as ReactElement, {
        id: name,
        error: Boolean(error),
        ...register(name, { valueAsNumber }),
      })}
      {hint && (
        <div className="pt-1 text-xs text-gray-500 dark:text-gray-400">
          {hint}
        </div>
      )}
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
    </fieldset>
  );
};

export const ErrorMessage = createComponent(
  "div",
  tv({ base: "pt-1 text-xs text-red-500" }),
);

export function FieldArray<S extends z.Schema>({
  name,
  renderField,
}: {
  name: string;
  renderField: (field: z.infer<S>, index: number) => ReactNode;
}) {
  const form = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name,
  });

  const error = form.formState.errors[name]?.message ?? "";

  return (
    <div className="mb-8">
      {error && (
        <div className="border border-red-900 p-2 dark:text-red-500">
          {String(error)}
        </div>
      )}
      {fields.map((field, i) => (
        <div key={field.id} className="gap-4 md:flex">
          {renderField(field, i)}

          <div className="flex justify-end">
            <IconButton
              tabIndex={-1}
              type="button"
              variant="ghost"
              icon={Trash}
              onClick={() => remove(i)}
            />
          </div>
        </div>
      ))}
      <div className="flex justify-end">
        <IconButton
          type="button"
          size="sm"
          icon={PlusIcon}
          onClick={() => append({})}
        >
          Add row
        </IconButton>
      </div>
    </div>
  );
}

export function FormSection({
  title,
  description,
  children,
}: { title: string; description: string } & ComponentProps<"section">) {
  return (
    <section className="mb-8">
      <h3 className="mb-1 text-xl font-semibold">{title}</h3>
      <p className="mb-4 leading-loose text-gray-600 dark:text-gray-400">
        {description}
      </p>
      {children}
    </section>
  );
}

export interface FormProps<S extends z.Schema> extends PropsWithChildren {
  defaultValues?: UseFormProps<z.infer<S>>["defaultValues"];
  values?: UseFormProps<z.infer<S>>["values"];
  schema: S;
  onSubmit: (values: z.infer<S>, form: UseFormReturn<z.infer<S>>) => void;
}

export function Form<S extends z.Schema>({
  schema,
  children,
  values,
  defaultValues,
  onSubmit,
}: FormProps<S>) {
  // Initialize the form with defaultValues and schema for validation
  const form = useForm({
    defaultValues,
    values,
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  // Pass the form methods to a FormProvider. This lets us access the form from components with useFormContext
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit((values) => onSubmit(values, form))}>
        {children}
      </form>
    </FormProvider>
  );
}
