import { z } from "zod";
import { toast } from "sonner";
import { useController, useFormContext } from "react-hook-form";
import { useLocalStorage } from "react-use";
import { useSession } from "next-auth/react";
import { ImageUpload } from "~/components/ImageUpload";
import { Button } from "~/components/ui/Button";
import {
  ErrorMessage,
  FieldArray,
  FieldsRow,
  Form,
  FormControl,
  FormSection,
  Input,
  Select,
  Textarea,
} from "~/components/ui/Form";
import { impactCategories } from "~/config";
import {
  ApplicationVerificationSchema,
  ApplicationSchema,
  ProfileSchema,
  contributionTypes,
  booleanOptions,
  fundingAmountTypes,
} from "../types";
import { useCreateApplication } from "../hooks/useCreateApplication";
import { Tag } from "~/components/ui/Tag";
import { useIsCorrectNetwork } from "~/hooks/useIsCorrectNetwork";
import { Alert } from "~/components/ui/Alert";
import { EnsureCorrectNetwork } from "~/components/EnsureCorrectNetwork";
import { api } from "~/utils/api";
import { ImpactQuestions } from "./ImpactQuestions";

const ApplicationCreateSchema = z.object({
  profile: ProfileSchema,
  application: ApplicationSchema,
  applicationVerification: ApplicationVerificationSchema,
});

