import { z } from "zod";
import { useEffect, useState } from "react";
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
import { impactCategories } from "~/config";
import {
  ApplicationSchema,
  ProfileSchema,
  contributionTypes,
  fundingSourceTypes,
  socialMediaTypes,
} from "../types";
import { useCreateApplication } from "../hooks/useCreateApplication";
import { toast } from "sonner";
import { useController, useFormContext } from "react-hook-form";
import { Tag } from "~/components/ui/Tag";
import { useIsCorrectNetwork } from "~/hooks/useIsCorrectNetwork";
import { useProjectMetadata } from "../../projects/hooks/useProjects";
import { useProfileWithMetadata } from "~/hooks/useProfile";
import { useLocalStorage } from "react-use";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { Alert } from "~/components/ui/Alert";
import { useSession } from "next-auth/react";
import { type Attestation } from "~/utils/fetchAttestations";
import { isBefore } from "date-fns";
import { config } from "~/config";
import Link from "next/link";

const ApplicationCreateSchema = z.object({
  profile: ProfileSchema,
  application: ApplicationSchema,
});

export function ApplicationForm({
  address = "",
  projectInfo,
  isEditMode = false,
}: {
  address: string;
  projectInfo?: Attestation;
  isEditMode?: boolean;
}) {
  const metadata = useProjectMetadata(projectInfo?.metadataPtr);
  const profile = useProfileWithMetadata(projectInfo?.recipient);

  const clearDraft = useLocalStorage("application-draft")[2];

  const [defaultValues, setDefaultValues] = useState();
  const { isCorrectNetwork, correctNetwork } = useIsCorrectNetwork();
  const { data: session } = useSession();

  useEffect(() => {
    if (isEditMode && projectInfo && metadata?.data && profile?.data)
      setDefaultValues({
        profile: {
          name: projectInfo?.name,
          profileImageUrl: profile?.data?.profileImageUrl,
          bannerImageUrl: profile?.data?.bannerImageUrl,
        },
        application: {
          name: metadata?.data?.name,
          bio: metadata?.data?.bio,
          websiteUrl: metadata?.data?.websiteUrl,
          wPOKTReceivingAddress: metadata?.data?.wPOKTReceivingAddress,
          arbReceivingAddress: metadata?.data?.arbReceivingAddress,
          opReceivingAddress: metadata?.data?.opReceivingAddress,
          contributionDescription: metadata?.data?.contributionDescription,
          impactDescription: metadata?.data?.impactDescription,
          impactCategory: metadata?.data?.impactCategory,
          contributionLinks: metadata?.data?.contributionLinks,
          impactMetrics: metadata?.data?.impactMetrics,
          fundingSources: metadata?.data?.fundingSources,
          socialMedias: metadata?.data?.socialMedias,
          isDAOVoters: metadata?.data?.isDAOVoters,
        },
      });
  }, [isEditMode, projectInfo, metadata?.data, profile?.data]);

  const create = useCreateApplication({
    onSuccess: () => {
      toast.success("Application created successfully!");
      if (!isEditMode) clearDraft();
    },
    onError: (err: { reason?: string; data?: { message: string } }) => {
      console.log("err", err);
      toast.error("Application create error", {
        description:
          err.reason ??
          err.data?.message ??
          (!isCorrectNetwork &&
            `You must be connected to ${correctNetwork.name}`) ??
          (!session && (
            <div>You must connect wallet to create an application</div>
          )),
      });
    },
  });
  if (create.isSuccess) {
    return (
      <Alert variant="success" title="Application created!">
        Your submission will now be reviewed by our administrators and
        subsequently added to the projects.
        <p>
          Please contact the&nbsp;
          <Link
            className="underline hover:text-primary-dark"
            href="https://discord.com/channels/553741558869131266/1168923397842022571"
            target="_blank"
          >
            help-desk channel
          </Link>
          &nbsp;if your application has not been added after 48 hours. Do not
          resubmit your application.
        </p>
      </Alert>
    );
  }
  const error = create.error;
  const now = new Date();
  return (
    <div>
      {isBefore(now, config.startsAt) ? (
        <Alert
          variant="info"
          title="Submission period hasn't start yet."
        ></Alert>
      ) : (
        <Form
          isEditMode={isEditMode}
          defaultValues={
            isEditMode
              ? defaultValues
              : {
                  application: {
                    contributionLinks: [{}],
                    impactMetrics: [{}],
                  },
                }
          }
          persist={!isEditMode ? "application-draft" : undefined}
          schema={ApplicationCreateSchema}
          onSubmit={async ({ profile, application }) => {
            create.mutate({
              application,
              profile,
              refUID: projectInfo?.id ?? undefined,
            });
          }}
        >
          <FormSection
            title="Profile"
            description="Configure your profile name and choose your avatar and background for your project."
          >
            <FormControl name="profile.name" label="Profile name" required>
              <Input placeholder="Your name" />
            </FormControl>
            <div className="mb-1 gap-4 md:flex">
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
            <FormControl
              className="flex-1"
              name="application.websiteUrl"
              label="Website"
              required
            >
              <Input placeholder="https://" />
            </FormControl>

            <div className="gap-4 lg:flex">
              <FormControl
                className="flex-1"
                name="application.wPOKTReceivingAddress"
                label={
                  <p className="flex items-center gap-1">
                    <span
                      className=" mr-1 flex items-center rounded-full border-[1.5px] border-outline-dark px-[0.375rem] text-xs font-bold text-outline-dark"
                      data-tooltip-id="application.wPOKTReceivingAddress"
                    >
                      i
                    </span>
                    wPOKT receiving address
                    <ReactTooltip
                      id="application.wPOKTReceivingAddress"
                      place="bottom"
                      className="max-h-full max-w-[20rem] bg-outline-dark md:max-w-max"
                      multiline={true}
                      style={{ backgroundColor: "#6c7283" }}
                      content={
                        <p className="flex flex-col text-wrap font-normal">
                          wPOKT will be sent to your wallet on Ethereum mainnet.
                        </p>
                      }
                    />
                    <span className="text-onSurface-dark"> *</span>
                  </p>
                }
              >
                <Input placeholder="0XfAd....aseqw3wcf97" />
              </FormControl>
              <FormControl
                className="flex-1"
                name="application.arbReceivingAddress"
                label={
                  <p className="flex items-center gap-1">
                    <span
                      className=" mr-1 flex items-center rounded-full border-[1.5px] border-outline-dark px-[0.375rem] text-xs font-bold text-outline-dark"
                      data-tooltip-id="application.arbReceivingAddress"
                    >
                      i
                    </span>
                    ARB receiving address
                    <ReactTooltip
                      id="application.arbReceivingAddress"
                      place="bottom"
                      className="max-h-full max-w-[20rem] bg-outline-dark md:max-w-max"
                      multiline={true}
                      style={{ backgroundColor: "#6c7283" }}
                      content={
                        <p className="flex flex-col text-wrap font-normal">
                          ARB will be sent to your wallet on Arbitrum mainnet.
                        </p>
                      }
                    />
                    <span className="text-onSurface-dark"> *</span>
                  </p>
                }
              >
                <Input placeholder="0XfAd....aseqw3wcf97" />
              </FormControl>
              <FormControl
                className="flex-1"
                name="application.opReceivingAddress"
                label={
                  <p className="flex items-center gap-1">
                    <span
                      className=" mr-1 flex items-center rounded-full border-[1.5px] border-outline-dark px-[0.375rem] text-xs font-bold text-outline-dark"
                      data-tooltip-id="application.opReceivingAddress"
                    >
                      i
                    </span>
                    OP receiving address
                    <ReactTooltip
                      id="application.opReceivingAddress"
                      place="bottom"
                      className="max-h-full max-w-[20rem] bg-outline-dark md:max-w-max"
                      multiline={true}
                      style={{ backgroundColor: "#6c7283" }}
                      content={
                        <p className="flex flex-col text-wrap font-normal">
                          OP will be sent to your wallet on Optimism mainnet.
                        </p>
                      }
                    />
                    <span className="text-onSurface-dark"> *</span>
                  </p>
                }
              >
                <Input placeholder="0XfAd....aseqw3wcf97" />
              </FormControl>
            </div>
            <FormControl
              className="flex flex-row-reverse items-baseline justify-end gap-2"
              name="application.isDAOVoters"
              label="Are you or any employees, contractors, or equity holders of the applying organization or team DAO voters?"
            >
              <Input
                className="h-4 w-4 dark:hover:bg-transparent dark:focus:bg-transparent"
                type="checkbox"
              />
            </FormControl>
          </FormSection>

          <FormSection
            title={"Contribution & Impact"}
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
            title={
              <>
                Contribution links{" "}
                <span className="text-onSurface-dark"> *</span>
              </>
            }
            description="Where can we find your contributions?"
          >
            <FieldArray
              name="application.contributionLinks"
              isRequired
              renderField={(field, i) => (
                <>
                  <FormControl
                    className="flex-1 md:min-w-96 w-full"
                    name={`application.contributionLinks.${i}.description`}
                    required
                  >
                    <Input placeholder="Description" />
                  </FormControl>
                  <FormControl
                    className="w-full"
                    name={`application.contributionLinks.${i}.url`}
                    required
                  >
                    <Input placeholder="https://" />
                  </FormControl>
                  <FormControl
                  className="w-full"
                    name={`application.contributionLinks.${i}.type`}
                    required
                  >
                    <Select>
                      {Object?.entries(contributionTypes).map(
                        ([value, label]) => (
                          <option
                            className=" bg-background-dark text-onPrimary-light hover:bg-primary-dark"
                            key={value}
                            value={value}
                          >
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
            title={
              <>
                Impact metrics <span className="text-onSurface-dark"> *</span>
              </>
            }
            description="What kind of impact have your project made?"
          >
            <FieldArray
              name="application.impactMetrics"
              isRequired
              renderField={(field, i) => (
                <>
                  <FormControl
                    className="flex-1 md:min-w-96 w-full"
                    name={`application.impactMetrics.${i}.description`}
                    required
                  >
                    <Input placeholder="Description" />
                  </FormControl>
                  <FormControl
                    className="w-full"
                    name={`application.impactMetrics.${i}.url`}
                    required
                  >
                    <Input placeholder="https://" />
                  </FormControl>
                  <FormControl
                    className="w-full"
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
                    className="flex-1 md:min-w-96"
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
                      {Object?.entries(fundingSourceTypes).map(
                        ([value, label]) => (
                          <option
                            className="bg-background-dark text-onPrimary-light hover:bg-primary-dark"
                            key={value}
                            value={value}
                          >
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
            title="Social media"
            description="Please add any related social media link"
          >
            <FieldArray
              name="application.socialMedias"
              renderField={(field, i) => (
                <>
                  <FormControl
                    className=" md:w-2/4"
                    name={`application.socialMedias.${i}.type`}
                    required
                  >
                    <Select className="w-full">
                      {Object?.entries(socialMediaTypes).map(
                        ([value, label]) => (
                          <option
                            className="bg-background-dark text-onPrimary-light hover:bg-primary-dark"
                            key={value}
                            value={value}
                          >
                            {label}
                          </option>
                        ),
                      )}
                    </Select>
                  </FormControl>
                  <FormControl
                    className="md:w-2/4	"
                    name={`application.socialMedias.${i}.url`}
                    required
                  >
                    <Input />
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
            session={session}
            buttonText={
              create.isUploading
                ? "Uploading metadata"
                : create.isAttesting
                  ? "Creating attestation"
                  : `${!projectInfo ? "Create" : "Edit"} application`
            }
          />
        </Form>
      )}
    </div>
  );
}

function CreateApplicationButton({
  isLoading,
  buttonText,
  session,
}: {
  isLoading: boolean;
  buttonText: string;
  session: Session | null;
}) {
  return (
    <div className="mt-8 flex items-center justify-end">
      <Button
        disabled={isLoading || !session}
        variant="primary"
        type="submit"
        isLoading={isLoading}
      >
        {buttonText}
      </Button>
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
        Impact categories<span className="text-onSurface-dark"> *</span>
      </Label>
      <div className="flex flex-wrap gap-2">
        {Object?.entries(impactCategories).map(
          ([value, { label, description }]) => {
            const isSelected = selected.includes(value);
            return (
              <Tag
                size="lg"
                selected={isSelected}
                key={value}
                onClick={() => {
                  const currentlySelected = isSelected
                    ? selected?.filter((s) => s !== value)
                    : [value];

                  field.onChange(currentlySelected);
                }}
              >
                {label}
                <span
                  className=" flex items-center rounded-full border-[1.5px] border-outline-dark px-[0.375rem] text-xs font-bold text-outline-dark"
                  data-tooltip-id={label}
                >
                  i
                </span>
                <ReactTooltip
                  id={label}
                  place="bottom"
                  className="max-h-full max-w-[20rem] bg-outline-dark"
                  multiline={true}
                  style={{ backgroundColor: "#6c7283" }}
                  content={
                    <div className="flex flex-col text-wrap">
                      <span>What is a {label} impact?</span>
                      <div className=" flex h-full  w-full break-words ">
                        {description}
                      </div>
                    </div>
                  }
                />
              </Tag>
            );
          },
        )}
      </div>
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
    </div>
  );
}
