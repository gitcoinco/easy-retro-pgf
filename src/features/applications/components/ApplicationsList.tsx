import { z } from "zod";
import { useState } from "react";
import Link from "next/link";

import { Button } from "~/components/ui/Button";
import { Form, FormSection, Label, Select } from "~/components/ui/Form";
import {
  useApplications,
  useApplicationsFilter,
} from "~/features/applications/hooks/useApplications";
import { useApproveApplication } from "../hooks/useApproveApplication";
import { Spinner } from "~/components/ui/Spinner";
import { EmptyState } from "~/components/EmptyState";
import { Alert } from "~/components/ui/Alert";
import { useCurrentDomain } from "~/features/rounds/hooks/useRound";
import { ApplicationItem } from "./ApplicationItem";
import { SelectAllButton } from "./SelectAllButton";
import { ApproveButton } from "./ApproveButton";
import { api } from "~/utils/api";
import { Tab, Tabs } from "~/components/ui/Tabs";

const ApplicationsListSchema = z.object({
  selected: z.array(z.string()),
});

export type ApplicationsList = z.infer<typeof ApplicationsListSchema>;

export function ApplicationsList() {
  const domain = useCurrentDomain();

  const applications = useApplications({
    status: "pending",
    take: 10,
    skip: 0,
  });
  const approve = useApproveApplication({});

  console.log("applciations", applications.data);

  const applicationsList = applications.data?.data ?? [];

  const applicationsToApprove = applicationsList.filter((a) => !a.approvedBy);
  return (
    <div className="relative">
      <Form
        defaultValues={{ selected: [] }}
        schema={ApplicationsListSchema}
        onSubmit={(values) => approve.mutate(values.selected)}
      >
        <FormSection
          title="Review applications"
          description="Select the applications you want to approve. You must be a configured admin to approve applications."
        >
          <Alert variant="info">
            Newly submitted applications can take 10 minutes to show up.
          </Alert>
          <div className="sticky top-0 z-10 my-2 flex items-center justify-between bg-white py-2 dark:bg-gray-900">
            <div className="text-gray-300">
              {applicationsList.length
                ? `${applicationsList.length} applications found`
                : ""}
            </div>
            <div className="flex gap-2">
              <SelectAllButton applications={applicationsToApprove} />
              <ApproveButton isLoading={approve.isPending} />
            </div>
          </div>
          <ApplicationsFilter />

          {applications.isPending ? (
            <div className="flex items-center justify-center py-16">
              <Spinner />
            </div>
          ) : !applicationsList.length ? (
            <EmptyState title="No applications">
              <Button
                variant="primary"
                as={Link}
                href={`/${domain}/applications/new`}
              >
                Go to create application
              </Button>
            </EmptyState>
          ) : null}
          {applicationsList.map((item) => (
            <ApplicationItem
              key={item.id}
              {...item}
              isLoading={applications.isPending}
            />
          ))}
        </FormSection>
      </Form>
    </div>
  );
}

function ApplicationsFilter() {
  const [filter, setFilter] = useApplicationsFilter();

  return (
    <div className="flex items-center justify-end gap-2">
      <Tabs>
        <Tab>All</Tab>
        <Tab>Accepted</Tab>
        <Tab isActive>Pending</Tab>
      </Tabs>
      <div className="flex items-center gap-2">
        {/* Choosing a simple Select here rather than a Pagination component (which is a bigger lift) */}
        <Label>Page</Label>
        <Select>
          <option>1</option>
          <option>2</option>
        </Select>
      </div>
    </div>
  );
}
