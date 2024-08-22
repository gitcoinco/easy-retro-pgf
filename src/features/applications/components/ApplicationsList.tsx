import { z } from "zod";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { type Address } from "viem";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "~/components/ui/Button";
import { Form, FormSection } from "~/components/ui/Form";
import { useApplications } from "~/features/applications/hooks/useApplications";
import { useApproveApplication } from "../hooks/useApproveApplication";
import { Spinner } from "~/components/ui/Spinner";
import { EmptyState } from "~/components/EmptyState";
import { useApprovedApplications } from "../hooks/useApprovedApplications";
import { Alert } from "~/components/ui/Alert";
import { useCurrentDomain } from "~/features/rounds/hooks/useRound";
import { ApplicationItem } from "./ApplicationItem";
import { SelectAllButton } from "./SelectAllButton";
import { ApproveButton } from "./ApproveButton";

const ApplicationsListSchema = z.object({
  selected: z.array(z.string()),
});

export type ApplicationsList = z.infer<typeof ApplicationsListSchema>;

export function ApplicationsList() {
  const queryClient = useQueryClient();
  const [fetched, setFetched] = useState(false);
  const applications = useApplications();
  const domain = useCurrentDomain();
  const approved = useApprovedApplications();
  const approve = useApproveApplication({});

  const handleRefetch = (timeout: number) => {
    // @ts-ignore
    queryClient.removeQueries(["approvedApplications", {}]);
    setTimeout(() => {
      approved.refetch().then(() => {
        setFetched(!fetched);
      });
    }, timeout);
  };

  useEffect(() => {
    if (!fetched) {
      handleRefetch(0);
      setFetched(true);
    }
  }, [fetched]);

  const approvedById = useMemo(() => {
    return approved.data?.reduce((acc, x) => {
      // Check if the key (refUID) already exists in the Map
      const existingArray = acc.get(x.refUID) || [];
      // Append the new object to the array
      const newArray = [...existingArray, { attester: x.attester, uid: x.id }];
      // Set the updated array back into the Map
      acc.set(x.refUID, newArray);
      return acc;
    }, new Map<string, { attester: Address; uid: string }[]>());
  }, [approved.data]);

  const applicationsToApprove = applications.data?.filter(
    (application) => !approvedById?.get(application.id),
  );

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
              {applications.data?.length
                ? `${applications.data?.length} applications found`
                : ""}
            </div>
            <div className="flex gap-2">
              <SelectAllButton applications={applicationsToApprove} />
              <ApproveButton isLoading={approve.isPending} />
            </div>
          </div>

          {applications.isPending ? (
            <div className="flex items-center justify-center py-16">
              <Spinner />
            </div>
          ) : !applications.data?.length ? (
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
          {applications.data?.map((item) => (
            <ApplicationItem
              key={item.id}
              {...item}
              isLoading={applications.isPending}
              approvedBy={approvedById?.get(item.id)}
            />
          ))}
        </FormSection>
      </Form>
    </div>
  );
}
