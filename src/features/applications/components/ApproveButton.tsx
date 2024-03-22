import { Button } from "~/components/ui/Button";
import { useApproveApplication } from "~/features/applications/hooks/useApproveApplication";
import { useIsAdmin } from "~/hooks/useIsAdmin";
import dynamic from "next/dynamic";
import { type PropsWithChildren } from "react";
import { useApprovedApplications } from "../hooks/useApprovedApplications";
import { Badge } from "~/components/ui/Badge";

function ApproveButton({
  children = "Approve project",
  projectIds = [],
}: PropsWithChildren<{ projectIds: string[] }>) {
  const isAdmin = useIsAdmin();
  const approvals = useApprovedApplications(projectIds);

  const approve = useApproveApplication();
  if (approvals.data?.length)
    return (
      <Badge variant="success" size="lg">
        Approved
      </Badge>
    );
  return (
    isAdmin && (
      <Button
        variant="primary"
        disabled={approve.isLoading}
        onClick={() => approve.mutate(projectIds)}
      >
        {children}
      </Button>
    )
  );
}

export default dynamic(() => Promise.resolve(ApproveButton));
