import { type PropsWithChildren } from "react";
import { z } from "zod";
import dynamic from "next/dynamic";
import { formatUnits, parseUnits } from "viem";
import { useAccount } from "wagmi";
import { useSession } from "next-auth/react";
import { useFormContext } from "react-hook-form";

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
import { allo } from "~/config";
import {
  ErrorMessage,
  Form,
  FormControl,
  Input,
  Label,
} from "~/components/ui/Form";
import { NumberInput } from "~/components/NumberInput";

function CheckAlloProfile(props: PropsWithChildren) {
  const { isCorrectNetwork, correctNetwork } = useIsCorrectNetwork();
  const profile = useAlloProfile();
  const createProfile = useCreateAlloProfile();

  if (!isCorrectNetwork) {
    return (
      <Alert variant="info" className="flex items-center gap-2">
        You must be connected to {correctNetwork?.name}
      </Alert>
    );
  }

  if (profile.isPending) {
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
          icon={createProfile.isPending ? Spinner : null}
          variant="primary"
          onClick={() => createProfile.mutate()}
          disabled={createProfile.isPending}
        >
          {createProfile.isPending ? (
            <>Creating profile...</>
          ) : (
            <>Create profile</>
          )}
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

  if (poolId.isPending) {
    return (
      <Alert className="flex justify-center">
        <Spinner />
      </Alert>
    );
  }

  if (poolId.data) {
    return <PoolDetails poolId={poolId.data} />;
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
          const amount = parseUnits(values.amount.toString(), decimals);

          const hasAllowance = calcHasAllowance(
            { amount: values.amount, allowance },
            token.data,
          );

          if (!hasAllowance) {
            return approve.mutate(amount);
          }

          return createPool.mutate({ profileId, initialFunding: amount });
        }}
      >
        <FormControl name="tokenAddress" label="Token">
          <Input disabled readOnly value={token.data?.symbol} />
        </FormControl>
        <Label>
          Amount of tokens to fund
          <NumberInput name="amount" />
        </Label>

        <div className="mb-2">
          <TokenBalance />
        </div>

        <FundPoolButton
          buttonText="Create pool"
          isLoading={createPool.isPending || approve.isPending}
          allowance={allowance.data}
          balance={balance.data?.value}
          token={token.data}
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
        onSubmit={async (values, form) => {
          const amount = parseUnits(values.amount.toString(), decimals);
          const hasAllowance = calcHasAllowance(
            { amount: values.amount, allowance },
            token.data,
          );

          if (!hasAllowance) {
            return approve.mutate(amount);
          }
          fundPool.mutate(
            { poolId, amount },
            { onSuccess: () => form.reset({ amount: 0 }) },
          );
        }}
      >
        <div className="mb-2 space-y-2">
          <NumberInput name="amount" />
          <TokenBalance />
        </div>

        <FundPoolButton
          buttonText="Fund pool"
          isLoading={fundPool.isPending}
          // isLoading={fundPool.isPending || approve.isPending}
          allowance={allowance}
          balance={balance.data?.value}
          token={token.data}
        />

        <ErrorMessage>{(error as { message: string })?.message}</ErrorMessage>
      </Form>
    </Alert>
  );
}

function TokenBalance() {
  const balance = useTokenBalance();
  return (
    <div className="flex justify-between text-sm">
      <div className="text-gray-500">Wallet balance</div>
      <div>
        {balance.data?.formatted.slice(0, 5)} {balance.data?.symbol}
      </div>
    </div>
  );
}

function FundPoolButton({
  buttonText = "",
  isLoading = false,
  allowance = 0n,
  balance = 0n,
  token,
}: {
  buttonText: string;
  isLoading?: boolean;
  allowance?: bigint;
  balance?: bigint;
  token: { decimals: number; isNativeToken: boolean };
}) {
  const { address } = useAccount();
  const session = useSession();
  const { formState, watch } = useFormContext<{ amount: number }>();
  const amount = watch("amount") || 0;

  const hasAllowance = calcHasAllowance({ amount, allowance }, token);
  const disabled = isLoading || Boolean(formState.errors.amount);

  if (!address || !session) {
    return (
      <Button className="w-full" disabled>
        Connect wallet
      </Button>
    );
  }

  if (parseUnits(String(amount), token.decimals) > balance) {
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
function calcHasAllowance(
  { allowance = 0n, amount = 0 },
  token: { decimals: number; isNativeToken: boolean },
) {
  return token.isNativeToken
    ? true
    : allowance >= parseUnits(amount.toString(), token.decimals);
}

export default dynamic(() => Promise.resolve(ConfigurePool), { ssr: false });
