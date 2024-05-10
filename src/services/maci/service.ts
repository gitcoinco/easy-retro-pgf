import {
  linkPoseidonLibraries,
  Deployment,
  ContractStorage,
  EContracts,
  EMode,
  VerifyingKey,
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
  type MACI,
  type EASGatekeeper,
  type IVerifyingKeyStruct,
  type VkRegistry,
  type IVkObjectParams,
} from "maci-cli/sdk";

import type {
  IDeployGatekeeperArgs,
  IDeployInitialVoiceCreditProxyArgs,
  IDeployMaciArgs,
  IDeployVkRegistryArgs,
  IRegisterArgs,
  IRegisterExistingContractArgs,
} from "./types";
import { type Signer, Contract } from "ethers";

/**
 * MACI service is responsible for deployment of MACI components like:
 * 1. VoiceCreditProxy
 * 2. Gatekeeper
 * 3. Verifier
 * 4. Poseidon contracts
 * 5. PollFactory
 * 6. MessageProcessorFactory
 * 7. TallyFactory
 * 8. MACI contract
 * 9. VkRegistry
 */
export class MaciService {
  /**
   * Deployment helper
   */
  private readonly deployment = Deployment.getInstance();

  /**
   * Contract storage helper
   */
  private readonly storage = ContractStorage.getInstance();

  /**
   * Deployer
   */
  private readonly deployer: Signer;

  /**
   * Initialization for MACI service
   *
   * @param deployer - eth signer
   */
  constructor(deployer: Signer) {
    this.deployer = deployer;
  }

  /**
   * Deploy InitialVoiceCreditProxy contract and save it to the storage
   *
   * @param args - deploy arguments for InitialVoiceCreditProxy
   * @returns deployed contract address
   */
  async deployInitialVoiceCreditProxy({
    amount,
  }: IDeployInitialVoiceCreditProxyArgs): Promise<string> {
    const address = this.storage.getAddress(
      EContracts.ConstantInitialVoiceCreditProxy,
      await this.getNetwork(),
    );
    if (address) return address;

    const contract = await this.deployment.deployContract(
      {
        name: EContracts.ConstantInitialVoiceCreditProxy,
        signer: this.deployer,
        abi: ConstantInitialVoiceCreditProxyFactory.abi,
        bytecode: ConstantInitialVoiceCreditProxyFactory.bytecode,
      },
      amount.toString(),
    );

    await this.register({
      id: EContracts.ConstantInitialVoiceCreditProxy,
      contract,
      args: [amount.toString()],
    });

    return contract.getAddress();
  }

  /**
   * Deploy EASGatekeeper contract and save it to the storage
   *
   * @param args - deploy arguments for EASGatekeeper
   * @returns deployed contract address
   */
  async deployGatekeeper({
    easAddress,
    encodedSchema,
    attester,
  }: IDeployGatekeeperArgs): Promise<string> {
    const address = this.storage.getAddress(
      EContracts.EASGatekeeper,
      await this.getNetwork(),
    );
    if (address) return address;

    const contract = await this.deployment.deployContract(
      {
        name: EContracts.EASGatekeeper,
        signer: this.deployer,
        abi: EASGatekeeperFactory.abi,
        bytecode: EASGatekeeperFactory.bytecode,
      },
      easAddress,
      attester,
      encodedSchema,
    );

    await this.register({
      id: EContracts.EASGatekeeper,
      contract,
      args: [easAddress, attester, encodedSchema],
    });

    return contract.getAddress();
  }

  /**
   * Deploy Verifier contract and save it to the storage
   *
   * @returns deployed contract address
   */
  async deployVerifier(): Promise<string> {
    const address = this.storage.getAddress(
      EContracts.Verifier,
      await this.getNetwork(),
    );
    if (address) return address;

    const contract = await this.deployment.deployContract({
      name: EContracts.Verifier,
      signer: this.deployer,
      abi: VerifierFactory.abi,
      bytecode: VerifierFactory.bytecode,
    });

    await this.register({
      id: EContracts.Verifier,
      contract,
    });

    return contract.getAddress();
  }

