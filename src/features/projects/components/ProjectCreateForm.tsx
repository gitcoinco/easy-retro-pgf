import { SignerOrProvider } from "@ethereum-attestation-service/eas-sdk/dist/transaction";
import { useMutation } from "@tanstack/react-query";
import { PlusIcon, Trash } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { z } from "zod";
import { Button, IconButton } from "~/components/ui/Button";
import {
  Form,
  FormControl,
  Input,
  Label,
  Select,
  Textarea,
} from "~/components/ui/Form";
import { Heading } from "~/components/ui/Heading";
import { eas } from "~/config";
import { createAttestation } from "~/utils/eas";

const MetadataSchema = z.object({
  name: z.string().min(3),
  metadataType: z.enum(["1"]),
  metadataPtr: z.string().min(3),
});

const contributionTypes = {
  CONTRACT_ADDRESS: "Contract address",
  GITHUB_REPO: "Github repo",
  OTHER: "Other",
} as const;

const reverseKeys = (obj: Record<string, string>) =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [v, k]));

const ApplicationCreateSchema = z.object({
  name: z.string(),
  websiteUrl: z.string().url(),
  payoutAddress: z.string().startsWith("0x"),
  contributionDescription: z.string(),
  impactDescription: z.string(),
  contributionLinks: z.array(
    z.object({
      description: z.string(),
      type: z.nativeEnum(reverseKeys(contributionTypes)),
      url: z.string().url(),
    }),
  ),
  impactMetrics: z.array(
    z.object({
      description: z.string(),
      number: z.number(),
      url: z.string().url(),
    }),
  ),
  fundingSources: z.array(z.object({})),
});

type ApplicationCreateSchema = z.infer<typeof ApplicationCreateSchema>;
function useCreateAttestation() {
  const signer = {} as SignerOrProvider;
  return useMutation(
    async (data: { values: Record<string, unknown>; schemaUID: string }) => {
      if (!signer) throw new Error("Connect wallet first");
      return createAttestation(data, signer);
    },
  );
}

function useUploadMetadata() {
  return useMutation(async (data: Record<string, unknown>) =>
    Promise.resolve(data),
  );
}

function useCreateApplication() {
  const attestation = useCreateAttestation();
  const metadata = useUploadMetadata();
  return useMutation(async (values: ApplicationCreateSchema) => {
    console.log("Creating application: ", values);
    return metadata.mutateAsync(values).then((metadataPtr) =>
      attestation.mutateAsync({
        schemaUID: eas.schemas.metadata,
        values: { name: values.name, metadataPtr },
      }),
    );
  });
}

export function ProjectCreateForm() {
  const create = useCreateApplication();
  return (
    <div>
      <Form
        persist="application-draft"
        schema={ApplicationCreateSchema}
        onSubmit={(values) => {
          create.mutate(values, {
            onSuccess: () => {
              localStorage.removeItem("application-draft");
              // Redirect to confirmation page
            },
          });
        }}
      >
        <FormControl name="name" label="Name" required>
          <Input placeholder="Project name" />
        </FormControl>

        <div className="gap-4 md:flex">
          <FormControl
            className="flex-1"
            name="websiteUrl"
            label="Website"
            required
          >
            <Input placeholder="https://" />
          </FormControl>

          <FormControl
            className="flex-1"
            name="payoutAddress"
            label="Payout address"
            required
          >
            <Input placeholder="0x..." />
          </FormControl>
        </div>

        <FormControl
          name="contributionDescription"
          label="Contribution description"
          required
        >
          <Textarea
            rows={6}
            placeholder="What have your project contributed to?"
          />
        </FormControl>

        <FormControl
          name="impactDescription"
          label="Impact description"
          required
        >
          <Textarea rows={6} placeholder="What impact has your project had?" />
        </FormControl>

        <ContributionLinks />
        <FormErrors />

        <div className="flex justify-end">
          <Button variant="primary" type="submit">
            Create application
          </Button>
        </div>
      </Form>
    </div>
  );
}

function ContributionLinks() {
  const form = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "contributionLinks",
  });
  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading as="h3" size="lg" className="mb-0 mt-0 text-gray-300">
          Contribution links
        </Heading>
        <IconButton
          variant="primary"
          size="sm"
          icon={PlusIcon}
          onClick={() => append({})}
        >
          Add
        </IconButton>
      </div>
      <div className="flex gap-4">
        <Label className="md:w-1/3">Description</Label>
        <Label className="md:w-1/3">Contribution URL</Label>
        <Label className="max-w-12 md:w-1/3">Type</Label>
        <div />
      </div>
      {fields.map((field, i) => (
        <div key={field.id} className="flex gap-4">
          <FormControl
            className="md:w-1/3"
            name={`contributionLinks.${i}.description`}
            required
          >
            <Input placeholder="Link description..." />
          </FormControl>
          <FormControl
            className="md:w-1/3"
            name={`contributionLinks.${i}.url`}
            required
          >
            <Input placeholder="https://" />
          </FormControl>
          <FormControl
            className="flex-1"
            name={`contributionLinks.${i}.type`}
            required
          >
            <Select>
              {Object.entries(contributionTypes).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </FormControl>

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
    </div>
  );
}

function FormErrors() {
  const form = useFormContext();
  console.log(form.formState.errors);

  return <pre>errors</pre>;
  return <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre>;
}
