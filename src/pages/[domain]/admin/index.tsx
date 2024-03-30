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
      schema={RoundSchema}
    >
      <FormSection
        title="Round details"
        description="Fill out the details about your your round. You can change most of these at any time."
      >
        <FormControl name="name" label="Name">
          <Input />
        </FormControl>

        <FormControl className="flex-1" name="domain" label="Round URL">
          <InputWithAddon addon="https://easy-retro-pgf.vercel.app/" />
        </FormControl>

        <FormControl name="description" label="Description">
          <Textarea rows={14} />
        </FormControl>
      </FormSection>

      <div className="flex justify-end">
        <Button variant="primary" type="submit" isLoading={update.isPending}>
          Save round
        </Button>
      </div>
    </Form>
  );
}
