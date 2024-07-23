import { format } from "date-fns";
import { Clock, Trash } from "lucide-react";
import { Alert } from "~/components/ui/Alert";
import { Button } from "~/components/ui/Button";
import { Divider } from "~/components/ui/Divider";
import { FormSection } from "~/components/ui/Form";
import { Markdown } from "~/components/ui/Markdown";
import { RoundAdminLayout } from "~/features/admin/layouts/AdminLayout";
import { Layout } from "~/layouts/DefaultLayout";
import { api } from "~/utils/api";

export default function ApiKeysPage() {
  return (
    <RoundAdminLayout>
      {() => (
        <div>
          <ApiKeys />
        </div>
      )}
    </RoundAdminLayout>
  );
}

function ApiKeys() {
  const keys = api.apiKeys.list.useQuery();

  const utils = api.useUtils();
  const onSuccess = () => utils.apiKeys.invalidate();

  const createKey = api.apiKeys.create.useMutation({ onSuccess });
  const deleteKey = api.apiKeys.delete.useMutation({ onSuccess });

  const { data, isPending } = api.apiKeys.list.useQuery();
  if (isPending) return <div>loading...</div>;
  console.log(data);
  return (
    <FormSection
      title="API Keys"
      description="Create and manage API keys to integrate external pages. You can use these to fetch data about applications and projects."
    >
      {createKey.data && (
        <div className="mb-2">
          API key created. Copy and store this in a safe place.
          <Markdown>
            {`\`\`\`
${createKey.data?.key}
\`\`\``}
          </Markdown>
        </div>
      )}
      {keys.data && (
        <div className="mb-2 space-y-2 divide-y rounded border">
          {!keys.isPending && !keys.data?.length && (
            <div className="p-4 text-center text-gray-500">
              You haven't created any API keys yet
            </div>
          )}
          {keys.data?.map((key) => (
            <div
              key={key.id}
              className="flex items-center  justify-between p-4"
            >
              <div>
                <pre>{key.id}</pre>
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="size-3" />
                  {format(key.createdAt, "PPP")}
                </div>
              </div>

              <Button
                icon={Trash}
                isLoading={
                  deleteKey.variables?.id === key.id && deleteKey.isPending
                }
                onClick={() => deleteKey.mutate({ id: key.id })}
              />
            </div>
          ))}
        </div>
      )}
      <Button
        isLoading={createKey.isPending}
        onClick={() => createKey.mutate()}
      >
        Create API key
      </Button>

      <Divider className={"my-8"} />

      <Markdown>
        {`
\`\`\`tsx
// Example
const input = JSON.stringify({ json: {}})
await fetch("https://easyretropgf.xyz/api/trpc/projects.search?input=" + encodeURIComponent(input), {
    headers: {
        "content-type": "application/json",
        "round-id": "<your round id>"
        "x-api-key": "<api key>"
    }
}).then(res => res.json())

\`\`\`
      `}
      </Markdown>
    </FormSection>
  );
}

function CreateApiKey() {
  const { data, mutate, isPending } = api.apiKeys.create.useMutation();
  console.log("data", data);
  return (
    <Button isLoading={isPending} onClick={() => mutate()}>
      Create API Key
    </Button>
  );
}
