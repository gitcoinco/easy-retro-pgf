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
  CeloApplicationSchema,
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
import { useEffect } from "react";

const ApplicationCreateSchema = z.object({
  profile: ProfileSchema,
  application: CeloApplicationSchema,
});

export function CeloApplicationForm({ address }: { address: Address }) {
  const clearDraft = useLocalStorage("application-draft-celo")[2];

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
    <div>
      <Form
        defaultValues={{
          application: {
            payoutAddress: address,
            contributionLinks: [{}],
            impactMetrics: [{}],
            fundingSources: [],
            websiteUrl: "https://undefined.com", // Add default value for hidden field
          },
          profile: {
            name: "undefined", // Add default value for hidden field
            bannerImageUrl: "https://undefined.com", // Add default value for hidden field
          },
        }}
        persist="application-draft-celo"
        schema={ApplicationCreateSchema}
        onSubmit={async ({ profile, application }) => {
          console.log(application, profile);
          create.mutate({
            application,
            profile: {
              ...profile,
              name: application.name,
              bannerImageUrl: profile.profileImageUrl,
            },
          });
        }}
      >
        <HiddenFields />
        <FormSection
          title="Application"
          description="Key details for your application and the payout address to where tokens will be transferred."
        >
          <FormControl name="application.name" label="Name" required>
            <Input placeholder="Your name" />
          </FormControl>
          <div className="flex flex-wrap justify-start  gap-8">
            <FormControl
              required
              label="Personal avatar"
              name="profile.profileImageUrl"
              hint={
                <div className="max-w-48">
                  Upload an image with a 1:1 aspect ratio. Less than 1MB.
                </div>
              }
            >
              <ImageUpload className="h-48 w-48 " />
            </FormControl>
            <div className="flex w-2/3 gap-8">
              <div className="w-1/2">
                <FormControl
                  className="flex-1"
                  name="application.twitterHandle"
                  label="X handle"
                >
                  <Input placeholder={"Your x handle"} />
                </FormControl>
                <FormControl
                  className="flex-1"
                  name="application.farcasterHandle"
                  label="Farcaster"
                >
                  <Input placeholder={"Your Farcaster handle"} />
                </FormControl>
                <FormControl
                  className="flex-1"
                  name="application.telegramHandle"
                  label="Telegram Handle"
                >
                  <Input placeholder={"Your Telegram handle"} />
                </FormControl>
              </div>
              <div className="w-1/2">
                <FormControl
                  className="flex-1"
                  name="application.githubHandle"
                  label="Github"
                >
                  <Input placeholder={"Your GitHub handle"} />
                </FormControl>
                <FormControl
                  className="flex-1"
                  name="application.emailHandle"
                  label="Email"
                >
                  <Input placeholder={"Your email address"} />
                </FormControl>
                <FormControl
                  className="flex-1"
                  name="application.country"
                  label="Country"
                >
                  <Input placeholder="The country you’re based in" />
                </FormControl>
              </div>
            </div>
          </div>
          <FormControl
            className="flex-1"
            name="application.payoutAddress"
            label="Payout address"
            required
          >
            <Input placeholder="0x..." />
          </FormControl>

          <FormControl
            name="application.bio"
            label="Description"
            required
            description={
              "Brief description of who you are and where you fit in the Celo ecosystem."
            }
          >
            <Textarea rows={4} placeholder="Project description" />
          </FormControl>

          <ImpactTags />

          <FormSection
            title="Contribution"
            description={
              <span>
                Highlight the overall contributions and specific actions you
                have taken to advance the Celo ecosystem. Share any links that
                showcase your contributions; these could be GitHub repositories,
                forum discussions, articles, event recordings, or other
                verifiable public records. Examples of relevant points can be
                found in the{" "}
                <a
                  href="https://forum.celo.org/t/celo-citizen-retro-round-details/9637"
                  target="_blank"
                  className="font-bold underline"
                >
                  Celo Citizen Retro: Round Details thread.
                </a>{" "}
              </span>
            }
          >
            <FormControl
              name="application.contributionDescription"
              label="Contribution description"
              description={
                <span>
                  What have you contributed to? Reference as many points
                  mentioned in the{" "}
                  <a
                    href="https://forum.celo.org/t/celo-citizen-retro-round-details/9637"
                    target="_blank"
                    className="font-bold underline"
                  >
                    Celo Citizen Retro: Round Details as possible.
                  </a>{" "}
                </span>
              }
              required
            >
              <Textarea rows={4} placeholder="What have you contributed to?" />
            </FormControl>
          </FormSection>
          <FormSection
            required
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
                      {Object.entries(contributionTypes).map(
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

          <FormSection
            title="Impact"
            description={
              <span>
                Highlight how your contributions have positively impacted the
                Celo ecosystem. Provide measurable data to back up your impact
                claims. Metrics could include the number of users onboarded,
                event attendees, community members, forum engagement, or
                governance votes influenced. Examples of relevant points can be
                found in the{" "}
                <a
                  href="https://forum.celo.org/t/celo-citizen-retro-round-details/9637"
                  target="_blank"
                  className="font-bold underline"
                >
                  Celo Citizen Retro: Round Details thread.
                </a>{" "}
              </span>
            }
          >
            <FormControl
              name="application.impactDescription"
              label="Impact description"
              description={
                <span>
                  What impact have your contributions had? Reference as many
                  points mentioned in the{" "}
                  <a
                    href="https://forum.celo.org/t/celo-citizen-retro-round-details/9637"
                    target="_blank"
                    className="font-bold underline"
                  >
                    Celo Citizen Retro: Round Details as possible.
                  </a>{" "}
                </span>
              }
              required
            >
              <Textarea
                rows={4}
                placeholder="What impact have your contributions had?"
              />
            </FormControl>
          </FormSection>

          <FormSection
            required
            title="Impact metrics"
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
        </FormSection>

        {error ? (
          <div className="mb-4 text-center text-gray-600 dark:text-gray-400">
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

      {roundState !== "APPLICATION" && (
        <Alert variant="info" title="Application period has ended" />
      )}

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
        Impact categories (multi-select)<span className="text-red-300">*</span>
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

function HiddenFields() {
  const { register, setValue } = useFormContext();

  useEffect(() => {
    // Register the hidden fields and set their default values
    register("profile.name", { required: true });
    setValue("profile.name", "undefined");

    register("profile.bannerImageUrl", { required: true });
    setValue("profile.bannerImageUrl", "https://undefined.com");

    register("application.websiteUrl", { required: true });
    setValue("application.websiteUrl", "https://undefined.com");
  }, [register, setValue]);

  return null;
}
