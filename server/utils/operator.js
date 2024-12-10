const {
  invokeContract,
  updateContract,
} = require("../contract-models/ConcordiumContractClient");
const { toBigIntContractAddress, toParamContractAddress } = require("./format");
const ArsSwapDeserializer = require("../contract-models/ArsSwapDeserializer");
const { SchemaType } = require("@concordium/node-sdk");
const ArsSwapJsonSchema = require("../smartcontract/ars_swap_schema.json");
const {
  CIS2_CONTRACT_METHODS,
  ARS_CONTRACT_METHODS,
} = require("../contract-models/config");
const { ARS_SWAP_CONTRACT_INFO } = require("../smartcontract/contractsInfo");
const { ARS_CONTRACT_ADDRESS } = require("../config/main");

/**
 *
 * @param provider Provider
 * @param {string} account
 * @param {Object} tokenAddress Token Address.
 * @param  {number}  tokenAddress.index    Token Address index
 * @param  {number}  tokenAddress.subindex    Token Address subindex
 * @param {Object} contractAddress Contract Address.
 * @param  {bigint}  contractAddress.index    Contract Address index
 * @param  {bigint}  contractAddress.subindex    Contract Address subindex
 * @param [contractName] Name of the Contract.
 */
const updateOperator = async ({
  provider,
  account,
  tokenAddress,
  contractAddress = ARS_CONTRACT_ADDRESS,
  contractName,
}) => {
  const contractInfo = {
    ...ARS_SWAP_CONTRACT_INFO,
    ...(contractName && { contractName }),
    serializationContractName: ARS_SWAP_CONTRACT_INFO.contractName,
    schemaWithContext: {
      type: SchemaType.Parameter,
      value: ArsSwapJsonSchema.entrypoints.updateOperator.parameter,
    },
  };

  const returnedValue = await invokeContract(
    provider,
    contractInfo,
    toBigIntContractAddress(tokenAddress),
    ARS_CONTRACT_METHODS.operatorOf,
    [
      {
        owner: {
          Account: [account],
        },
        address: {
          Contract: [toParamContractAddress(contractAddress)],
        },
      },
    ]
  );

  const isOperator = new ArsSwapDeserializer(returnedValue).readOperatorOf();

  if (isOperator) return;

  await updateContract(
    provider,
    contractInfo,
    [
      {
        operator: {
          Contract: [toParamContractAddress(contractAddress)],
        },
        update: { Add: [] },
      },
    ],
    account,
    toBigIntContractAddress(tokenAddress),
    CIS2_CONTRACT_METHODS.updateOperator
  );
};

module.exports = {
  updateOperator,
};
