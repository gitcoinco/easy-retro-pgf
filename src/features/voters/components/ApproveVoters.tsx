import { z } from "zod";
import { Form, FormControl, Textarea } from "~/components/ui/Form";
import { type Address, useAccount } from "wagmi";
import { useFormContext } from "react-hook-form";
import { config } from "~/config";
import { IconButton } from "~/components/ui/Button";
import { useMemo, useState } from "react";
import { UserRoundPlus } from "lucide-react";
import { isAddress } from "viem";
import { Spinner } from "~/components/ui/Spinner";
import { toast } from "sonner";
import { Dialog } from "~/components/ui/Dialog";
import { useApproveVoters } from "../hooks/useApproveVoters";

function parseAddresses(addresses: string): Address[] {
  return addresses
    .split(",")
    .map((addr) => addr.trim())
    .filter(isAddress)
    .filter((addr, i, self) => self.indexOf(addr) === i);
}

export function ApproveVoters() {
  const [isOpen, setOpen] = useState(false);
  const approve = useApproveVoters({
    onSuccess: () => {
      toast.success("Voters approved successfully!");
      setOpen(false);
    },
    onError: (err: { reason?: string; data?: { message: string } }) =>
      toast.error("Voter approve error", {
        description: err.reason ?? err.data?.message,
      }),
  });

  return (
    <div>
      <IconButton
        icon={UserRoundPlus}
        variant="primary"
        onClick={() => setOpen(true)}
      >
        Add voters
      </IconButton>
      <Dialog isOpen={isOpen} onOpenChange={setOpen} title={`Approve voters`}>
        <p className="pb-4 leading-relaxed">
          Add voters who will be allowed to vote in the round.
        </p>
        <p className="pb-4 leading-relaxed">
          Enter all the addresses as a comma-separated list below. Duplicates
          and invalid addresses will automatically be removed.
        </p>
        <Form
          schema={z.object({
            voters: z.string().startsWith("0x"),
          })}
          onSubmit={(values) => {
            const voters = parseAddresses(values.voters);
            console.log("Approve voters", { voters });
            approve.mutate(voters);
          }}
        >
          <div className="mb-2"></div>
          <FormControl name="voters">
            <Textarea
              placeholder="Comma-separated list of addresses to approve"
              rows={8}
            />
          </FormControl>
          <div className="flex items-center justify-end">
            <ApproveButton isLoading={approve.isLoading} />
          </div>
        </Form>
      </Dialog>
    </div>
  );
}

function ApproveButton({ isLoading = false }) {
  const form = useFormContext<{ voters: string }>();
  const voters = form.watch("voters");

  const selectedCount = useMemo(
    () => parseAddresses(voters ?? "").length,
    [voters],
  );
  const { address } = useAccount();

  const isAdmin = config.admins.includes(address!);
  return (
    <IconButton
      suppressHydrationWarning
      icon={isLoading ? Spinner : UserRoundPlus}
      disabled={!selectedCount || !isAdmin || isLoading}
      variant="primary"
      type="submit"
    >
      {isAdmin ? `Approve ${selectedCount} voters` : "You must be an admin"}
    </IconButton>
  );
}
