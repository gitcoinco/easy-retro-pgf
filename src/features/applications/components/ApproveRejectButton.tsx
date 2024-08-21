import { Button } from "~/components/ui/Button";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { useApprovedApplications } from "../hooks/useApprovedApplications";
import { useRevokeAttestations } from "~/hooks/useRevokeAttestations";
import { useAccount } from "wagmi";
import { useApproveApplication } from "../hooks/useApproveApplication";
import { useQueryClient } from "@tanstack/react-query";

function ApproveRejectButton({
  children = "Approve project",
  projectIds = [],
}: PropsWithChildren<{
  projectIds: string[];
}>) {
  const queryClient = useQueryClient();

  const [trigger, setTrigger] = useState(false);

  const { data, isLoading, status, isFetching, refetch } =
    useApprovedApplications(projectIds);

  const { mutate: revoke, isPending } = useRevokeAttestations({
    onSuccess: () => {
      handleRefetch(5000);
    },
    onError: () => {
      handleRefetch(5000);
    },
  });
  const { mutate: approve, isPending: approvalPending } = useApproveApplication(
    {
      onSuccess: () => {
        handleRefetch(5000);
      },
    },
  );
  const handleRefetch = (timeout: number) => {
    // @ts-ignore
    queryClient.removeQueries(["approvedApplications", { ids: projectIds }]);
    setTimeout(() => {
      refetch().then(() => {
        setTrigger(!trigger);
      });
    }, timeout);
  };

  const { address } = useAccount();

  const showRevoke = useMemo(() => {
    return data && data.length > 0;
  }, [data, refetch, projectIds, isFetching, handleRefetch, trigger]);

  const attestations = data?.map((x) => x?.id) ?? ([] as string[]);

  useEffect(() => {}, [isFetching, data, refetch, projectIds]);

  useEffect(() => {
    handleRefetch(0);
  }, [projectIds]);

  if (!data || isLoading || status != "success") return null;

  return (
    <>
      {showRevoke ? (
        <Button
          size="sm"
          variant="outline"
          disabled={data?.some((x) => x?.attester !== address)}
          isLoading={isPending}
          onClick={() => {
            if (
              window.confirm(
                "Are you sure? This will revoke the application and must be done by the same person who approved it.",
              )
            ) {
              revoke(attestations);
            }
          }}
        >
          Revoke
        </Button>
      ) : (
        <Button
          variant="primary"
          disabled={approvalPending}
          onClick={() => approve(projectIds)}
        >
          {children}
        </Button>
      )}
    </>
  );
}

export default dynamic(() => Promise.resolve(ApproveRejectButton));
