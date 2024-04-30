/* eslint-disable @typescript-eslint/unbound-method */
import { ZeroAddress, type Signer } from "ethers";
import {
  linkPoseidonLibraries,
  ContractStorage,
  Deployment,
  EContracts,
  EMode,
  VerifyingKey,
  MessageProcessorFactoryFactory,
  PollFactoryFactory,
  TallyFactoryFactory,
  MACIFactory,
} from "maci-cli/sdk";
import { describe, expect, test, vi, beforeEach, type Mock } from "vitest";

import { STATE_TREE_SUB_DEPTH } from "../constants";
import { MaciService } from "..";

vi.mock("maci-cli/sdk", async () => {
  const mod = await vi.importActual("maci-cli/sdk");

  return {
    ...mod,
    Deployment: {
      getInstance: vi.fn(),
    },
    ContractStorage: {
      getInstance: vi.fn(),
    },
  };
});

describe("MaciService", () => {
  const mockDeployer = {
    provider: {
      getNetwork: vi.fn(() => Promise.resolve({ name: "localhost" })),
    },
  } as unknown as Signer;

  const mockContract = {
    getAddress: vi.fn(() => Promise.resolve(ZeroAddress)),
    stateAq: vi.fn(() => Promise.resolve(ZeroAddress)),
    setMaciInstance: vi.fn(() => Promise.resolve({ wait: vi.fn() })),
    setVerifyingKeysBatch: vi.fn(() => Promise.resolve({ wait: vi.fn() })),
  };

  const mockDeployment = {
    createContractFactory: vi.fn(() => Promise.resolve(mockContract)),
    deployContractWithLinkedLibraries: vi.fn(() =>
      Promise.resolve(mockContract),
    ),
    getDeployer: vi.fn(() => Promise.resolve(mockDeployer)),
    getContract: vi.fn(() => Promise.resolve(mockContract)),
    setHre: vi.fn(),
    deployContract: vi.fn(() => Promise.resolve(mockContract)),
  } as unknown as Deployment;

  const mockStorage = {
    register: vi.fn(),
    mustGetAddress: vi.fn(() => ZeroAddress),
  } as unknown as ContractStorage;

  beforeEach(() => {
    (Deployment.getInstance as Mock).mockReturnValue(mockDeployment);

    (ContractStorage.getInstance as Mock).mockReturnValue(mockStorage);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("should deploy initial voice credit proxy", async () => {
    const service = new MaciService(mockDeployer);

    const address = await service.deployInitialVoiceCreditProxy({ amount: 10 });

    expect(address).toBe(ZeroAddress);
    expect(mockDeployment.deployContract).toHaveBeenCalledTimes(1);
    expect(mockDeployment.deployContract).toHaveBeenCalledWith(
      {
        name: EContracts.ConstantInitialVoiceCreditProxy,
        signer: mockDeployer,
      },
      "10",
    );
    expect(mockStorage.register).toHaveBeenCalledTimes(1);
    expect(mockStorage.register).toHaveBeenCalledWith({
      id: EContracts.ConstantInitialVoiceCreditProxy,
      contract: mockContract,
      args: ["10"],
      network: "localhost",
    });
  });

  test("should deploy gatekeeper contract properly", async () => {
    const service = new MaciService(mockDeployer);

    const address = await service.deployGatekeeper({
      easAddress: ZeroAddress,
      encodedSchema: "1",
      attester: ZeroAddress,
    });

    expect(address).toBe(ZeroAddress);
    expect(mockDeployment.deployContract).toHaveBeenCalledTimes(1);
    expect(mockDeployment.deployContract).toHaveBeenCalledWith(
      { name: EContracts.EASGatekeeper, signer: mockDeployer },
      ZeroAddress,
      ZeroAddress,
      "1",
    );
    expect(mockStorage.register).toHaveBeenCalledTimes(1);
    expect(mockStorage.register).toHaveBeenCalledWith({
      id: EContracts.EASGatekeeper,
      contract: mockContract,
      args: [ZeroAddress, ZeroAddress, "1"],
      network: "localhost",
    });
  });

  test("should deploy verifier properly", async () => {
    const service = new MaciService(mockDeployer);

    const address = await service.deployVerifier();

    expect(address).toBe(ZeroAddress);
    expect(mockDeployment.deployContract).toHaveBeenCalledTimes(1);
    expect(mockDeployment.deployContract).toHaveBeenCalledWith({
      name: EContracts.Verifier,
      signer: mockDeployer,
    });
    expect(mockStorage.register).toHaveBeenCalledTimes(1);
    expect(mockStorage.register).toHaveBeenCalledWith({
      id: EContracts.Verifier,
      contract: mockContract,
      args: [],
      network: "localhost",
    });
  });

  test("should deploy topup credit properly", async () => {
    const service = new MaciService(mockDeployer);

    const address = await service.deployTopupCredit();

    expect(address).toBe(ZeroAddress);
    expect(mockDeployment.deployContract).toHaveBeenCalledTimes(1);
    expect(mockDeployment.deployContract).toHaveBeenCalledWith({
      name: EContracts.TopupCredit,
      signer: mockDeployer,
    });
    expect(mockStorage.register).toHaveBeenCalledTimes(1);
    expect(mockStorage.register).toHaveBeenCalledWith({
      id: EContracts.TopupCredit,
      contract: mockContract,
      args: [],
      network: "localhost",
    });
  });

  test("should deploy poseidon contracts properly", async () => {
    const service = new MaciService(mockDeployer);

    const addresses = await service.deployPoseidon();

    expect(addresses).toStrictEqual([
      ZeroAddress,
      ZeroAddress,
      ZeroAddress,
      ZeroAddress,
    ]);
    expect(mockDeployment.deployContract).toHaveBeenCalledTimes(4);
    expect(mockDeployment.deployContract).toHaveBeenNthCalledWith(1, {
      name: EContracts.PoseidonT3,
      signer: mockDeployer,
    });
    expect(mockDeployment.deployContract).toHaveBeenNthCalledWith(2, {
      name: EContracts.PoseidonT4,
      signer: mockDeployer,
    });
    expect(mockDeployment.deployContract).toHaveBeenNthCalledWith(3, {
      name: EContracts.PoseidonT5,
      signer: mockDeployer,
    });
    expect(mockDeployment.deployContract).toHaveBeenNthCalledWith(4, {
      name: EContracts.PoseidonT6,
      signer: mockDeployer,
    });
    expect(mockStorage.register).toHaveBeenCalledTimes(4);
    expect(mockStorage.register).toHaveBeenCalledWith({
      id: EContracts.PoseidonT3,
      contract: mockContract,
      args: [],
      network: "localhost",
    });
    expect(mockStorage.register).toHaveBeenCalledWith({
      id: EContracts.PoseidonT4,
      contract: mockContract,
      args: [],
      network: "localhost",
    });
    expect(mockStorage.register).toHaveBeenCalledWith({
      id: EContracts.PoseidonT5,
      contract: mockContract,
      args: [],
      network: "localhost",
    });
    expect(mockStorage.register).toHaveBeenCalledWith({
      id: EContracts.PoseidonT6,
      contract: mockContract,
      args: [],
      network: "localhost",
    });
  });

  test("should deploy poll factory properly", async () => {
    const service = new MaciService(mockDeployer);

    const address = await service.deployPollFactory();

    expect(address).toBe(ZeroAddress);
    expect(mockDeployment.createContractFactory).toHaveBeenCalledTimes(1);
    expect(mockDeployment.createContractFactory).toHaveBeenCalledWith(
      PollFactoryFactory.abi,
      PollFactoryFactory.linkBytecode(
        linkPoseidonLibraries(
          ZeroAddress,
          ZeroAddress,
          ZeroAddress,
          ZeroAddress,
        ),
      ),
      mockDeployer,
    );
    expect(
      mockDeployment.deployContractWithLinkedLibraries,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockDeployment.deployContractWithLinkedLibraries,
    ).toHaveBeenCalledWith(mockContract);

    expect(mockStorage.register).toHaveBeenCalledTimes(1);
    expect(mockStorage.register).toHaveBeenCalledWith({
      id: EContracts.PollFactory,
      contract: mockContract,
      args: [],
      network: "localhost",
    });
  });

  test("should deploy message processor factory properly", async () => {
    const service = new MaciService(mockDeployer);

    const address = await service.deployMessageProcessorFactory();

    expect(address).toBe(ZeroAddress);
    expect(mockDeployment.createContractFactory).toHaveBeenCalledTimes(1);
    expect(mockDeployment.createContractFactory).toHaveBeenCalledWith(
      MessageProcessorFactoryFactory.abi,
      MessageProcessorFactoryFactory.linkBytecode(
        linkPoseidonLibraries(
          ZeroAddress,
          ZeroAddress,
          ZeroAddress,
          ZeroAddress,
        ),
      ),
      mockDeployer,
    );
    expect(
      mockDeployment.deployContractWithLinkedLibraries,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockDeployment.deployContractWithLinkedLibraries,
    ).toHaveBeenCalledWith(mockContract);

    expect(mockStorage.register).toHaveBeenCalledTimes(1);
    expect(mockStorage.register).toHaveBeenCalledWith({
      id: EContracts.MessageProcessorFactory,
      contract: mockContract,
      args: [],
      network: "localhost",
    });
  });

  test("should deploy tally factory properly", async () => {
    const service = new MaciService(mockDeployer);

    const address = await service.deployTallyFactory();

    expect(address).toBe(ZeroAddress);
    expect(mockDeployment.createContractFactory).toHaveBeenCalledTimes(1);
    expect(mockDeployment.createContractFactory).toHaveBeenCalledWith(
      TallyFactoryFactory.abi,
      TallyFactoryFactory.linkBytecode(
        linkPoseidonLibraries(
          ZeroAddress,
          ZeroAddress,
          ZeroAddress,
          ZeroAddress,
        ),
      ),
      mockDeployer,
    );
    expect(
      mockDeployment.deployContractWithLinkedLibraries,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockDeployment.deployContractWithLinkedLibraries,
    ).toHaveBeenCalledWith(mockContract);

    expect(mockStorage.register).toHaveBeenCalledTimes(1);
    expect(mockStorage.register).toHaveBeenCalledWith({
      id: EContracts.TallyFactory,
      contract: mockContract,
      args: [],
      network: "localhost",
    });
  });

  test("should deploy maci properly", async () => {
    const service = new MaciService(mockDeployer);

    const address = await service.deployMaci({ stateTreeDepth: 10 });

    expect(address).toBe(ZeroAddress);
    expect(mockDeployment.createContractFactory).toHaveBeenCalledTimes(1);
    expect(mockDeployment.createContractFactory).toHaveBeenCalledWith(
      MACIFactory.abi,
      MACIFactory.linkBytecode(
        linkPoseidonLibraries(
          ZeroAddress,
          ZeroAddress,
          ZeroAddress,
          ZeroAddress,
        ),
      ),
      mockDeployer,
    );
    expect(
      mockDeployment.deployContractWithLinkedLibraries,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockDeployment.deployContractWithLinkedLibraries,
    ).toHaveBeenCalledWith(
      mockContract,
      ZeroAddress,
      ZeroAddress,
      ZeroAddress,
      ZeroAddress,
      ZeroAddress,
      ZeroAddress,
      10,
    );
    expect(mockContract.setMaciInstance).toHaveBeenCalledTimes(1);
    expect(mockContract.setMaciInstance).toHaveBeenCalledWith(ZeroAddress);
    expect(mockStorage.register).toHaveBeenCalledTimes(2);
    expect(mockStorage.register).toHaveBeenNthCalledWith(1, {
      id: EContracts.MACI,
      contract: mockContract,
      args: [
        ZeroAddress,
        ZeroAddress,
        ZeroAddress,
        ZeroAddress,
        ZeroAddress,
        ZeroAddress,
        10,
      ],
      network: "localhost",
    });
    expect(mockStorage.register).toHaveBeenNthCalledWith(2, {
      id: EContracts.AccQueueQuinaryBlankSl,
      name: "contracts/trees/AccQueueQuinaryBlankSl.sol:AccQueueQuinaryBlankSl",
      contract: mockContract,
      args: [STATE_TREE_SUB_DEPTH],
      network: "localhost",
    });
  });

  test("should deploy VK registry properly", async () => {
    const defaultZkey = {
      protocol: 0n,
      curve: 0n,
      nPublic: 0n,
      vk_alpha_1: [0n, 0n],
      vk_beta_2: [
        [0n, 0n],
        [0n, 0n],
      ],
      vk_gamma_2: [
        [0n, 0n],
        [0n, 0n],
      ],
      vk_delta_2: [
        [0n, 0n],
        [0n, 0n],
      ],
      vk_alphabeta_12: [],
      IC: [
        [0n, 0n],
        [0n, 0n],
      ],
    };
    const defaultArgs = {
      stateTreeDepth: 10,
      intStateTreeDepth: 1,
      messageTreeDepth: 2,
      messageBatchDepth: 1,
      voteOptionTreeDepth: 2,
      processMessagesZkeyPathQv: defaultZkey,
      processMessagesZkeyPathNonQv: defaultZkey,
      tallyVotesZkeyPathQv: defaultZkey,
      tallyVotesZkeyPathNonQv: defaultZkey,
    };
    const service = new MaciService(mockDeployer);

    const address = await service.deployVkRegistry(defaultArgs);

    expect(address).toBe(ZeroAddress);
    expect(mockDeployment.deployContract).toHaveBeenCalledTimes(1);
    expect(mockDeployment.deployContract).toHaveBeenCalledWith({
      name: EContracts.VkRegistry,
      signer: mockDeployer,
    });
    expect(mockStorage.register).toHaveBeenCalledTimes(1);
    expect(mockStorage.register).toHaveBeenCalledWith({
      id: EContracts.VkRegistry,
      contract: mockContract,
      args: [],
      network: "localhost",
    });
    expect(mockContract.setVerifyingKeysBatch).toHaveBeenCalledTimes(1);
    expect(mockContract.setVerifyingKeysBatch).toHaveBeenCalledWith(
      defaultArgs.stateTreeDepth,
      defaultArgs.intStateTreeDepth,
      defaultArgs.messageTreeDepth,
      defaultArgs.voteOptionTreeDepth,
      5 ** defaultArgs.messageBatchDepth,
      [EMode.QV, EMode.NON_QV],
      [
        defaultArgs.processMessagesZkeyPathQv,
        defaultArgs.processMessagesZkeyPathNonQv,
      ].map((vk) => VerifyingKey.fromObj(vk).asContractParam()),
      [
        defaultArgs.tallyVotesZkeyPathQv,
        defaultArgs.tallyVotesZkeyPathNonQv,
      ].map((vk) => VerifyingKey.fromObj(vk).asContractParam()),
    );
  });
});