export function ApplicationForm() {
  const clearDraft = useLocalStorage("application-draft")[2];
  const encrypt = api.encryption.encrypt.useMutation();
  const create = useCreateApplication({
    onSuccess: () => {
      toast.success("Your application has been submitted successfully!");
      clearDraft();
    },
  });

  if (create.isSuccess) {
    return (
      <Alert variant="success" title="Application Submitted!">
        Your application has been successfully submitted. It will now be
        reviewed by our admins.
      </Alert>
    );
  }

  return (
    <div>
      <Form
        defaultValues={{
          application: {
            contributionLinks: [{}],
            impactCategory: [],
            categoryQuestions: {},
          },
          applicationVerification: {
            fundingSources: [],
          },
        }}
        persist="application-draft"
        schema={ApplicationCreateSchema}
        onSubmit={async ({ profile, application, applicationVerification }) => {
          try {
            // Get selected impact categories
            const selectedCategories = application.impactCategory;

            // Filter out categoryQuestions to only include selected categories
            const filteredCategoryQuestions = Object.keys(
              application.categoryQuestions,
            )
              .filter((category) => selectedCategories.includes(category))
              .reduce<Record<string, any>>((acc, category) => {
                acc[category] = application.categoryQuestions[category];
                return acc;
              }, {});
            application = {
              ...application,
              categoryQuestions: filteredCategoryQuestions,
            };

            const encryptedData = await encrypt.mutateAsync(
              applicationVerification,
            );
            application = { ...application, encryptedData };
            create.mutate({ application, profile });
          } catch (error) {
            console.error("Submission error", error);
            throw new Error("Failed to submit application!");
          }
        }}
      >
        <FormSection
          title="Application Details"
          description="Share information on your application."
          className="rounded border border-gray-300 p-4"
        >
          <FormControl name="profile.name" label="Project name" required>
            <Input placeholder="Project name" />
          </FormControl>
          <div className="mb-4 gap-4 md:flex">
            <FormControl
              required
              label="Project avatar"
              name="profile.profileImageUrl"
              className="w-48"
              hint={
                <span className="text-xs">
                  Upload an image with<strong> 1:1 aspect ratio</strong>. Less
                  than 1MB.
                </span>
              }
            >
              <ImageUpload className="h-48 w-48 " />
            </FormControl>
            <FormControl
              required
              label="Project background image"
              name="profile.bannerImageUrl"
              className="flex-1 "
              hint={
                <span className="text-xs">
                  Upload an image with<strong> 4:1 aspect ratio</strong>. Less
                  than 1MB.
                </span>
              }
            >
              <ImageUpload className="h-48 " />
            </FormControl>
          </div>

          <FormControl
            name="application.bio"
            label="Description of your project"
            description="Brief project description up to 100 words. This will be visible on the website and will be one of the first things reviewers look at. Make it descriptive and engaging (Markdown is supported)."
            required
          >
            <Textarea rows={4} placeholder="Project description" />
          </FormControl>
          <div className="gap-4 md:flex">
            <FormControl
              className="flex-1"
              name="application.websiteUrl"
              description="Website for your project."
              label="Website"
              required
            >
              <Input placeholder="https://" />
            </FormControl>

            <FormControl
              className="hidden flex-1"
              name="application.payoutAddress"
              label="Payout address"
              required
            >
              <Input placeholder="Enter your Filecoin address..." />
            </FormControl>
          </div>

          <FormControl
            className="flex-1"
            name="application.githubProjectLink"
            label="Project GitHub repository"
            description="FIL awards will be streamed to your project's public GitHub repository using Drips. If your project doesn’t have a GitHub repository, please create one. "
            hint={
              <span>
                For guidance on how to configure your GitHub repository for
                Drips, please refer to the{" "}
                <a
                  href="https://fil-retropgf.notion.site/Round-2-Application-Guidelines-394969fa60cf4b45a8d8ef5cbbfd3d7e"
                  target="_blank"
                  className="font-bold underline"
                >
                  Application Guidelines
                </a>
                .
              </span>
            }
            required
          >
            <Input placeholder="Enter your account..." />
          </FormControl>
          <FormControl
            label="Project Showcase Link"
            name="application.twitterPost"
            description={
              <span>
                Please insert a link to a social media promotion you have done
                for your project in the last 6 months.
                <a
                  href="https://fil-retropgf.notion.site/Stage-2-Application-Intake-Guidelines-14th-October-4th-November-394969fa60cf4b45a8d8ef5cbbfd3d7e#11ed0d646da1806998cac03d305c3b69"
                  target="_blank"
                  className="font-bold underline"
                >
                  <br />
                  What if I did not take part
                </a>{" "}
                in Stage 1: The Project Showcase?
              </span>
            }
          >
            <Input placeholder="https://" />
          </FormControl>
        </FormSection>

        <FormSection
          title={"Contribution & Impact"}
          description="Describe the contribution and impact of your project. Be as succinct and clear as possible."
          className="rounded border border-gray-300 p-4"
        >
          <FormControl
            name="application.contributionDescription"
            label="Who is this project important for? What pain points does it solve? What are the tangible benefits of this contribution?"
            hint="Markdown is supported"
            required
          >
            <Textarea
              rows={4}
              placeholder="What have your project contributed to?"
            />
          </FormControl>

          <FormSection
            title={
              <>
                Contribution links <span className="text-red-300">*</span>
              </>
            }
            description="Where can we find your contributions? Provide 1-5 links that best demonstrate the impact and contribution of your project to the Filecoin ecosystem. These could include GitHub repositories, blog posts, research papers, or any other relevant contributions that showcase your project’s progress and impact. Make sure the links are accessible and relevant to your application."
            className="rounded border border-gray-300 p-4"
          >
            <FieldArray
              name="application.contributionLinks"
              requiredRows={1}
              ErrorMessage="provide at least one contribution link"
              hint="Please provide a description, URL, and type of contribution."
              renderField={(field, i) => (
                <>
                  <FormControl
                    className="min-w-96 flex-1"
                    name={`application.contributionLinks.${i}.description`}
                    hint="Markdown is supported"
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

          <FormControl
            name="application.impactDescription"
            label="If your project has received any testimonials from April - September 2024, you can share a link below. Please ensure a timestamp is visible."
            hint="Markdown is supported"
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
          title={"Project KYC Details"}
          description="To comply with regulations, KYC information must be collected. The information is being collected at this stage to streamline distribution later. The KYC information collected will be private and confidential. Supplying KYC information is a condition for submitting an application."
          className="rounded border border-gray-300 p-4"
        >
          <FormControl
            name="applicationVerification.name"
            label="Legal Company/Individual Name"
            hint="The name of the company or individual expected to receive the funds."
            required
          >
            <Input placeholder="Your name" />
          </FormControl>
          <FormControl
            name="applicationVerification.POCName"
            label="Point of Contact (POC) Name"
            hint="The individual we can contact regarding the application"
            required
          >
            <Input />
          </FormControl>
          <FormControl
            name="applicationVerification.projectPhysicalAddress"
            label="Project physical address (including city, state, country)"
            hint="The postal address of the individual or entity expected to receive funds"
            required
          >
            <Input />
          </FormControl>
          <FormControl
            name="applicationVerification.projectEmail"
            label="Project email"
            required
            hint="The address through which round operators may contact the applicant"
          >
            <Input placeholder="Your project email" />
          </FormControl>
          <FormControl
            name="applicationVerification.additionalPOC"
            label="Slack-Telegram-Discord handle (Optional)"
            hint="Optional, in case email is non-responsive and the round operators need to get in touch"
          >
            <Input placeholder="e.g. Slack/Telegram/Discord: @your_handle" />
          </FormControl>
          <FormControl
            label="Team composition (Optional)"
            name="applicationVerification.teamDescription"
            description={`Briefly describe your team size and any subgroups.`}
          >
            <Textarea rows={3} />
          </FormControl>
          <FormSection
            title={"Funding sources (Optional)"}
            description="From what sources have you received funding? This data will be used internally to analyze funding trends and analyze project and ecosystem growth. This will not be shared to badgeholders during the voting process and will have no impact on the outcomes of your application.
"
            className="rounded border border-gray-300 p-4"
          >
            <FieldArray
              name="applicationVerification.fundingSources"
              renderField={(field, i) => (
                <>
                  <FormControl
                    className="min-w-96 flex-1"
                    name={`applicationVerification.fundingSources.${i}.description`}
                  >
                    <Textarea placeholder="Description" />
                  </FormControl>
                  <FormControl
                    name={`applicationVerification.fundingSources.${i}.range`}
                  >
                    <Select>
                      {Object.entries(fundingAmountTypes).map(
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
            <div className="flex justify-start">
              <FieldsRow
                label="Have you previously applied to FIL-RetroPGF rounds?"
                hint="If yes, please provide the link to your previous application."
                name="application.previousApplication"
                renderField={(field, i) => (
                  <>
                    <FormControl
                      name={`applicationVerification.previousApplication.applied`}
                    >
                      <Select>
                        {Object.entries(booleanOptions).map(
                          ([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ),
                        )}
                      </Select>
                    </FormControl>
                    <FormControl
                      name={`applicationVerification.previousApplication.link`}
                    >
                      <Input placeholder="https://" />
                    </FormControl>
                  </>
                )}
              />
            </div>
          </FormSection>
        </FormSection>

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
  const { data: session } = useSession();
  const { isCorrectNetwork, correctNetwork } = useIsCorrectNetwork();

  return (
    <div className="flex items-center justify-between">
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
      <EnsureCorrectNetwork>
        <Button
          disabled={isLoading || !session}
          variant="primary"
          type="submit"
          isLoading={isLoading}
        >
          {buttonText}
        </Button>
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

  const selected = watch("application.impactCategory") ?? [];

  const error =
    (formState.errors.application?.impactCategory ?? selected.length > 1)
      ? { message: "Select only one impact category" }
      : selected.length === 0
        ? { message: "Select one impact category" }
        : null;
  return (
    <div className="mb-4">
      <FormSection
        title="Impact Categories"
        description="Select the impact category that best describes your project/contributions. After selecting, answer the relevant questions below to provide insights into the impact your project made during the impact window [April 2024-September 2024]. You don't have to answer all questions, the questions are intended to serve as a guide, please free to add additional information you feel is relevant. Important: be as specific and succinct as possible."
        className="rounded border border-gray-300 p-4"
      >
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(impactCategories).map(([value, { label }]) => {
            const isSelected = selected.includes(value);
            return (
              <Tag
                size="lg"
                selected={isSelected}
                className={isSelected ? "border-2" : ""}
                key={value}
                onClick={() => {
                  const select = selected[0] === value ? [] : [value];
                  field.onChange(select);
                }}
              >
                {label}
              </Tag>
            );
          })}
        </div>
        {error && <ErrorMessage>{error.message}</ErrorMessage>}
      </FormSection>
      <ImpactQuestions selectedCategories={selected} />
    </div>
  );
}
