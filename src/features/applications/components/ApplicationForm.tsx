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
          description="Provide the necessary information for your application."
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

          <FormControl
            name="application.bio"
            label="Description of your project"
            hint="Brief project description up to 100 words. This will be visible on the website and will be one of the first things reviewers look at. Make it descriptive and engaging (Markdown is supported)."
            required
          >
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
            label="Project GitHub Repository"
            description="FIL awards will be streamed to your project's public GitHub repository. Ensure your GitHub link is correct, as it will determine the payout address for funds. Adding a repository you don't own may result in loss of funds."
            hint={
              <span>
                For guidance on how to configure your GitHub repository, please
                refer to the{" "}
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
            label="Team Composition"
            name="application.teamDescription"
            hint={`Briefly describe your team size and subgroups.`}
            required
          >
            <Textarea rows={3} />
          </FormControl>
          <FormControl
            label="Social Media"
            name="application.twitterPost"
            hint={`Please share a link to the Twitter/X post you created as part of the showcase phase. (If you have not created one, please feel free to make one at the earliest tagging the FIL-RetroPGF team).`}
            required
          >
            <Input placeholder="https://" />
          </FormControl>
        </FormSection>

        <FormSection
          title={"Contribution & Impact"}
          description="Describe the contribution and impact of your project. Use the following questions as inspiration to help you describe your project's impact. You don't have to answer all questions, and you can illustrate impact as you best feel fits. Be as succinct and clear as possible."
          className="rounded border border-gray-300 p-4"
        >
          <FormControl
            name="application.contributionDescription"
            label="Who is the end user that benefits from the project?"
            hint="Markdown is supported"
            required
          >
            <Textarea
              rows={4}
              placeholder="What have your project contributed to?"
            />
          </FormControl>

          <FormControl
            name="application.impactDescription"
            label="What are the number of positive reviews/testimonials that your project has received from developers in the Filecoin Ecosystem? Please share a link to these testimonials, if applicable "
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
          title={
            <>
              Contribution links <span className="text-red-300">*</span>
            </>
          }
          description="Where can we find your contributions? Provide 1-5 that best demonstrate the impact of your contributions to the Filecoin Ecosystem."
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
          title={"Project KYC Details"}
          description="To comply with regulations, we need the following details. Note that legal name should match with profile or application name."
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
          <FormSection
            title={"Funding sources (Optional)"}
            description="From what sources have you received funding?"
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

  const error = formState.errors.application?.impactCategory;

  return (
    <div className="mb-4">
      <FormSection
        title="Impact Categories"
        description="Select the impact category that best describes your project/contributions. After selecting, answer the relevant questions below to provide insights into the impact your project made during the impact window [April 2024-September 2024]. Be as specific and succinct as possible."
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
      </FormSection>
      <ImpactQuestions selectedCategories={selected} />

      {error && <ErrorMessage>{error.message}</ErrorMessage>}
    </div>
  );
}