  /**
   * Deploy Poseidon contracts and save them to the storage
   *
   * @returns deployed contracts addresses
   */
  async deployPoseidon(): Promise<[string, string, string, string]> {
    const network = await this.getNetwork();

    const poseidonT3Address = this.storage.getAddress(
      EContracts.PoseidonT3,
      network,
    );
    const poseidonT4Address = this.storage.getAddress(
      EContracts.PoseidonT4,
      network,
    );
    const poseidonT5Address = this.storage.getAddress(
      EContracts.PoseidonT5,
      network,
    );
    const poseidonT6Address = this.storage.getAddress(
      EContracts.PoseidonT6,
      network,
    );

    if (
      poseidonT3Address &&
      poseidonT4Address &&
      poseidonT5Address &&
      poseidonT6Address
    ) {
      return [
        poseidonT3Address,
        poseidonT4Address,
        poseidonT5Address,
        poseidonT6Address,
      ];
    }

    const poseidonT3Contract = await this.deployment.deployContract({
      name: EContracts.PoseidonT3,
      signer: this.deployer,
      abi: PoseidonT3Factory.abi,
      bytecode: PoseidonT3Factory.bytecode,
    });

    const poseidonT4Contract = await this.deployment.deployContract({
      name: EContracts.PoseidonT4,
      signer: this.deployer,
      abi: PoseidonT4Factory.abi,
      bytecode: PoseidonT4Factory.bytecode,
    });

    const poseidonT5Contract = await this.deployment.deployContract({
      name: EContracts.PoseidonT5,
      signer: this.deployer,
      abi: PoseidonT5Factory.abi,
      bytecode: PoseidonT5Factory.bytecode,
    });

    const poseidonT6Contract = await this.deployment.deployContract({
      name: EContracts.PoseidonT6,
      signer: this.deployer,
      abi: PoseidonT6Factory.abi,
      bytecode: PoseidonT6Factory.bytecode,
    });

    await Promise.all([
      this.register({
        id: EContracts.PoseidonT3,
        contract: poseidonT3Contract,
      }),
      this.register({
        id: EContracts.PoseidonT4,
        contract: poseidonT4Contract,
      }),
      this.register({
        id: EContracts.PoseidonT5,
        contract: poseidonT5Contract,
      }),
      this.register({
        id: EContracts.PoseidonT6,
        contract: poseidonT6Contract,
      }),
    ]);

    const addresses = await Promise.all(
      [
        poseidonT3Contract,
        poseidonT4Contract,
        poseidonT5Contract,
        poseidonT6Contract,
      ].map((contract) => contract.getAddress()),
    );

    return addresses as [string, string, string, string];
  }

  /**
   * Deploy PollFactory contract and save it to the storage
   *
   * @returns deployed contract address
   */
  async deployPollFactory(): Promise<string> {
    const network = await this.getNetwork();
    
    const address = this.storage.getAddress(
      EContracts.PollFactory,
      network,
    );
    if (address) return address;

    const poseidonT3ContractAddress = this.storage.mustGetAddress(
      EContracts.PoseidonT3,
      network,
    );
    const poseidonT4ContractAddress = this.storage.mustGetAddress(
      EContracts.PoseidonT4,
      network,
    );
    const poseidonT5ContractAddress = this.storage.mustGetAddress(
      EContracts.PoseidonT5,
      network,
    );
    const poseidonT6ContractAddress = this.storage.mustGetAddress(
      EContracts.PoseidonT6,
      network,
    );

    const linkedPollFactoryContract =
      await this.deployment.createContractFactory(
        PollFactoryFactory.abi,
        PollFactoryFactory.linkBytecode(
          linkPoseidonLibraries(
            poseidonT3ContractAddress,
            poseidonT4ContractAddress,
            poseidonT5ContractAddress,
            poseidonT6ContractAddress,
          ),
        ),
        this.deployer,
      );
    const pollFactoryContract =
      await this.deployment.deployContractWithLinkedLibraries(
        linkedPollFactoryContract,
      );

    await this.register({
      id: EContracts.PollFactory,
      contract: pollFactoryContract,
    });

    return pollFactoryContract.getAddress();
  }

  /**
   * Deploy MessageProcessorFactory contract and save it to the storage
   *
   * @returns deployed contract address
   */
  async deployMessageProcessorFactory(): Promise<string> {
    const network = await this.getNetwork();

    const address = this.storage.getAddress(
      EContracts.MessageProcessorFactory,
      network,
    );
    if (address) return address;

    const poseidonT3ContractAddress = this.storage.mustGetAddress(
      EContracts.PoseidonT3,
      network,
    );
    const poseidonT4ContractAddress = this.storage.mustGetAddress(
      EContracts.PoseidonT4,
      network,
    );
    const poseidonT5ContractAddress = this.storage.mustGetAddress(
      EContracts.PoseidonT5,
      network,
    );
    const poseidonT6ContractAddress = this.storage.mustGetAddress(
      EContracts.PoseidonT6,
      network,
    );

    const linkedMessageProcessorFactoryContract =
      await this.deployment.createContractFactory(
        MessageProcessorFactoryFactory.abi,
        MessageProcessorFactoryFactory.linkBytecode(
          linkPoseidonLibraries(
            poseidonT3ContractAddress,
            poseidonT4ContractAddress,
            poseidonT5ContractAddress,
            poseidonT6ContractAddress,
          ),
        ),
        this.deployer,
      );

    const messageProcessorFactoryContract =
      await this.deployment.deployContractWithLinkedLibraries(
        linkedMessageProcessorFactoryContract,
      );

    await this.register({
      id: EContracts.MessageProcessorFactory,
      contract: messageProcessorFactoryContract,
    });

    return messageProcessorFactoryContract.getAddress();
  }

