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
  type ComponentProps,
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
import { Calendar, PlusIcon, Search, Trash } from "lucide-react";

const inputBase = [
  "border-gray-300",
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
    base: "absolute text-gray-900 inline-flex items-center justify-center h-full border-gray-300 border-l px-4 font-semibold",
    variants: {
      disabled: {
        true: "text-gray-500",
      },
      position: {
        left: "left-0",
        right: "right-0",
      },
    },
    defaultVariants: { position: "right" },
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

const CheckboxComponent = createComponent(
  "input",
  tv({
    base: [
      ...inputBase],
  }),
);

export const Checkbox = forwardRef(function Checkbox(
  props: ComponentPropsWithRef<typeof CheckboxComponent>,
  ref,
) {
  return <CheckboxComponent ref={ref} type="checkbox" {...props} />;
});

export const Label = createComponent(
  "label",
  tv({
    base: "block tracking-wider font-semibold",
  }),
);
export const Textarea = createComponent(
  "textarea",
  tv({ base: [...inputBase, "w-full"] }),
);

export const InputWithAddon = forwardRef(function InputWithAddon(
  { addon, ...props }: ComponentPropsWithRef<typeof Input> & { addon: string },
  ref,
) {
  return (
    <InputWrapper className={cn("items-center border", inputBase)}>
      <InputAddon
        position="left"
        className={
          "static whitespace-nowrap border-l-0 bg-gray-100 px-2 py-2.5 text-sm font-normal text-gray-600"
        }
      >
        {addon}
      </InputAddon>
      <Input ref={ref} {...props} className="border-y-0 border-l border-r-0" />
    </InputWrapper>
  );
});

export const SearchInput = forwardRef(function SearchInput(
  { ...props }: ComponentPropsWithRef<typeof Input>,
  ref,
) {
  return (
    <InputWrapper className="h-12">
      <InputIcon>
        <Search />
      </InputIcon>
      <Input ref={ref} {...props} className="rounded-lg pl-12" />
    </InputWrapper>
  );
});

export const DateInput = forwardRef(function DateInput(
  { ...props }: ComponentPropsWithRef<typeof Input>,
  ref,
) {
  return (
    <InputWrapper>
      <InputIcon>
        <Calendar className="size-4" />
      </InputIcon>
      <Input autoComplete={"off"} ref={ref} {...props} className="pl-10" />
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
  hint?: string | ReactElement;
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
        <Label className="mb-1" htmlFor={name}>
          {label}
          {required && <span className="text-primary-600">*</span>}
        </Label>
      )}
      {cloneElement(children as ReactElement, {
        id: name,
        error: Boolean(error),
        ...register(name, { valueAsNumber }),
      })}
      {hint && (
        <div className="pl-0.5 pt-1 text-xs text-gray-500">
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
        <div className="border border-red-900 p-2">
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
}: {
  title: ReactNode | string;
  description: ReactNode | string;
} & ComponentProps<"section">) {
  return (
    <section className="mb-8">
      <h3 className="mb-1 text-xl font-semibold">{title}</h3>
      <p className="mb-4 leading-loose text-gray-600">
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
}

export function Form<S extends z.Schema>({
  schema,
  children,
  persist,
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

  usePersistForm(form, persist);

  // Pass the form methods to a FormProvider. This lets us access the form from components with useFormContext
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit((values) => onSubmit(values, form))}>
        {children}
      </form>
    </FormProvider>
  );
}

function usePersistForm(form: UseFormReturn<FieldValues>, persist?: string) {
  // useLocalStorage needs a string to be initialized
  const [draft, saveDraft] = useLocalStorage(persist ?? "not-set");

  useInterval(() => {
    if (persist) saveDraft(form?.getValues());
  }, 3000);

  useEffect(() => {
    if (persist && draft) form?.reset(draft);
  }, [persist]);
}
