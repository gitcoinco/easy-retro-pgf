import {
    BaseError,
    ContractFunctionRevertedError,
    InsufficientFundsError,
    UserRejectedRequestError,
  } from "viem";

export function handleTransactionError(error: any) {
    if (error instanceof BaseError) {
      const revertError = error.walk(
        (err) => err instanceof ContractFunctionRevertedError,
      );
      if (revertError instanceof ContractFunctionRevertedError) {
        const errorName = revertError.data?.errorName ?? "Unknown Error";
        console.log("errorName", errorName);
        throw { reason: errorName, data: { message: errorName } };
      }

      const isInsufficientFundsError =
        error.walk((e) => e instanceof InsufficientFundsError) instanceof
        InsufficientFundsError;
      if (isInsufficientFundsError) {
        throw {
          reason: "Insufficient Funds",
          data: { message: "Insufficient Funds" },
        };
      }
      const isUserRejectedRequestError =
        error.walk((e) => e instanceof UserRejectedRequestError) instanceof
        UserRejectedRequestError;
      if (isUserRejectedRequestError) {
        throw {
          reason: "User Rejected Request",
          data: { message: "User Rejected Request" },
        };
      }
    }
    // unknown error
    throw {
      reason: "Transaction Failed",
      data: { message: String("unknown reason") },
    };
  }