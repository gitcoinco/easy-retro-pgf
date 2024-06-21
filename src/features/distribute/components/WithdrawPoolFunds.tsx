import { z } from "zod";
import { Form, FormControl, Input } from "~/components/ui/Form";
import {
  useAddPoolManager,
  useIsPoolManager,
  useWithdrawPoolFunds,
} from "../hooks/useAlloPool";
import { Button } from "~/components/ui/Button";
import { EthAddressSchema } from "../types";
import { Dialog } from "~/components/ui/Dialog";
import { useState } from "react";

export function WithdrawPoolFunds({ poolId = 0 }) {
  const { data: isPoolManager } = useIsPoolManager(poolId);
  const withdraw = useWithdrawPoolFunds(poolId);
  const [isOpen, setOpen] = useState(false);
  if (!poolId || !isPoolManager) return null;

  console.log(withdraw.error);
  return (
    <>
      <Button className={"w-full"} onClick={() => setOpen(true)}>
        Withdraw funds
      </Button>
      <Dialog
        title="Withdraw funds from pool"
        isOpen={isOpen}
        onOpenChange={setOpen}
      >
        <Form
          schema={z.object({
            address: EthAddressSchema,
          })}
          onSubmit={({ address }) => {
            withdraw.mutate({ address });
          }}
        >
          <div className="gap-2">
            <FormControl name="address" label="Address of recipient">
              <Input placeholder="0x..." />
            </FormControl>
            <Button
              variant="primary"
              type="submit"
              className="w-full"
              disabled={withdraw.isPending}
            >
              Withdraw
            </Button>
          </div>
        </Form>
      </Dialog>
    </>
  );
}
