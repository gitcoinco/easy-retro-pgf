import { z } from "zod";
import { type Address } from "viem";
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
import { useController, useFormContext, useForm } from "react-hook-form";
import { Tag } from "~/components/ui/Tag";
import { useIsCorrectNetwork } from "~/hooks/useIsCorrectNetwork";
import { useProjectMetadata } from "../../projects/hooks/useProjects";
import { useProfileWithMetadata } from "~/hooks/useProfile";
import { useLocalStorage } from "react-use";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { Alert } from "~/components/ui/Alert";
import { useSession } from "next-auth/react";
import { type Attestation } from "~/utils/fetchAttestations";

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
        },
      });
  }, [isEditMode, projectInfo, metadata?.data, profile?.data]);

  const create = useCreateApplication({
    onSuccess: () => {
      toast.success("Application created successfully!");
      if (!isEditMode) clearDraft();
    },
    onError: (err: { reason?: string; data?: { message: string } }) => {
      toast.error("Application create error", {
        description: err.reason ?? err.data?.message,
      });
    },
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

          <div className="gap-4 md:flex">
            <FormControl
              className="flex-1"
              name="application.wPOKTReceivingAddress"
              label="wPOKT receiving address"
              required
            >
              <Input placeholder="0XfAd....aseqw3wcf97" />
            </FormControl>
            <FormControl
              className="flex-1"
              name="application.arbReceivingAddress"
              label="ARB receiving address"
              required
            >
              <Input placeholder="0XfAd....aseqw3wcf97" />
            </FormControl>
            <FormControl
              className="flex-1"
              name="application.opReceivingAddress"
              label="OP receiving address"
              required
            >
              <Input placeholder="0XfAd....aseqw3wcf97" />
            </FormControl>
          </div>
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
              Contribution links <span className="text-onSurface-dark"> *</span>
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
                  className="flex-1 md:min-w-96"
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
                      <option
                        className=" bg-surfaceContainerLow-dark text-onPrimary-light hover:bg-primary-dark"
                        key={value}
                        value={value}
                      >
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
                  className="flex-1 md:min-w-96"
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
                    {Object.entries(fundingSourceTypes).map(
                      ([value, label]) => (
                        <option className="bg-surfaceContainerLow-dark text-onPrimary-light hover:bg-primary-dark" key={value} value={value}>
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
                    {Object.entries(socialMediaTypes).map(([value, label]) => (
                      <option className="bg-surfaceContainerLow-dark text-onPrimary-light hover:bg-primary-dark" key={value} value={value}>
                        {label}
                      </option>
                    ))}
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
          buttonText={
            create.isUploading
              ? "Uploading metadata"
              : create.isAttesting
                ? "Creating attestation"
                : `${!projectInfo ? "Create" : "Edit"} application`
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
  const { data: session } = useSession();
  const { isCorrectNetwork, correctNetwork } = useIsCorrectNetwork();

  return (
    <div className="mt-8 flex items-center justify-between">
      <div>
        {!session && (
          <div>You must connect wallet to create an application</div>
        )}
        {!isCorrectNetwork && (
          <div className="flex items-center gap-2">
            You must be connected to {correctNetwork.name}
          </div>
        )}
      </div>

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
        {Object.entries(impactCategories).map(
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
                  content={
                    <div className="flex flex-col text-wrap">
                      <span>What is a {label} impact?</span>
                      <div className=" flex h-full  w-full break-all ">
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
