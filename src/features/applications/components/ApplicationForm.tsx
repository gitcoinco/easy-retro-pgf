import { z } from "zod";
import { type PropsWithChildren } from "react";

import { ImageUpload } from "~/components/ImageUpload";
import { IconButton } from "~/components/ui/Button";
import {
  FieldArray,
  Form,
  FormControl,
  Input,
  Label,
  Select,
  Textarea,
} from "~/components/ui/Form";
import { Heading } from "~/components/ui/Heading";
import { Spinner } from "~/components/ui/Spinner";
import { impactCategories } from "~/config";
import { useAccount } from "wagmi";
import {
  ApplicationSchema,
  ProfileSchema,
  contributionTypes,
  fundingSourceTypes,
} from "../types";
import { useCreateApplication } from "../hooks/useCreateApplication";
import { toast } from "sonner";
import { useController, useFormContext } from "react-hook-form";
import { Tag } from "~/components/ui/Tag";
import { useIsCorrectNetwork } from "~/hooks/useIsCorrectNetwork";

const ApplicationCreateSchema = z.object({
  profile: ProfileSchema,
  application: ApplicationSchema,
});

export function ApplicationForm({ address = "" }) {
  const create = useCreateApplication({
    onSuccess: () => {
      toast.success("Application created successfully!");
    },
    onError: (err: { reason?: string; data?: { message: string } }) =>
      toast.error("Application create error", {
        description: err.reason ?? err.data?.message,
      }),
  });
  const error = create.error;
  return (
    <div>
      <Form
        defaultValues={{
          application: {
            payoutAddress: address,
            contributionLinks: [{}],
            impactMetrics: [{}],
            fundingSources: [{}],
          },
        }}
        persist="application-draft"
        schema={ApplicationCreateSchema}
        onSubmit={async ({ profile, application }) => {
          console.log(application, profile);
          create.mutate({ application, profile });
        }}
      >
        <Heading as="h3" size="xl">
          Profile
        </Heading>
        <FormControl name="profile.name" label="Name" required>
          <Input placeholder="Your name" />
        </FormControl>
        <div className="mb-4 gap-4 md:flex">
          <FormControl required label="Avatar" name="profile.avatarImageUrl">
            <ImageUpload className="h-48 w-48 " />
          </FormControl>
          <FormControl
            required
            label="Cover image"
            name="profile.bannerImageUrl"
            className="flex-1"
          >
            <ImageUpload className="h-48 " />
          </FormControl>
        </div>
        <Heading as="h3" size="xl">
          Application
        </Heading>
        <FormControl name="application.name" label="Name" required>
          <Input placeholder="Project name" />
        </FormControl>

        <FormControl name="application.bio" label="Description" required>
          <Input placeholder="Project description" />
        </FormControl>
        <div className="gap-4 md:flex">
          <FormControl
            className="flex-1"
            name="application.websiteUrl"
            label="Website"
            required
          >
            <Input placeholder="https://" />
          </FormControl>

          <FormControl
            className="flex-1"
            name="application.payoutAddress"
            label="Payout address"
            required
          >
            <Input placeholder="0x..." />
          </FormControl>
        </div>

        <FormControl
          name="application.contributionDescription"
          label="Contribution description"
          required
        >
          <Textarea
            rows={4}
            placeholder="What have your project contributed to?"
          />
        </FormControl>

        <FormControl
          name="application.impactDescription"
          label="Impact description"
          required
        >
          <Textarea rows={4} placeholder="What impact has your project had?" />
        </FormControl>

        <ImpactTags />

        <ApplicationFormSection
          label="Contribution links"
          description="Where can we find your contributions?"
        >
          <FieldArray
            name="application.contributionLinks"
            renderField={(field, i) => (
              <>
                <FormControl
                  className="min-w-96 flex-1"
                  name={`application.contributionLinks.${i}.description`}
                  required
                >
                  <Input placeholder="Description" />
                </FormControl>
                <FormControl
                  name={`application.contributionLinks.${i}.url`}
                  required
                >
                  <Input placeholder="https://" />
                </FormControl>
                <FormControl
                  name={`application.contributionLinks.${i}.type`}
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
              </>
            )}
          />
        </ApplicationFormSection>

        <ApplicationFormSection
          label="Impact metrics"
          description="What kind of impact have your project made?"
        >
          <FieldArray
            name="application.impactMetrics"
            renderField={(field, i) => (
              <>
                <FormControl
                  className="min-w-96 flex-1"
                  name={`application.impactMetrics.${i}.description`}
                  required
                >
                  <Input placeholder="Description" />
                </FormControl>
                <FormControl
                  name={`application.impactMetrics.${i}.url`}
                  required
                >
                  <Input placeholder="https://" />
                </FormControl>
                <FormControl
                  name={`application.impactMetrics.${i}.number`}
                  required
                  valueAsNumber
                >
                  <Input type="number" placeholder="Number" />
                </FormControl>
              </>
            )}
          />
        </ApplicationFormSection>

        <ApplicationFormSection
          label="Funding sources"
          description="From what sources have you received funding?"
        >
          <FieldArray
            name="application.fundingSources"
            renderField={(field, i) => (
              <>
                <FormControl
                  className="min-w-96 flex-1"
                  name={`application.fundingSources.${i}.description`}
                  required
                >
                  <Input placeholder="Description" />
                </FormControl>
                <FormControl
                  name={`application.fundingSources.${i}.amount`}
                  required
                  valueAsNumber
                >
                  <Input type="number" placeholder="Amount" />
                </FormControl>
                <FormControl
                  name={`application.fundingSources.${i}.currency`}
                  required
                >
                  <Input placeholder="USD" />
                </FormControl>
                <FormControl
                  name={`application.fundingSources.${i}.type`}
                  required
                >
                  <Select>
                    {Object.entries(fundingSourceTypes).map(
                      ([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ),
                    )}
                  </Select>
                </FormControl>
              </>
            )}
          />
        </ApplicationFormSection>

        {error ? (
          <div className="mb-4 text-center text-gray-600 dark:text-gray-400">
            Make sure you&apos;re not connected to a VPN since this can cause
            problems with the RPC and your wallet.
          </div>
        ) : null}

        <CreateApplicationButton
          isLoading={create.isLoading}
          buttonText={
            create.isUploading
              ? "Uploading metadata"
              : create.isAttesting
                ? "Creating attestation"
                : "Create application"
          }
        />
      </Form>
    </div>
  );
}

function CreateApplicationButton({
  isLoading,
  buttonText,
}: {
  isLoading: boolean;
  buttonText: string;
}) {
  const { isConnected } = useAccount();
  const { isCorrectNetwork, correctNetwork } = useIsCorrectNetwork();

  return (
    <div className="flex items-center justify-between">
      <div>
        {!isConnected && <div>You must connect wallet to create a list</div>}
        {!isCorrectNetwork && (
          <div className="flex items-center gap-2">
            You must be connected to {correctNetwork.name}
          </div>
        )}
      </div>

      <IconButton
        icon={isLoading ? Spinner : null}
        disabled={isLoading || !isConnected}
        variant="primary"
        type="submit"
        isLoading={isLoading}
      >
        {buttonText}
      </IconButton>
    </div>
  );
}

function ApplicationFormSection({
  label,
  description,
  children,
}: PropsWithChildren<{ label: string; description: string }>) {
  return (
    <div>
      <div>
        <Heading as="h3" size="xl">
          {label}
        </Heading>
        <p className="mb-4 leading-loose text-gray-400">{description}</p>
      </div>

      <div>{children}</div>
    </div>
  );
}

function ImpactTags() {
  const { control, watch } = useFormContext();
  const { field } = useController({ name: "impactCategory", control });

  const selected = (watch("impactCategory") ?? []) as string[];

  return (
    <div className="mb-4">
      <Label>
        Impact categories<span className="text-red-300">*</span>
      </Label>
      <div className="flex flex-wrap gap-2">
        {Object.entries(impactCategories).map(([value, { label }]) => {
          const isSelected = selected.includes(value);
          return (
            <Tag
              size="lg"
              selected={isSelected}
              key={value}
              onClick={() => {
                field.onChange([value]);
              }}
            >
              {label}
            </Tag>
          );
        })}
      </div>
    </div>
  );
}
