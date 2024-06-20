import { z } from "zod";
import { Form, FormControl, Input } from "~/components/ui/Form";
import { useAddPoolManager } from "../hooks/useAlloPool";
import { Button } from "~/components/ui/Button";
import { EthAddressSchema } from "../types";
import { Dialog } from "~/components/ui/Dialog";
import { useState } from "react";

export function AddPoolAdmin({ poolId = 0 }) {
  const add = useAddPoolManager();
  const [isOpen, setOpen] = useState(false);
  if (!poolId) return null;
  return (
    <>
      <Button className={"w-full"} onClick={() => setOpen(true)}>
        Add PoolManager
      </Button>
      <Dialog isOpen={isOpen} onOpenChange={setOpen}>
        <Form
          schema={z.object({
            address: EthAddressSchema,
          })}
          onSubmit={({ address }) => {
            add.mutate({ poolId, address });
          }}
        >
          <div className="gap-2">
            <FormControl name="address" label="Address">
              <Input placeholder="0x..." />
            </FormControl>
            <Button
              variant="primary"
              type="submit"
              className="w-full"
              disabled={add.isPending}
            >
              Add PoolManager
            </Button>
          </div>
        </Form>
      </Dialog>
    </>
  );
}
