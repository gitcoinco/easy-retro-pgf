import { useFormContext } from "react-hook-form";

import { Button } from "~/components/ui/Button";
import type { Attestation } from "~/utils/fetchAttestations";
import type { ApplicationsList } from "./ApplicationsList";

export function SelectAllButton({
  applications = [],
}: {
  applications: Attestation[] | undefined;
}) {
  const form = useFormContext<ApplicationsList>();
  const selected = form.watch("selected");
  const isAllSelected =
    selected?.length > 0 && selected?.length === applications?.length;
  return (
    <Button
      disabled={!applications.length}
      type="button"
      onClick={() => {
        const selectAll = isAllSelected ? [] : applications.map(({ id }) => id);
        form.setValue("selected", selectAll);
      }}
    >
      {isAllSelected ? "Deselect all" : "Select all"}
    </Button>
  );
}
