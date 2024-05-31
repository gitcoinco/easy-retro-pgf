import { z } from "zod";

import { ImageUpload } from "~/components/ImageUpload";
import { IconButton } from "~/components/ui/Button";
import {
  ErrorMessage,
  FieldArray,
  Form,
  FormControl,
  FormSection,
  Input,
  Label,
  Select,
  Textarea,
} from "~/components/ui/Form";
import { Spinner } from "~/components/ui/Spinner";
import { impactCategories } from "~/config";
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
import { useLocalStorage } from "react-use";
import { Alert } from "~/components/ui/Alert";
import { useAccount } from "wagmi";

const ApplicationCreateSchema = z.object({
  profile: ProfileSchema,
  application: ApplicationSchema,
});

export function ApplicationForm({ address = "" }) {
  const clearDraft = useLocalStorage("application-draft")[2];

  const create = useCreateApplication({
    onSuccess: () => {
      toast.success("Application created successfully!");
      clearDraft();
    },
    onError: (err: { reason?: string; data?: { message: string } }) =>
      toast.error("Application create error", {
        description: err.reason ?? err.data?.message,
      }),
  });
  if (create.isSuccess) {
    return (
      <Alert variant="success" title="Application created!">
        It will now be reviewed by our admins.
      </Alert>
    );
  }
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
        <FormSection
          title="Profile"
          description="Configure your profile name and choose your avatar and background for your project."
        >
          <FormControl name="profile.name" label="Profile name" required>
            <Input placeholder="Your name" />
          </FormControl>
          <div className="mb-4 gap-4 md:flex">
            <FormControl
              required
              label="Project avatar"
              name="profile.profileImageUrl"
            >
              <ImageUpload className="h-48 w-48 " />
            </FormControl>
            <FormControl
              required
              label="Project background image"
              name="profile.bannerImageUrl"
              className="flex-1"
            >
              <ImageUpload className="h-48 " />
            </FormControl>
          </div>
        </FormSection>
        <FormSection
          title="Application"
          description="Configure your application and the payout address to where tokens will be transferred."
        >
          <FormControl name="application.name" label="Name" required>
            <Input placeholder="Project name" />
          </FormControl>

          <FormControl name="application.bio" label="Description" required>
            <Textarea rows={4} placeholder="Project description" />
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
        </FormSection>

        <FormSection
          title="Contribution & Impact"
          description="Describe the contribution and impact of your project."
        >
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
            <Textarea
              rows={4}
              placeholder="What impact has your project had?"
            />
          </FormControl>
          <ImpactTags />
        </FormSection>

        <FormSection
          title="Contribution links"
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
        </FormSection>

        <FormSection
          title="Impact metrics"
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
        </FormSection>

        <FormSection
          title="Funding sources"
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
        </FormSection>

        {error ? (
          <div className="mb-4 text-center text-gray-600 dark:text-gray-400">
            Make sure you&apos;re not connected to a VPN since this can cause
            problems with the RPC and your wallet.
          </div>
        ) : null}

        <CreateApplicationButton
          isLoading={create.isPending}
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
  const { isCorrectNetwork, correctNetwork } = useIsCorrectNetwork();

  const { address } = useAccount();

  return (
    <div className="flex items-center justify-between">
      <div>
        {!address && <div>You must connect wallet to create a list</div>}
        {!isCorrectNetwork && (
          <div className="flex items-center gap-2">
            You must be connected to {correctNetwork.name}
          </div>
        )}
      </div>

      <IconButton
        icon={isLoading ? Spinner : null}
        disabled={isLoading}
        variant="primary"
        type="submit"
        isLoading={isLoading}
      >
        {buttonText}
      </IconButton>
    </div>
  );
}

function ImpactTags() {
  const { control, watch, formState } =
    useFormContext<z.infer<typeof ApplicationCreateSchema>>();
  const { field } = useController({
    name: "application.impactCategory",
    control,
  });

  const selected = watch("application.impactCategory") ?? [];

  const error = formState.errors.application?.impactCategory;
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
                const currentlySelected = isSelected
                  ? selected.filter((s) => s !== value)
                  : selected.concat(value);

                field.onChange(currentlySelected);
              }}
            >
              {label}
            </Tag>
          );
        })}
      </div>
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
    </div>
  );
}
