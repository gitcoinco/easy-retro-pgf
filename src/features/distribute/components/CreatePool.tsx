import { Button, IconButton } from "~/components/ui/Button";

import { Alert } from "~/components/ui/Alert";
import { useIsCorrectNetwork } from "~/hooks/useIsCorrectNetwork";
import { Spinner } from "~/components/ui/Spinner";
import {
  useAlloIsMemberOfProfile,
  useAlloProfile,
  useAlloRegistryAddMember,
  useCreateAlloProfile,
} from "../hooks/useAlloProfile";
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
import { allo, config, isNativeToken } from "~/config";
import { formatUnits, parseUnits } from "viem";
import { ErrorMessage, Form, FormControl, Input } from "~/components/ui/Form";
import { z } from "zod";
import dynamic from "next/dynamic";
import { AllocationInput } from "~/features/ballot/components/AllocationInput";
import { useFormContext } from "react-hook-form";
import { MintButton } from "./MintButton";
import { useAccount } from "wagmi";
import { useSession } from "next-auth/react";
import { type PropsWithChildren } from "react";

function CheckAlloProfile(props: PropsWithChildren) {
  const { isCorrectNetwork, correctNetwork } = useIsCorrectNetwork();
  const profile = useAlloProfile();
  const createProfile = useCreateAlloProfile();

  const isMember = useAlloIsMemberOfProfile();
  const addMember = useAlloRegistryAddMember();

  console.log("create profile,", createProfile.data);
  if (!isCorrectNetwork) {
    return (
      <Alert variant="info" className="flex items-center gap-2">
        You must be connected to {correctNetwork.name}
      </Alert>
    );
  }

  if (profile.isLoading || isMember.isLoading) {
    return (
      <Alert className="flex justify-center">
        <Spinner />
      </Alert>
    );
  }

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

  if (!isMember.data) {
    return (
      <Alert variant="info" title="Update Registry member">
        <p className="mb-8">
          You must add the Strategy contract as a member to your Allo2 profile
          before you can create a pool.
        </p>
        <IconButton
          className={"w-full"}
          icon={addMember.isLoading ? Spinner : null}
          variant="primary"
          onClick={() => addMember.mutate()}
          disabled={addMember.isLoading}
        >
          {addMember.isLoading ? <>Updating...</> : <>Update membership</>}
        </IconButton>
      </Alert>
    );
  }

  return props.children;
}

function CreatePool() {
  const createPool = useCreatePool();
  const profile = useAlloProfile();
  const approve = useApprove();
  const balance = useTokenBalance();
  const poolId = usePoolId();
  const allowance = useTokenAllowance();

  const token = usePoolToken();

  const decimals = token.data?.decimals;

  const profileId = profile.data?.id as unknown as `0x${string}`;

  console.log(poolId.data);
  if (poolId.data) {
    return <PoolDetails poolId={Number(poolId.data)} />;
  }

  console.log(createPool.data);
  const createdPoolId = createPool.data;
  if (createPool.data) {
    return (
      <Alert title="Pool created!" variant="info">
        Add this to your environment variables and deploy again.
        <div>
          <div className="overflow-auto font-mono text-xs">
            NEXT_PUBLIC_ALLO2_CUSTOM_STRATEGY="{createPool.data}"
          </div>
        </div>
      </Alert>
    );
  }

  return (
    <Alert title="Create pool" variant="info">
      <p className="mb-8 leading-6">
        Before you can distribute funds to the projects you need to create a
        pool.
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
          amount: 0,
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
              // args: [allo.strategyAddress, amount],
            });
          }

          console.log({ profileId });
          // return createPool.mutate({ profileId, initialFunding: amount });
          createPool.write({
            args: [profileId, allo.tokenAddress, amount, config.admins],
          });
        }}
      >
        <FormControl name="tokenAddress" label="Token">
          <Input disabled readOnly value={token.data?.symbol ?? "ETH"} />
        </FormControl>
        {/* 
        <FormControl name="amount" label="Amount of tokens to fund">
          <AllocationInput tokenAddon />
        </FormControl> */}

        <FundPoolButton
          buttonText="Create pool"
          isLoading={createPool.isLoading || approve.isLoading}
          decimals={decimals}
          allowance={allowance.data}
          balance={balance.data?.value}
        />
      </Form>
    </Alert>
  );
}

function ConfigurePool() {
  return (
    <CheckAlloProfile>
      <CreatePool />
    </CheckAlloProfile>
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

  return (
    <Alert variant="info">
      <div className="mb-4 flex flex-col items-center">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-widest text-gray-500">
          Currently in pool
        </h3>
        <div className="text-2xl">
          {formatUnits(amount.data ?? 0n, decimals)} {token.data?.symbol}
        </div>
      </div>

      <Form
        schema={z.object({
          amount: z.number(),
        })}
        onSubmit={async (values) => {
          const amount = parseUnits(values.amount.toString(), decimals);
          console.log({ amount });
          const hasAllowance = calcHasAllowance({
            amount: BigInt(values.amount),
            allowance,
            decimals,
          });
          console.log("FUND pool", { hasAllowance });

          if (!hasAllowance) {
            return approve.write({
              args: [allo.alloAddress, amount],
            });
          }
          fundPool.mutate({ poolId, amount });
        }}
      >
        <div className="flex justify-between text-sm">
          <div>Fund pool</div>
          <div className="flex gap-1">
            <span className="text-gray-500">Wallet balance:</span>
            <span className="font-semibold">
              {balance.data?.formatted.slice(0, 5)}
            </span>
          </div>
        </div>
        <div className="mb-2">
          <AllocationInput name="amount" tokenAddon />
        </div>

        <FundPoolButton
          buttonText="Fund pool"
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
  buttonText = "",
  isLoading = false,
  allowance = 0n,
  balance = 0n,
  decimals = 18,
}) {
  const { address } = useAccount();
  const session = useSession();
  const { formState, watch } = useFormContext<{ amount: number }>();
  const amount = BigInt(watch("amount") || 0);

  const hasAllowance = calcHasAllowance({ amount, allowance, decimals });
  console.log({ hasAllowance });
  const disabled = isLoading || Boolean(formState.errors.amount);

  if (!address || !session) {
    return (
      <Button className="w-full" disabled>
        Connect wallet
      </Button>
    );
  }

  if (!balance) {
    return (
      <Button className={"w-full"} disabled>
        Not enough funds
      </Button>
    );
  }

  if (amount === undefined) {
    return (
      <Button className="w-full" disabled>
        Enter an amount
      </Button>
    );
  }

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
        buttonText
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

export default dynamic(() => Promise.resolve(ConfigurePool), { ssr: false });
