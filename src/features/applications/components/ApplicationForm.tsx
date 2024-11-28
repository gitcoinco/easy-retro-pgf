import { z } from "zod";
import { type Address } from "viem";
import { toast } from "sonner";
import { useController, useFormContext } from "react-hook-form";
import { useLocalStorage } from "react-use";
import { useSession } from "next-auth/react";
import { useAccount, useBalance } from "wagmi";

import { ImageUpload } from "~/components/ImageUpload";
import { Button } from "~/components/ui/Button";
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
import {
  ApplicationSchema,
  ProfileSchema,
  contributionTypes,
  fundingSourceTypes,
} from "../types";
import { useCreateApplication } from "../hooks/useCreateApplication";
import { Tag } from "~/components/ui/Tag";
import { useIsCorrectNetwork } from "~/hooks/useIsCorrectNetwork";
import { Alert } from "~/components/ui/Alert";
import { useCurrentRound } from "~/features/rounds/hooks/useRound";
import { useRoundState } from "~/features/rounds/hooks/useRoundState";
import { EnsureCorrectNetwork } from "~/components/EnsureCorrectNetwork";

const ApplicationCreateSchema = z.object({
  profile: ProfileSchema,
  application: ApplicationSchema,
});

export function ApplicationForm({ address }: { address: Address }) {
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
        It will now be reviewed by round admins.
      </Alert>
    );
  }
  const error = create.error;
  return (
    <FormSection
      title="New application"
      description={
        <>
          <p>
            Fill out this form to create an application for your project. It
            will then be reviewed by our admins.
          </p>
          <p>
            Your progress is saved locally so you can return to this page to
            resume your application.
          </p>
        </>
      }
    >
      <div>
        <Form
          defaultValues={{
            application: {
              payoutAddress: address,
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
            title={"Impact"}
            description="Describe the impact of your project."
          >

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
            title={
              <>
                Impact metrics <span className="text-primary-600">*</span>
              </>
            }
            description="What kind of impact has your project made?"
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
                    <Input
                      type="number"
                      placeholder="Number"
                      min={0}
                      step={0.01}
                    />
                  </FormControl>
                </>
              )}
            />
          </FormSection>

          <FormSection
            title={
              <>
                Funding sources <span className="text-primary-600">*</span>
              </>
            }
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
                    <Input
                      type="number"
                      placeholder="Amount"
                      min={0}
                      step={0.01}
                    />
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
            <div className="mb-4 text-center text-gray-600">
              Make sure you have funds in your wallet and that you&apos;re not
              connected to a VPN since this can cause problems with the RPC and
              your wallet.
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
    </FormSection>
  );
}

function CreateApplicationButton({
  isLoading,
  buttonText,
}: {
  isLoading: boolean;
  buttonText: string;
}) {
  const roundState = useRoundState();
  const { address } = useAccount();
  const balance = useBalance({ address });

  const { data: session } = useSession();
  const { isCorrectNetwork, correctNetwork } = useIsCorrectNetwork();

  const hasBalance = (balance.data?.value ?? 0n) > 0;

  return (
    <div className="flex items-center justify-between">
      <EnsureCorrectNetwork>
        {hasBalance ? (
          <Button
            disabled={roundState !== "APPLICATION" || isLoading || !session}
            variant="primary"
            type="submit"
            isLoading={isLoading}
          >
            {buttonText}
          </Button>
        ) : (
          <Button disabled isLoading={balance.isPending}>
            Not enough funds
          </Button>
        )}
      </EnsureCorrectNetwork>
      <div>
        {!session && (
          <div>You must connect wallet to create an application</div>
        )}
        {!isCorrectNetwork && (
          <div className="flex items-center gap-2">
            You must be connected to {correctNetwork?.name}
          </div>
        )}
      </div>
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

  const { data: round } = useCurrentRound();

  const selected = watch("application.impactCategory") ?? [];

  const error = formState.errors.application?.impactCategory;
  if (!round?.categories?.length) return null;
  return (
    <div className="mb-4">
      <Label>
        Impact categories<span className="text-primary-600">*</span>
      </Label>
      <div className="flex flex-wrap gap-2">
        {round?.categories?.map(({ id, label }) => {
          const isSelected = selected.includes(id);
          return (
            <Tag
              size="lg"
              selected={isSelected}
              key={id}
              onClick={() => {
                const currentlySelected = isSelected
                  ? selected.filter((s) => s !== id)
                  : selected.concat(id);

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
