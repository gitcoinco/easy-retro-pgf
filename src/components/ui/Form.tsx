import { type z } from "zod";
import { tv } from "tailwind-variants";
import {
  type ComponentPropsWithRef,
  type PropsWithChildren,
  type ReactElement,
  type ComponentPropsWithoutRef,
  type ReactNode,
  forwardRef,
  cloneElement,
  useEffect,
} from "react";
import {
  FormProvider,
  useForm,
  useFormContext,
  type UseFormReturn,
  type UseFormProps,
  type FieldValues,
  useFieldArray,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createComponent } from ".";
import { cn } from "~/utils/classNames";
import { useInterval, useLocalStorage } from "react-use";
import { IconButton } from "./Button";
import { PlusIcon, Search, Trash } from "lucide-react";

const inputBase = [
  "dark:bg-transparent",
  "dark:text-onPrimary-light",
  "dark:border-onPrimary-light dark:hover:border-onSurface-dark dark:focus:outline-none dark:focus:ring-0 dark:focus:ring-offset-0 dark:focus:border-2 dark:focus:border-primary-dark dark:focus:shadow-none",
  "disabled:opacity-30",
  "checked:bg-outline-dark",
];
export const Input = createComponent(
  "input",
  tv({
    base: ["w-full", ...inputBase],
    variants: {
      error: {
        true: "!border-error-dark",
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
    base: "absolute right-0 text-gray-900 placeholder:text-onSurfaceVariant-dark dark:text-onSurfaceVariant-dark inline-flex items-center justify-center h-full border-gray-300 dark:border-gray-800 border-l px-4 font-semibold",
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
    base: ["w-full", ...inputBase],
    variants: {
      error: {
        true: "!border-error-dark",
      },
    },
  }),
);

export const Checkbox = createComponent(
  "input",
  tv({
    base: [
      ...inputBase,
      "checked:focus:dark:bg-onSurfaceVariant-dark checked:hover:dark:bg-onSurfaceVariant-dark",
    ],
  }),
);

export const Label = createComponent(
  "label",
  tv({
    base: "block mb-3 tracking-wider text-base dark:text-onSurface-dark font-semibold",
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
    <InputWrapper className="h-12">
      <InputIcon>
        <Search />
      </InputIcon>
      <Input ref={ref} {...props} className="rounded-full pl-12" />
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
  label?: ReactElement | string;
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
    <fieldset className={cn("mb-6", className)}>
      {label && (
        <Label className="mb-3" htmlFor={name}>
          {label}
          {required && <span className="text-onSurface-dark"> *</span>}
        </Label>
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
  tv({ base: "pt-1 text-xs text-error-dark" }),
);

export function FieldArray<S extends z.Schema>({
  name,
  renderField,
  isRequired = false,
}: {
  name: string;
  renderField: (field: z.infer<S>, index: number) => ReactNode;
  isRequired?: boolean;
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
        <div className="border border-error-dark p-2 dark:text-error-dark">
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
              disabled={isRequired && i === 0}
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
      <h3 className="mb-3 text-xl font-bold text-onSurface-dark">{title}</h3>
      <p className="mb-6 text-sm font-normal leading-loose text-onSurfaceVariant-dark">
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
  persist?: string;
  onSubmit: (values: z.infer<S>, form: UseFormReturn<z.infer<S>>) => void;
  isEditMode?: boolean;
}

export function Form<S extends z.Schema>({
  schema,
  children,
  persist,
  values,
  defaultValues,
  onSubmit,
  isEditMode = false,
}: FormProps<S>) {
  // Initialize the form with defaultValues and schema for validation
  const form = useForm({
    defaultValues,
    values,
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  usePersistForm(form, persist, defaultValues, isEditMode);

  // Pass the form methods to a FormProvider. This lets us access the form from components with useFormContext
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit((values) => onSubmit(values, form))}>
        {children}
      </form>
    </FormProvider>
  );
}

function usePersistForm<S extends z.Schema>(
  form: UseFormReturn<FieldValues>,
  persist?: string,
  defaultValues?: UseFormProps<z.infer<S>>["defaultValues"],
  isEditMode?: boolean,
) {
  // useLocalStorage needs a string to be initialized
  const [draft, saveDraft] = useLocalStorage(
    persist && !isEditMode ? persist : "not-set",
  );

  useInterval(() => {
    if (persist) saveDraft(form?.getValues());
  }, 3000);

  useEffect(() => {
    if (persist && draft) form?.reset(draft);
    else if (isEditMode) form?.reset(defaultValues);
  }, [persist, defaultValues]);
}
