import { useFormContext } from "react-hook-form";

import { Button } from "~/components/ui/Button";
import { EnsureCorrectNetwork } from "~/components/EnureCorrectNetwork";
import type { ApplicationsList } from "./ApplicationsList";

export function ApproveButton({ isLoading = false }) {
  const form = useFormContext<ApplicationsList>();
  const selectedCount = Object.values(form.watch("selected") ?? {}).filter(
    Boolean,
  ).length;
  return (
    <EnsureCorrectNetwork>
      <Button
        suppressHydrationWarning
        isLoading={isLoading}
        disabled={!selectedCount || isLoading}
        variant="primary"
        type="submit"
      >
        Approve {selectedCount} applications
      </Button>
    </EnsureCorrectNetwork>
  );
}