  /**
   * Deploy TallyFactory contract and save it to the storage
   *
   * @returns deployed contract address
   */
  async deployTallyFactory(): Promise<string> {
    const network = await this.getNetwork();
    
    const address = this.storage.getAddress(
      EContracts.TallyFactory,
      network,
    );
    if (address) return address;

    const poseidonT3ContractAddress = this.storage.mustGetAddress(
      EContracts.PoseidonT3,
      network,
    );
    const poseidonT4ContractAddress = this.storage.mustGetAddress(
      EContracts.PoseidonT4,
      network,
    );
    const poseidonT5ContractAddress = this.storage.mustGetAddress(
      EContracts.PoseidonT5,
      network,
    );
    const poseidonT6ContractAddress = this.storage.mustGetAddress(
      EContracts.PoseidonT6,
      network,
    );

    const linkedTallyFactoryContract =
      await this.deployment.createContractFactory(
        TallyFactoryFactory.abi,
        TallyFactoryFactory.linkBytecode(
          linkPoseidonLibraries(
            poseidonT3ContractAddress,
            poseidonT4ContractAddress,
            poseidonT5ContractAddress,
            poseidonT6ContractAddress,
          ),
        ),
        this.deployer,
      );

    const tallyFactoryContract =
      await this.deployment.deployContractWithLinkedLibraries(
        linkedTallyFactoryContract,
      );

    await this.register({
      id: EContracts.TallyFactory,
      contract: tallyFactoryContract,
    });

    return tallyFactoryContract.getAddress();
  }

  /**
   * Deploy MACI contract and save it to the storage
   *
   * @param args - deploy arguments for MACI
   * @returns deployed contract address
   */
  async deployMaci({ stateTreeDepth }: IDeployMaciArgs): Promise<string> {
    const network = await this.getNetwork();

    const address = this.storage.getAddress(
      EContracts.MACI,
      network,
    );
    if (address) return address;

    const poseidonT3ContractAddress = this.storage.mustGetAddress(
      EContracts.PoseidonT3,
      network,
    );
    const poseidonT4ContractAddress = this.storage.mustGetAddress(
      EContracts.PoseidonT4,
      network,
    );
    const poseidonT5ContractAddress = this.storage.mustGetAddress(
      EContracts.PoseidonT5,
      network,
    );
    const poseidonT6ContractAddress = this.storage.mustGetAddress(
      EContracts.PoseidonT6,
      network,
    );

    const constantInitialVoiceCreditProxyContractAddress =
      this.storage.mustGetAddress(
        EContracts.ConstantInitialVoiceCreditProxy,
        network,
      );

    const gatekeeperContractAddress = this.storage.mustGetAddress(
      EContracts.EASGatekeeper,
      network,
    );
    const topupCreditContractAddress = this.storage.mustGetAddress(
      EContracts.TopupCredit,
      network,
    );
    const pollFactoryContractAddress = this.storage.mustGetAddress(
      EContracts.PollFactory,
      network,
    );
    const messageProcessorFactoryContractAddress = this.storage.mustGetAddress(
      EContracts.MessageProcessorFactory,
      network,
    );
    const tallyFactoryContractAddress = this.storage.mustGetAddress(
      EContracts.TallyFactory,
      network,
    );

    const maciContractFactory = await this.deployment.createContractFactory(
      MACIFactory.abi,
      MACIFactory.linkBytecode(
        linkPoseidonLibraries(
          poseidonT3ContractAddress,
          poseidonT4ContractAddress,
          poseidonT5ContractAddress,
          poseidonT6ContractAddress,
        ),
      ),
      this.deployer,
    );

    const maciContract =
      await this.deployment.deployContractWithLinkedLibraries<MACI>(
        maciContractFactory,
        pollFactoryContractAddress,
        messageProcessorFactoryContractAddress,
        tallyFactoryContractAddress,
        gatekeeperContractAddress,
        constantInitialVoiceCreditProxyContractAddress,
        topupCreditContractAddress,
        stateTreeDepth,
      );

    const gatekeeperContract = await this.deployment.getContract<EASGatekeeper>(
      {
        name: EContracts.EASGatekeeper,
        address: gatekeeperContractAddress,
      },
    );
    const maciInstanceAddress = await maciContract.getAddress();

    await gatekeeperContract
      .setMaciInstance(maciInstanceAddress)
      .then((tx) => tx.wait());

    await this.register({
      id: EContracts.MACI,
      contract: maciContract,
      args: [
        pollFactoryContractAddress,
        messageProcessorFactoryContractAddress,
        tallyFactoryContractAddress,
        gatekeeperContractAddress,
        constantInitialVoiceCreditProxyContractAddress,
        topupCreditContractAddress,
        stateTreeDepth,
      ],
    });

    return maciInstanceAddress;
  }

