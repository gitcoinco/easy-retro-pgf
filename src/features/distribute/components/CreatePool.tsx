import { Button, IconButton } from "~/components/ui/Button";

import { Alert } from "~/components/ui/Alert";
import { useIsCorrectNetwork } from "~/hooks/useIsCorrectNetwork";
import { Spinner } from "~/components/ui/Spinner";
import { useAlloProfile, useCreateAlloProfile } from "../hooks/useAlloProfile";
import { useCreatePool } from "../hooks/useAlloPool";

export function CreatePool() {
  const { isCorrectNetwork, correctNetwork } = useIsCorrectNetwork();
  const create = useCreatePool();
  const profile = useAlloProfile();
  const createProfile = useCreateAlloProfile();

  console.log("profile", profile.data, profile.error);
  console.log("createprofile", createProfile.data, createProfile.error);

  if (!isCorrectNetwork) {
    return (
      <div className="flex items-center gap-2">
        You must be connected to {correctNetwork.name}
      </div>
    );
  }

  const profileId = profile.data?.id ?? "";
  if (!profile.data) {
    return (
      <Alert title="No Allo profile found">
        <p>You must create an Allo2 profile before you can create a pool.</p>
        <IconButton
          icon={createProfile.isLoading ? Spinner : null}
          variant="primary"
          onClick={() => createProfile.mutate()}
          disabled={createProfile.isLoading}
        >
          {createProfile.isLoading ? (
            <>Creating profile...</>
          ) : (
            <>Create profile</>
          )}
        </IconButton>
      </Alert>
    );
  }

  return (
    <Button
      disabled={!profileId}
      variant="primary"
      onClick={() => create.mutate({ profileId })}
    >
      Create Pool
    </Button>
  );
}
