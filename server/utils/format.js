const BigNumber = require("bignumber.js");

const getTokenRawAmount = (uiAmount, decimals = 6) =>
  BigNumber(uiAmount).multipliedBy(BigNumber(10).exponentiatedBy(decimals));

const toParamContractAddress = (contractAddress) => {
  return {
    index: parseInt(contractAddress.index.toString(), 10),
    subindex: parseInt(contractAddress.subindex.toString(), 10),
  };
};

const toBigIntContractAddress = (contractAddress) => {
  return {
    index: BigInt(contractAddress.index),
    subindex: BigInt(contractAddress.subindex),
  };
};

module.exports = {
  getTokenRawAmount,
  toParamContractAddress,
  toBigIntContractAddress,
};
