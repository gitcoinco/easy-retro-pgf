import { Button, IconButton } from "~/components/ui/Button";

import { Alert } from "~/components/ui/Alert";
import { useIsCorrectNetwork } from "~/hooks/useIsCorrectNetwork";
import { Spinner } from "~/components/ui/Spinner";
import { useAlloProfile, useCreateAlloProfile } from "../hooks/useAlloProfile";
import {
  useApprove,
  useCreatePool,
  useFundPool,
  usePoolAmount,
  usePoolId,
  usePoolToken,
  useTokenAllowance,
  useTokenBalance,
} from "../hooks/useAlloPool";
import { allo, isNativeToken } from "~/config";
import { formatUnits, parseUnits } from "viem";
import { ErrorMessage, Form, FormControl, Input } from "~/components/ui/Form";
import { z } from "zod";
import dynamic from "next/dynamic";
import { AllocationInput } from "~/features/ballot/components/AllocationInput";
import { useFormContext } from "react-hook-form";
import { MintButton } from "./MintButton";

function CreatePool() {
  const { isCorrectNetwork, correctNetwork } = useIsCorrectNetwork();
  const createPool = useCreatePool();
  const profile = useAlloProfile();
  const poolId = usePoolId();
  const createProfile = useCreateAlloProfile();
  const approve = useApprove();
  const balance = useTokenBalance();

  const allowance = useTokenAllowance();

  const token = usePoolToken();

  const decimals = token.data?.decimals;
  if (!isCorrectNetwork) {
    return (
      <Alert variant="info" className="flex items-center gap-2">
        You must be connected to {correctNetwork.name}
      </Alert>
    );
  }

  const profileId = profile.data?.id ?? "";
  if (!profile.data) {
    return (
      <Alert variant="info" title="No Allo profile found">
        <p className="mb-8">
          You must create an Allo2 profile before you can create a pool.
        </p>
        <IconButton
          className={"w-full"}
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

  if (poolId.data) {
    return <PoolDetails poolId={Number(poolId.data.toString())} />;
  }

  return (
    <Alert title="Create pool" variant="info">
      <p className="mb-8 leading-6">
        Before you can distribute funds to the projects you need to create a
        pool
      </p>
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-widest text-gray-700 dark:text-gray-300">
        Pool configuration
      </h3>

      <Form
        schema={z.object({
          strategyAddress: z.string(),
          tokenName: z.string(),
          amount: z.number().default(0),
        })}
        defaultValues={{
          amount: undefined,
          strategyAddress: allo.strategyAddress,
          tokenName: "ETH",
        }}
        onSubmit={(values) => {
          console.log(values);

          // TODO: If token is ERC20 - approve spending
          const amount = parseUnits(values.amount.toString(), decimals);
          console.log({ amount });
          const hasAllowance = isNativeToken
            ? true
            : (allowance.data ?? 0) >= amount;

          if (!hasAllowance) {
            return approve.write({
              args: [allo.alloAddress, amount],
            });
          }
          createPool.mutate({
            profileId,
            initialFunding: amount,
          });
        }}
      >
        <FormControl name="strategyAddress" label="Strategy address">
          <Input readOnly value={allo.strategyAddress} />
        </FormControl>
        <FormControl name="tokenAddress" label="Token">
          <Input readOnly value={token.data?.symbol ?? "ETH"} />
        </FormControl>

        <FormControl name="amount" label="Amount of tokens to fund">
          <AllocationInput tokenAddon />
        </FormControl>

        <FundPoolButton
          isLoading={createPool.isLoading || approve.isLoading}
          decimals={decimals}
          allowance={allowance.data}
          balance={balance.data?.value}
        />
      </Form>
    </Alert>
  );
}

function PoolDetails({ poolId = 0 }) {
  const amount = usePoolAmount();
  const allowance = useTokenAllowance().data;
  const balance = useTokenBalance();
  const fundPool = useFundPool();
  const token = usePoolToken();
  const approve = useApprove();

  const decimals = token.data?.decimals ?? 18;

  const error = approve.error ?? fundPool.error;

  console.log("err", error);
  return (
    <Alert variant="info" title="Pool">
      <div>
        Pool amount: {formatUnits(amount.data ?? 0n, decimals)}{" "}
        {token.data?.symbol}
      </div>

      <Form
        schema={z.object({
          amount: z.number(),
        })}
        defaultValues={{ amount: 0 }}
        onSubmit={async (values) => {
          const amount = parseUnits(values.amount.toString(), decimals);
          console.log({ amount });
          const hasAllowance = calcHasAllowance({
            amount,
            allowance,
            decimals,
          });

          if (!hasAllowance) {
            return approve.write({
              args: [allo.alloAddress, amount],
            });
          }

          fundPool.mutate({ poolId, amount });
        }}
      >
        <div className="flex justify-end gap-1 text-sm">
          <span className="text-gray-500">Balance:</span>
          <span className="font-semibold">
            {balance.data?.formatted.slice(0, 5)}
          </span>
        </div>
        <div className="mb-2">
          <AllocationInput name="amount" tokenAddon />
        </div>

        <FundPoolButton
          isLoading={fundPool.isLoading || approve.isLoading}
          decimals={decimals}
          allowance={allowance}
          balance={balance.data?.value}
        />

        <ErrorMessage>{(error as { message: string })?.message}</ErrorMessage>
      </Form>

      <MintButton />
    </Alert>
  );
}

function FundPoolButton({
  isLoading = false,
  allowance = 0n,
  balance = 0n,
  decimals = 18,
}) {
  const { formState, watch } = useFormContext<{ amount: number }>();
  const amount = BigInt(watch("amount") || 0);

  const hasAllowance = calcHasAllowance({ amount, allowance, decimals });

  const disabled = isLoading || Boolean(formState.errors.amount);

  if (!balance) {
    return (
      <Button className={"w-full"} disabled>
        Not enough funds
      </Button>
    );
  }

  if (!amount) {
    return (
      <Button className="w-full" disabled>
        Enter an amount
      </Button>
    );
  }

  // const buttonText =

  return (
    <IconButton
      className={"w-full"}
      icon={isLoading ? Spinner : null}
      variant="primary"
      type="submit"
      disabled={disabled}
    >
      {isLoading ? (
        <>Processing...</>
      ) : hasAllowance ? (
        "Fund pool"
      ) : (
        "Approve spending"
      )}
    </IconButton>
  );
}

function calcHasAllowance({ allowance = 0n, amount = 0n, decimals = 18 }) {
  return isNativeToken
    ? true
    : allowance >= parseUnits(amount.toString(), decimals);
}

export default dynamic(() => Promise.resolve(CreatePool), { ssr: false });
