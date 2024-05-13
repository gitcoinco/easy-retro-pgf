import {
    EContracts,
    PollFactory__factory as PollFactoryFactory,
    MessageProcessorFactory__factory as MessageProcessorFactoryFactory,
    TallyFactory__factory as TallyFactoryFactory,
    MACI__factory as MACIFactory,
    ConstantInitialVoiceCreditProxy__factory as ConstantInitialVoiceCreditProxyFactory,
    EASGatekeeper__factory as EASGatekeeperFactory,
    Verifier__factory as VerifierFactory,
    PoseidonT3__factory as PoseidonT3Factory,
    PoseidonT4__factory as PoseidonT4Factory,
    PoseidonT5__factory as PoseidonT5Factory,
    PoseidonT6__factory as PoseidonT6Factory,
    VkRegistry__factory as VkRegistryFactory,
  } from "maci-cli/sdk";
import type { IAbi } from "./types";

/**
 * Constant variables
 */
export const STATE_TREE_SUB_DEPTH = 2;

/**
 * Constant mapping of ABIs
 */
export const ABI: IAbi = {
    EContracts.ConstantInitialVoiceCreditProxy: ConstantInitialVoiceCreditProxyFactory.abi,
    EContracts.EASGatekeeper: EASGatekeeperFactory.abi,
    EContracts.Verifier: VerifierFactory.abi,
    EContracts.PoseidonT3: PoseidonT3Factory.abi,
    EContracts.PoseidonT4: PoseidonT4Factory.abi,
    EContracts.PoseidonT5: PoseidonT5Factory.abi,
    EContracts.PoseidonT6: PoseidonT6Factory.abi,
    EContracts.PollFactory: PollFactoryFactory.abi,
    EContracts.MessageProcessorFactory: MessageProcessorFactoryFactory.abi,
    EContracts.TallyFactory: TallyFactoryFactory.abi,
    EContracts.MACI: MACIFactory.abi,
    EContracts.VkRegistry: VkRegistryFactory.abi,
}
