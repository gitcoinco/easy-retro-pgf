import type { ISnarkJSVerificationKey, EContracts } from "maci-cli/sdk";
import type { BaseContract } from "ethers";

/**
 * Interface that represents deploy args for initial voice credit proxy
 */
export interface IDeployInitialVoiceCreditProxyArgs {
  /**
   * Amount of voice credits
   */
  amount: number;
}

/**
 * Interface that represents deploy args for gatekeeper
 */
export interface IDeployGatekeeperArgs {
  /**
   * EAS registry address
   */
  easAddress: string;

  /**
   * Schema uuid
   */
  encodedSchema: string;

  /**
   * Attester address
   */
  attester: string;
}

/**
 * Interface that represents deploy args for MACI
 */
export interface IDeployMaciArgs {
  /**
   * State tree depth
   */
  stateTreeDepth: number;
}

/**
 * Interface that represents deploy args for VkRegistry
 */
export interface IDeployVkRegistryArgs {
  /**
   * State tree depth
   */
  stateTreeDepth: number;

  /**
   * The depth of the state subtree
   */
  intStateTreeDepth: number;

  /**
   * The depth of the message tree
   */
  messageTreeDepth: number;

  /**
   * The depth of the vote option tree
   */
  voteOptionTreeDepth: number;

  /**
   * The depth of the message batch tree
   */
  messageBatchDepth: number;

  /**
   * Extracted process message zkey for QV
   */
  processMessagesZkeyPathQv: ISnarkJSVerificationKey;

  /**
   * Extracted process message zkey for Non-QV
   */
  processMessagesZkeyPathNonQv: ISnarkJSVerificationKey;

  /**
   * Extracted tally votes zkey for QV
   */
  tallyVotesZkeyPathQv: ISnarkJSVerificationKey;

  /**
   * Extracted tally votes zkey for Non-QV
   */
  tallyVotesZkeyPathNonQv: ISnarkJSVerificationKey;
}

export interface IRegisterArgs {
  /**
   * Id of the contract
   */
  id: EContracts;

  /**
   * Contract instance
   */
  contract: BaseContract;

  /**
   * args for ContractStorage
   */
  args?: unknown[];
}

export interface IRegisterExistingContractArgs {
  /**
   * Id of the contract
   */
  id: EContracts;

  /**
   * Contract address
   */
  address: string;

  /**
   * args for ContractStorage
   */
  args?: unknown[];
}
