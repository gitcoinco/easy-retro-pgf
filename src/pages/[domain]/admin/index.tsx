import { Plus, Trash } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { isAfter } from "date-fns";
import {
  Form,
  FormControl,
  FormSection,
  Input,
  InputWithAddon,
  Textarea,
} from "~/components/ui/Form";
import { RoundAdminLayout } from "~/features/admin/layouts/AdminLayout";
import { Button } from "~/components/ui/Button";
import { RoundSchema } from "~/features/rounds/types";
import { useUpdateRound } from "~/features/rounds/hooks/useRound";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { ImageUpload } from "~/components/ImageUpload";

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

  console.group(round);
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
          <InputWithAddon addon="https://raf.obol.org/" />
        </FormControl>

        <FormControl required label="Image" name="bannerImageUrl">
          <ImageUpload className="h-48 " />
        </FormControl>

        <FormControl name="description" label="Description">
          <Textarea rows={10} />
        </FormControl>
      </FormSection>
      <FormSection
        title="Impact categories"
        description="Define your impact categories for the application form. Once the application phase has started you can only rename the category labels (not add or remove)."
      >
        <Categories
          disabled={isAfter(new Date(), round.startsAt ?? new Date())}
        />
      </FormSection>

      <div className="flex justify-end">
        <Button variant="primary" type="submit" isLoading={update.isPending}>
          Save round
        </Button>
      </div>
    </Form>
  );
}

function Categories({ disabled = false }) {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name: "categories",
    control,
  });

  return (
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
  );
}
