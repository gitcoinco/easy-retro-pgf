import { CandlestickChart, LayoutGrid, Plus, Trash } from "lucide-react";
import { useController, useFieldArray, useFormContext } from "react-hook-form";
import { isAfter } from "date-fns";
import {
  Checkbox,
  Form,
  FormControl,
  FormSection,
  Input,
  InputWithAddon,
  Textarea,
} from "~/components/ui/Form";
import { RoundAdminLayout } from "~/features/admin/layouts/AdminLayout";
import { Button } from "~/components/ui/Button";
import { RoundSchema, roundTypes } from "~/features/rounds/types";
import { useUpdateRound } from "~/features/rounds/hooks/useRound";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { ImageUpload } from "~/components/ImageUpload";
import { createComponent } from "~/components/ui";
import { tv } from "tailwind-variants";
import { createElement } from "react";
import { AvailableMetrics } from "~/features/metrics/types";

export default function AdminPage() {
  return (
    <RoundAdminLayout className="max-w-screen-md">
      {({ data }) => <RoundForm round={data!} />}
    </RoundAdminLayout>
  );
}

function RoundForm({ round }: { round: RoundSchema }) {
  const utils = api.useUtils();
  const router = useRouter();
  const update = useUpdateRound();

  return (
    <Form
      defaultValues={{ ...round }}
      onSubmit={(values) => {
        update.mutate(values, {
          /* eslint-disable */
          async onSuccess({ domain }) {
            utils.rounds.invalidate();
            if (domain !== round.domain) router.push(`/${domain}/admin`);
            /* eslint-enable */
          },
        });
      }}
      schema={RoundSchema.partial()}
    >
      <FormSection
        title="Round details"
        description="Fill out the details about your your round. You can change most of these at any time."
      >
        <FormControl name="name" label="Name">
          <Input />
        </FormControl>

        <FormControl className="flex-1" name="domain" label="Round URL">
          <InputWithAddon addon="https://easyretropgf.xyz/" />
        </FormControl>

        <FormControl required label="Image" name="bannerImageUrl">
          <ImageUpload className="h-48 " />
        </FormControl>

        <FormControl name="description" label="Description">
          <Textarea rows={10} />
        </FormControl>

        <FormControl name="type" label="Round Type">
          <SelectRoundType />
        </FormControl>
      </FormSection>

      <Metrics disabled={isAfter(new Date(), round.startsAt ?? new Date())} />
      <Categories
        disabled={isAfter(new Date(), round.startsAt ?? new Date())}
      />

      <div className="flex justify-end">
        <Button variant="primary" type="submit" isLoading={update.isPending}>
          Save round
        </Button>
      </div>
    </Form>
  );
}

function SelectRoundType({ name = "" }) {
  const { control } = useFormContext();
  const { field } = useController({ control, name });
  const icons = [CandlestickChart, LayoutGrid] as const;
  return (
    <div className="flex gap-4">
      {Object.entries(roundTypes).map(([key, label], i) => (
        <RoundTypeItem
          key={key}
          checked={field.value === key}
          onClick={() => field.onChange(key)}
        >
          {createElement(icons[i]!, { className: "size-8" })}
          {label}
        </RoundTypeItem>
      ))}
    </div>
  );
}

const RoundTypeItem = createComponent(
  "div",
  tv({
    base: "flex flex-col flex-1 items-center gap-2 font-semibold border-2 transition-colors p-4 rounded cursor-pointer hover:bg-gray-50",
    variants: {
      checked: {
        true: "border-primary-500 bg-primary-50 hover:bg-primary-100",
      },
    },
  }),
);

function Metrics({ disabled = false }) {
  const { register, watch } = useFormContext();

  if (watch("type") !== "impact") return null;

  return (
    <FormSection
      title="Metrics"
      description="Define your impact metrics to vote for. Once the application phase has started you can only rename the category labels (not add or remove)."
    >
      <div className="space-y-1">
        {Object.entries(AvailableMetrics).map(([metricId, name]) => (
          <label
            key={metricId}
            className="flex flex-1 cursor-pointer items-center gap-2 p-1"
          >
            <Checkbox value={metricId} {...register(`metrics`)} />
            {name}
          </label>
        ))}
      </div>
    </FormSection>
  );
}

function Categories({ disabled = false }) {
  const { control, register, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name: "categories",
    control,
  });

  if (watch("type") !== "project") return null;

  return (
    <FormSection
      title="Categories"
      description="Define your impact categories for the projects. Once the application phase has started you can only rename the category labels (not add or remove)."
    >
      <div className="flex-1">
        <div className="space-y-1">
          {fields.map((field, i) => (
            <div key={i} className="flex justify-end gap-1">
              <FormControl name={`categories.${i}.label`}>
                <Input placeholder={`Impact category...`} />
              </FormControl>
              <input
                type="hidden"
                {...register(`categories.${i}.id`)}
                value={i}
              />
              <Button
                disabled={disabled}
                variant="ghost"
                icon={Trash}
                onClick={() => remove(i)}
              />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end">
          <Button
            disabled={disabled}
            icon={Plus}
            onClick={() => append({ name: "" })}
          >
            Add category
          </Button>
        </div>
      </div>
    </FormSection>
  );
}
