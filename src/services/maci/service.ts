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
  TopupCredit__factory as TopupCreditFactory,
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
} from "./types";
import { type Signer, ethers } from "ethers";

/**
 * MACI service is responsible for deployment of MACI components like:
 * 1. VoiceCreditProxy
 * 2. Gatekeeper
 * 3. Verifier
 * 4. TopupCredit
 * 5. Poseidon contracts
 * 6. PollFactory
 * 7. MessageProcessorFactory
 * 8. TallyFactory
 * 9. MACI contract
 * 10. VkRegistry
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
    const contract = await this.deployment.deployContract(
      {
        name: EContracts.ConstantInitialVoiceCreditProxy,
        signer: this.deployer,
        abi: ConstantInitialVoiceCreditProxyFactory.abi,
        bytecode: ConstantInitialVoiceCreditProxyFactory.bytecode,
      },
      amount.toString(),
    );

    await this.storage.register({
      id: EContracts.ConstantInitialVoiceCreditProxy,
      contract,
      args: [amount.toString()],
      network: await this.getNetwork(),
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

    await this.storage.register({
      id: EContracts.EASGatekeeper,
      contract,
      args: [easAddress, attester, encodedSchema],
      network: await this.getNetwork(),
    });

    return contract.getAddress();
  }

  /**
   * Deploy Verifier contract and save it to the storage
   *
   * @returns deployed contract address
   */
  async deployVerifier(): Promise<string> {
    const contract = await this.deployment.deployContract({
      name: EContracts.Verifier,
      signer: this.deployer,
      abi: VerifierFactory.abi,
      bytecode: VerifierFactory.bytecode,
    });

    await this.storage.register({
      id: EContracts.Verifier,
      contract,
      args: [],
      network: await this.getNetwork(),
    });

    return contract.getAddress();
  }

  /**
   * Deploy TopupCredit contract and save it to the storage
   *
   * @returns deployed contract address
   */
  async deployTopupCredit(): Promise<string> {
    const contract = await this.deployment.deployContract({
      name: EContracts.TopupCredit,
      signer: this.deployer,
      abi: TopupCreditFactory.abi,
      bytecode: TopupCreditFactory.bytecode,
    });

    await this.storage.register({
      id: EContracts.TopupCredit,
      contract,
      args: [],
      network: await this.getNetwork(),
    });

    return contract.getAddress();
  }

  /**
   * Deploy Poseidon contracts and save them to the storage
   *
   * @returns deployed contracts addresses
   */
  async deployPoseidon(): Promise<[string, string, string, string]> {
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
      this.storage.register({
        id: EContracts.PoseidonT3,
        contract: poseidonT3Contract,
        args: [],
        network: await this.getNetwork(),
      }),
      this.storage.register({
        id: EContracts.PoseidonT4,
        contract: poseidonT4Contract,
        args: [],
        network: await this.getNetwork(),
      }),
      this.storage.register({
        id: EContracts.PoseidonT5,
        contract: poseidonT5Contract,
        args: [],
        network: await this.getNetwork(),
      }),
      this.storage.register({
        id: EContracts.PoseidonT6,
        contract: poseidonT6Contract,
        args: [],
        network: await this.getNetwork(),
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
    const poseidonT3ContractAddress = this.storage.mustGetAddress(
      EContracts.PoseidonT3,
      await this.getNetwork(),
    );
    const poseidonT4ContractAddress = this.storage.mustGetAddress(
      EContracts.PoseidonT4,
      await this.getNetwork(),
    );
    const poseidonT5ContractAddress = this.storage.mustGetAddress(
      EContracts.PoseidonT5,
      await this.getNetwork(),
    );
    const poseidonT6ContractAddress = this.storage.mustGetAddress(
      EContracts.PoseidonT6,
      await this.getNetwork(),
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

    await this.storage.register({
      id: EContracts.PollFactory,
      contract: pollFactoryContract,
      args: [],
      network: await this.getNetwork(),
    });

    return pollFactoryContract.getAddress();
  }

  /**
   * Deploy MessageProcessorFactory contract and save it to the storage
   *
   * @returns deployed contract address
   */
  async deployMessageProcessorFactory(): Promise<string> {
    const poseidonT3ContractAddress = this.storage.mustGetAddress(
      EContracts.PoseidonT3,
      await this.getNetwork(),
    );
    const poseidonT4ContractAddress = this.storage.mustGetAddress(
      EContracts.PoseidonT4,
      await this.getNetwork(),
    );
    const poseidonT5ContractAddress = this.storage.mustGetAddress(
      EContracts.PoseidonT5,
      await this.getNetwork(),
    );
    const poseidonT6ContractAddress = this.storage.mustGetAddress(
      EContracts.PoseidonT6,
      await this.getNetwork(),
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

    await this.storage.register({
      id: EContracts.MessageProcessorFactory,
      contract: messageProcessorFactoryContract,
      args: [],
      network: await this.getNetwork(),
    });

    return messageProcessorFactoryContract.getAddress();
  }

  /**
   * Deploy TallyFactory contract and save it to the storage
   *
   * @returns deployed contract address
   */
  async deployTallyFactory(): Promise<string> {
    const poseidonT3ContractAddress = this.storage.mustGetAddress(
      EContracts.PoseidonT3,
      await this.getNetwork(),
    );
    const poseidonT4ContractAddress = this.storage.mustGetAddress(
      EContracts.PoseidonT4,
      await this.getNetwork(),
    );
    const poseidonT5ContractAddress = this.storage.mustGetAddress(
      EContracts.PoseidonT5,
      await this.getNetwork(),
    );
    const poseidonT6ContractAddress = this.storage.mustGetAddress(
      EContracts.PoseidonT6,
      await this.getNetwork(),
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

    await this.storage.register({
      id: EContracts.TallyFactory,
      contract: tallyFactoryContract,
      args: [],
      network: await this.getNetwork(),
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
    const poseidonT3ContractAddress = this.storage.mustGetAddress(
      EContracts.PoseidonT3,
      await this.getNetwork(),
    );
    const poseidonT4ContractAddress = this.storage.mustGetAddress(
      EContracts.PoseidonT4,
      await this.getNetwork(),
    );
    const poseidonT5ContractAddress = this.storage.mustGetAddress(
      EContracts.PoseidonT5,
      await this.getNetwork(),
    );
    const poseidonT6ContractAddress = this.storage.mustGetAddress(
      EContracts.PoseidonT6,
      await this.getNetwork(),
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

    const constantInitialVoiceCreditProxyContractAddress =
      this.storage.mustGetAddress(
        EContracts.ConstantInitialVoiceCreditProxy,
        await this.getNetwork(),
      );

    const gatekeeperContractAddress = this.storage.mustGetAddress(
      EContracts.EASGatekeeper,
      await this.getNetwork(),
    );
    const topupCreditContractAddress = this.storage.mustGetAddress(
      EContracts.TopupCredit,
      await this.getNetwork(),
    );
    const pollFactoryContractAddress = this.storage.mustGetAddress(
      EContracts.PollFactory,
      await this.getNetwork(),
    );
    const messageProcessorFactoryContractAddress = this.storage.mustGetAddress(
      EContracts.MessageProcessorFactory,
      await this.getNetwork(),
    );
    const tallyFactoryContractAddress = this.storage.mustGetAddress(
      EContracts.TallyFactory,
      await this.getNetwork(),
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

    await this.storage.register({
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
      network: await this.getNetwork(),
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

    await this.storage.register({
      id: EContracts.VkRegistry,
      contract: vkRegistryContract,
      args: [],
      network: await this.getNetwork(),
    });

    return vkRegistryContract.getAddress();
  }

  /**
   * Register existing contracts to the ContractStorage
   *
   * @param args - arguments for contract registration
   */
  async register({ name, address, args }: IRegisterArgs) {
    // find relative abi for the contract name
    let abi
    switch (name) {
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
      case EContracts.VkRegistry:
        abi = VkRegistryFactory.abi;
        break;
      case EContracts.MACI:
        abi = MACIFactory.abi;
        break;
      case EContracts.ConstantInitialVoiceCreditProxy:
        abi = ConstantInitialVoiceCreditProxyFactory.abi;
        break;
      case EContracts.EASGatekeeper:
        abi = EASGatekeeperFactory.abi;
        break;
      case EContracts.Verifier:
        abi = VerifierFactory.abi;
        break;
      case EContracts.TopupCredit:
        abi = TopupCreditFactory.abi;
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
      default:
        console.log("No available abi founded.");
    }

    if (!abi) return;

    // generate contract instance
    const contract = new ethers.Contract(address, abi, this.deployer);

    // register contract to ContractStorage
    await this.storage.register({ 
      id: name,
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