  /**
   * Deploy VkRegistry contract and save it to the storage
   *
   * @param args - deploy arguments for VkRegistry
   * @returns deployed contract address
   */
  async deployVkRegistry({
    stateTreeDepth,
    intStateTreeDepth,
    messageTreeDepth,
    messageBatchDepth,
    voteOptionTreeDepth,
    processMessagesZkeyPathQv,
    processMessagesZkeyPathNonQv,
    tallyVotesZkeyPathQv,
    tallyVotesZkeyPathNonQv,
  }: IDeployVkRegistryArgs): Promise<string> {
    const address = this.storage.getAddress(
      EContracts.VkRegistry,
      await this.getNetwork(),
    );
    if (address) return address;

    const [qvProcessVk, qvTallyVk, nonQvProcessVk, nonQvTallyQv] = [
      processMessagesZkeyPathQv,
      tallyVotesZkeyPathQv,
      processMessagesZkeyPathNonQv,
      tallyVotesZkeyPathNonQv,
    ].map(
      (vk) =>
        VerifyingKey.fromObj(
          vk as IVkObjectParams,
        ).asContractParam() as IVerifyingKeyStruct,
    );

    const vkRegistryContract = await this.deployment.deployContract<VkRegistry>(
      {
        name: EContracts.VkRegistry,
        signer: this.deployer,
        abi: VkRegistryFactory.abi,
        bytecode: VkRegistryFactory.bytecode,
      },
    );

    const processZkeys = [qvProcessVk!, nonQvProcessVk!];
    const tallyZkeys = [qvTallyVk!, nonQvTallyQv!];
    const modes = [EMode.QV, EMode.NON_QV];

    await vkRegistryContract
      .setVerifyingKeysBatch(
        stateTreeDepth,
        intStateTreeDepth,
        messageTreeDepth,
        voteOptionTreeDepth,
        5 ** messageBatchDepth,
        modes,
        processZkeys,
        tallyZkeys,
      )
      .then((tx) => tx.wait());

    await this.register({
      id: EContracts.VkRegistry,
      contract: vkRegistryContract,
    });

    return vkRegistryContract.getAddress();
  }

  async registerExistingContract({ id, address, args }: IRegisterExistingContractArgs) {
    let abi
    switch(id) {
      case EContracts.InitialVoiceCreditProxy:
        abi = ConstantInitialVoiceCreditProxyFactory.abi;
        break;
      case EContracts.EASGatekeeper:
        abi = EASGatekeeperFactory.abi;
        break;
      case EContracts.Verifier:
        abi = VerifierFactory.abi;
        break;
      case EContracts.PoseidonT3:
        abi = PoseidonT3Factory.abi;
        break;
      case EContracts.PoseidonT4:
        abi = PoseidonT4Factory.abi;
        break;
      case EContracts.PoseidonT5:
        abi = PoseidonT5Factory.abi;
        break;
      case EContracts.PoseidonT6:
        abi = PoseidonT6Factory.abi;
        break;
      case EContracts.PollFactory:
        abi = PollFactoryFactory.abi;
        break;
      case EContracts.MessageProcessorFactory:
        abi = MessageProcessorFactoryFactory.abi;
        break;
      case EContracts.TallyFactory:
        abi = TallyFactoryFactory.abi;
        break;
      case EContracts.MACI:
        abi = MACIFactory.abi;
        break;
      case EContracts.VkRegistry:
        abi = VkRegistryFactory.abi;
        break;
      default:
        throw new Error("No such contract!");
    }

    const contract = new Contract(address, abi, this.deployer);
    await this.register({ id, contract, args });
  }

  /**
   * Register contracts to the ContractStorage
   *
   * @param args - arguments for contract registration
   */
  async register({ id, contract, args }: IRegisterArgs) {
    await this.storage.register({
      id,
      contract,
      args: args ?? [],
      network: await this.getNetwork(),
    });
  }

  /**
   * Get current signer's network name
   *
   * @returns network name
   */
  private async getNetwork(): Promise<string> {
    return this.deployer.provider!.getNetwork().then((network) => network.name);
  }
}
