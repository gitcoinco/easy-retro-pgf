import { z } from "zod";
import { Check, UserRoundPlus } from "lucide-react";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { Trash2 } from "lucide-react";
import { type Address, isAddress } from "viem";

import { Button } from "~/components/ui/Button";
import { Dialog } from "~/components/ui/Dialog";
import { Checkbox, Form, FormControl, Textarea } from "~/components/ui/Form";
import { NameENS } from "~/components/ENS";
import { EnsureCorrectNetwork } from "~/components/EnureCorrectNetwork";
import { cn } from "~/utils/classNames";

type Props = {
  title: string;
  description: string;
  isOpen: boolean;
  isLoading: boolean;
  onOpenChange: () => void;
  onSubmit: (addresses: Address[]) => void;
};

export const AddressSchema = z.object({ selected: z.array(z.string()) });

export function AddAddressesModal({
  title,
  description,
  isOpen,
  isLoading,
  onOpenChange,
  onSubmit,
}: Props) {
  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange} title={title}>
      <p className="pb-4 leading-relaxed">{description}</p>
      <p className="pb-4 leading-relaxed text-gray-400">
        Enter all the addresses as a comma-separated list below. Duplicates and
        invalid addresses will automatically be removed.
      </p>
      <Form
        schema={z.object({
          addresses: z.string(),
        })}
        onSubmit={(values) => {
          const addresses = parseAddresses(values.addresses);
          onSubmit(addresses);
        }}
      >
        <div className="mb-2"></div>
        <FormControl name="addresses">
          <Textarea placeholder="0x..." rows={8} />
        </FormControl>
        <div className="flex items-center justify-end">
          <ApproveButton isLoading={isLoading} />
        </div>
      </Form>
    </Dialog>
  );
}

export function AddressList({
  voters = [],
  disabled = [],
}: {
  voters?: { address: `0x${string}`; hasVoted: boolean | undefined }[];
  disabled?: string[];

}) {
  const form = useFormContext<{ selected: string[] }>();
  return (
    <div>
      {!voters.length && (
        <div className="flex items-center justify-center p-6">
          No addresses added yet.
        </div>
      )}
      {voters.map((voter) => {
        const isDisabled = disabled.includes(voter.address);
        return (
          <div
            key={voter.address}
            className={cn(
              "flex items-center gap-2 rounded border-b dark:border-gray-800 hover:dark:bg-gray-800",
              {
                ["opacity-60"]: isDisabled,
              },
            )}
          >
            <label className="flex flex-1 cursor-pointer items-center gap-4 p-3 font-mono">
              <Checkbox
                disabled={isDisabled}
                value={voter.address}
                {...form.register(`selected`)}
              />
              <NameENS address={voter.address} truncateLength={100} />
              {voter.hasVoted ? (
                  <span className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">voted</span>
                    <Check className="size-3 text-green-600" />
                  </span>
                ) : null}
            </label>
          </div>
        );
      })}
    </div>
  );
}

export function SelectAllButton({ addresses = [] }: { addresses?: string[] }) {
  const form = useFormContext<{ selected: string[] }>();
  const selected = form.watch("selected");
  const isAllSelected =
    selected?.length > 0 && selected?.length === addresses?.length;

  return (
    <Button
      disabled={!addresses.length}
      type="button"
      onClick={() => {
        const selectAll = isAllSelected ? [] : addresses;
        form.setValue("selected", selectAll);
      }}
    >
      {isAllSelected ? "Deselect all" : "Select all"}
    </Button>
  );
}

export function DeleteSelectedButton({
  onDelete,
}: {
  onDelete: (addresses: string[]) => void;
}) {
  const form = useFormContext<{ selected: string[] }>();
  const selected = form.watch("selected");

  return (
    <Button
      variant="danger"
      icon={Trash2}
      disabled={!selected.length}
      onClick={() => {
        if (
          window.confirm(
            `Are you sure? This will delete ${selected.length} addresses.`,
          )
        ) {
          onDelete(selected);
          form.setValue("selected", []);
        }
      }}
    >
      Remove
    </Button>
  );
}

function ApproveButton({ isLoading = false }) {
  const form = useFormContext<{ addresses: string }>();
  const addresses = form.watch("addresses");

  const selectedCount = useMemo(
    () => parseAddresses(addresses ?? "").length,
    [addresses],
  );

  return (
    <EnsureCorrectNetwork>
      <Button
        icon={UserRoundPlus}
        isLoading={isLoading}
        disabled={!selectedCount || isLoading}
        variant="primary"
        type="submit"
      >
        Add {selectedCount} addresses
      </Button>
    </EnsureCorrectNetwork>
  );
}

function parseAddresses(addresses: string): Address[] {
  return addresses
    .split(",")
    .map((addr) => addr.trim())
    .filter((addr) => isAddress(addr))
    .filter((addr, i, self) => self.indexOf(addr) === i);
}
