"use client";

import { z } from "zod";
import Link from "next/link";

import { Button } from "~/components/ui/Button";
import { Form, FormSection, Label, Select } from "~/components/ui/Form";
import {
  PAGE_SIZE,
  useApplications,
  useApplicationsFilter,
} from "~/features/applications/hooks/useApplications";
import { useApproveApplication } from "../hooks/useApproveApplication";
import { EmptyState } from "~/components/EmptyState";
import { Alert } from "~/components/ui/Alert";
import { useCurrentDomain } from "~/features/rounds/hooks/useRound";
import { ApplicationItem } from "./ApplicationItem";
import { SelectAllButton } from "./SelectAllButton";
import { ApproveButton } from "./ApproveButton";
import { Tab, Tabs } from "~/components/ui/Tabs";

const ApplicationsListSchema = z.object({
  selected: z.array(z.string()),
});

export type ApplicationsList = z.infer<typeof ApplicationsListSchema>;

export function ApplicationsList() {
  const domain = useCurrentDomain();
  const [filter] = useApplicationsFilter();

  const applications = useApplications(filter);
  const approve = useApproveApplication({});

  const applicationsList = applications.data?.data ?? [];

  const applicationCounts = {
    all: applications.data?.count ?? 0,
    pending: applications.data?.countApproved ?? 0,
    approved: applications.data?.countApproved ?? 0,
    rejected: applications.data?.countRejected ?? 0,
  };

  const applicationsCountMessage = {
    all: `${applications.data?.count ?? 0} applications found`,
    pending: `${applications.data?.countApproved ?? 0} pending of ${applications.data?.count ?? 0} applications`,
    approved: `${applications.data?.countApproved ?? 0} approved of ${applications.data?.count ?? 0} applications`,
    rejected: `${applications.data?.countRejected ?? 0} rejected of ${applications.data?.count ?? 0} applications`,
  }[filter.status];

  const applicationCount = applicationCounts[filter.status];

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
              {applicationsList.length ? applicationsCountMessage : ""}
            </div>
            <div className="flex gap-2">
              <SelectAllButton applications={applicationsToApprove} />
              <ApproveButton isLoading={approve.isPending} />
            </div>
          </div>
          <ApplicationsFilter applicationCount={applicationCount} />

          {applications.isPending ? (
            Array.from({ length: 10 }).map((_, i) => (
              <ApplicationItem
                key={i}
                {...{ time: Date.now() }}
                isLoading={applications.isPending}
              />
            ))
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

function ApplicationsFilter({ applicationCount = 0 }) {
  const [filter, setFilter] = useApplicationsFilter();

  const tabs = [
    {
      label: "All",
      status: "all",
    },
    {
      label: "Pending",
      status: "pending",
    },
    {
      label: "Approved",
      status: "approved",
    },
    {
      label: "Rejected",
      status: "rejected",
    },
  ] as const;

  const currentPage = filter.skip / filter.take + 1;
  const pageCount = Math.ceil(applicationCount / PAGE_SIZE) || currentPage;

  return (
    <div className="mb-1 flex items-center justify-end gap-2">
      <Tabs>
        {tabs.map((tab) => (
          <Tab
            key={tab.status}
            onClick={() => {
              if (filter.status !== tab.status) {
                void setFilter({ status: tab.status, skip: 0 });
              }
            }}
            isActive={filter.status === tab.status}
          >
            {tab.label}
          </Tab>
        ))}
      </Tabs>
      <div className="flex items-center gap-2">
        {/* Choosing a simple Select here rather than a Pagination component (which is a bigger lift) */}
        <Label>Page</Label>
        <Select
          value={currentPage}
          onChange={(e) => {
            const skip = (Number(e.target.value) - 1) * PAGE_SIZE;
            return setFilter({ skip });
          }}
        >
          {Array.from({ length: pageCount }).map((_, page) => (
            <option key={page} value={page + 1}>
              {page + 1}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
