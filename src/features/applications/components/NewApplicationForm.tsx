import { SignerOrProvider } from "@ethereum-attestation-service/eas-sdk/dist/transaction";
import { useMutation } from "@tanstack/react-query";
import { PlusIcon, Trash } from "lucide-react";
import { ReactNode } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Z } from "vitest/dist/reporters-O4LBziQ_.js";
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
import { Spinner } from "~/components/ui/Spinner";
import { eas } from "~/config";
import { createAttestation } from "~/utils/eas";
import { reverseKeys } from "~/utils/reverseKeys";

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

const ApplicationCreateSchema = z.object({
  name: z.string(),
  websiteUrl: z.string().url(),
  payoutAddress: z.string().startsWith("0x"),
  contributionDescription: z.string(),
  impactDescription: z.string(),
  contributionLinks: z
    .array(
      z.object({
        description: z.string().min(3).describe("Description"),
        type: z.nativeEnum(reverseKeys(contributionTypes)).describe("Type"),
        url: z.string().url().describe("Contribution URL"),
      }),
    )
    .min(1),
  impactMetrics: z
    .array(
      z.object({
        description: z.string().min(3).describe("Description"),
        url: z.string().url().describe("Impact URL"),
        number: z.number().describe("Number"),
      }),
    )
    .min(1),
  fundingSources: z
    .array(
      z.object({
        description: z.string().describe("Description"),
        amount: z.number().describe("Amount"),
        currency: z.string().min(3).max(4).describe("Currency"),
        type: z.string().describe("Type"),
      }),
    )
    .min(1),
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
  return useMutation(
    async (data: Record<string, unknown>) =>
      new Promise((r) => setTimeout(() => r("metadataPtr"), 2000)),
  );
}

export function NewApplicationForm() {
  const attestation = useCreateAttestation();
  const metadata = useUploadMetadata();

  const error = metadata.error ?? attestation.error;

  console.log({ error });
  return (
    <div>
      <Form
        defaultValues={{
          contributionLinks: [{}],
          impactMetrics: [{}],
          fundingSources: [{}],
        }}
        persist="application-draft"
        schema={ApplicationCreateSchema}
        onSubmit={(values) => {
          metadata.mutate(values, {
            onSuccess: (metadataPtr) =>
              attestation.mutate(
                {
                  schemaUID: eas.schemas.metadata,
                  values: { name: values.name, metadataPtr },
                },
                {
                  onSuccess: () => {
                    // localStorage.removeItem("application-draft");
                    // Redirect to confirmation page
                  },
                },
              ),
          });
        }}
      >
        <FormControl name="name" label="Name" required>
          <Input placeholder="Impactful Project" className="text-3xl" />
        </FormControl>
        <div className="mb-4 gap-4 md:flex">
          <div>
            <Label>Avatar</Label>
            <div className="h-48 w-48 cursor-pointer rounded-xl bg-gray-800 transition-colors hover:bg-gray-700" />
          </div>
          <div className="flex-1">
            <Label>Cover image</Label>
            <div className="h-48 rounded-xl bg-gray-800" />
          </div>
        </div>

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
            rows={4}
            placeholder="What have your project contributed to?"
          />
        </FormControl>

        <FormControl
          name="impactDescription"
          label="Impact description"
          required
        >
          <Textarea rows={4} placeholder="What impact has your project had?" />
        </FormControl>

        <FieldArray
          name="contributionLinks"
          label="Contribution links"
          renderField={(field, i) => (
            <>
              <FormControl
                className="min-w-96 flex-1"
                name={`contributionLinks.${i}.description`}
                required
              >
                <Input placeholder="Description" />
              </FormControl>
              <FormControl name={`contributionLinks.${i}.url`} required>
                <Input placeholder="https://" />
              </FormControl>
              <FormControl name={`contributionLinks.${i}.type`} required>
                <Select>
                  {Object.entries(contributionTypes).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
        />

        <FieldArray
          name="impactMetrics"
          label="ImpactMetrics"
          renderField={(field, i) => (
            <>
              <FormControl
                className="min-w-96 flex-1"
                name={`impactMetrics.${i}.description`}
                required
              >
                <Input placeholder="Description" />
              </FormControl>
              <FormControl name={`impactMetrics.${i}.url`} required>
                <Input placeholder="https://" />
              </FormControl>
              <FormControl
                name={`impactMetrics.${i}.number`}
                required
                valueAsNumber
              >
                <Input type="number" placeholder="Number" />
              </FormControl>
            </>
          )}
        />

        <FieldArray
          name="fundingSources"
          label="Funding sources"
          renderField={(field, i) => (
            <>
              <FormControl
                className="min-w-96 flex-1"
                name={`fundingSources.${i}.description`}
                required
              >
                <Input placeholder="Description" />
              </FormControl>
              <FormControl
                name={`fundingSources.${i}.amount`}
                required
                valueAsNumber
              >
                <Input type="number" placeholder="Amount" />
              </FormControl>
              <FormControl name={`fundingSources.${i}.currency`} required>
                <Input placeholder="USD" />
              </FormControl>
              <FormControl name={`fundingSources.${i}.type`} required>
                <Select>
                  {Object.entries(contributionTypes).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
        />

        <div className="flex items-center justify-between">
          {error ? (
            <div className="text-red-600">{error.reason as string}</div>
          ) : (
            <div />
          )}
          <IconButton
            icon={metadata.isLoading || attestation.isLoading ? Spinner : null}
            disabled={metadata.isLoading || attestation.isLoading}
            variant="primary"
            type="submit"
            isLoading={metadata.isLoading || attestation.isLoading}
          >
            {metadata.isLoading
              ? "Uploading metadata"
              : attestation.isLoading
                ? "Creating attestation"
                : "Create application"}
          </IconButton>
        </div>
        <FormErrors />
      </Form>
    </div>
  );
}

function FieldArray<S extends z.Schema>({
  label,
  name,
  renderField,
}: {
  label: string;
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
      <div className="mb-2 flex items-center justify-between">
        <Heading as="h3" size="lg" className="mb-0 mt-0 text-gray-300">
          {label}
        </Heading>
      </div>
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
        <IconButton size="sm" icon={PlusIcon} onClick={() => append({})}>
          Add row
        </IconButton>
      </div>
    </div>
  );
}

function FormErrors() {
  const form = useFormContext();
  console.log(form.formState.errors);
  return <pre>errors {Object.keys(form.formState.errors).length}</pre>;
  return <pre>{JSON.stringify(errors, null, 2)}</pre>;
}
