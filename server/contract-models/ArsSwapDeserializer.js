//import { deserializeReceiveReturnValue } from "@concordium/web-sdk";
const { deserializeReceiveReturnValue } = require("@concordium/node-sdk");
const { leb128 } = require("leb128");
const { ARS_CONTRACT_METHODS } = require("./config");
const { ARS_SWAP_CONTRACT_INFO } = require("../smartcontract/contractsInfo");
const { snakeToCamelCase } = require("../utils/common");
class ArsSwapDeserializer {
  constructor(buffer) {
    this.buffer = buffer;
  }

  readExchanges() {
    const deserializedValue = deserializeReceiveReturnValue(
      this.buffer,
      ARS_SWAP_CONTRACT_INFO.schemaBuffer,
      ARS_SWAP_CONTRACT_INFO.contractName,
      ARS_CONTRACT_METHODS.getExchanges
    );
    const exchanges = deserializedValue.exchanges;

    return exchanges?.map((exchangeData) =>
      Object.entries(exchangeData).reduce((acc, [key, value]) => {
        acc[snakeToCamelCase(key)] = value;

        return acc;
      }, {})
    );
  }

  readOperatorOf() {
    const deserializedValue = deserializeReceiveReturnValue(
      this.buffer,
      ARS_SWAP_CONTRACT_INFO.schemaBuffer,
      ARS_SWAP_CONTRACT_INFO.contractName,
      ARS_CONTRACT_METHODS.operatorOf
    );

    return deserializedValue[0];
  }

  readBalanceOf() {
    const slicedBuffer = this.buffer.slice(2);

    return leb128.unsigned.decode(slicedBuffer);
  }

  readTokenToCcdAmount() {
    const deserializedValue = deserializeReceiveReturnValue(
      this.buffer,
      ARS_SWAP_CONTRACT_INFO.schemaBuffer,
      ARS_SWAP_CONTRACT_INFO.contractName,
      ARS_CONTRACT_METHODS.tokenToCcdAmount
    );

    return deserializedValue.amount;
  }

  readCcdToTokenAmount() {
    const deserializedValue = deserializeReceiveReturnValue(
      this.buffer,
      ARS_SWAP_CONTRACT_INFO.schemaBuffer,
      ARS_SWAP_CONTRACT_INFO.contractName,
      ARS_CONTRACT_METHODS.ccdToTokenAmount
    );

    return deserializedValue.amount;
  }

  readTokenToTokenAmount() {
    const deserializedValue = deserializeReceiveReturnValue(
      this.buffer,
      ARS_SWAP_CONTRACT_INFO.schemaBuffer,
      ARS_SWAP_CONTRACT_INFO.contractName,
      ARS_CONTRACT_METHODS.tokenToTokenAmount
    );

    return deserializedValue.amount;
  }
}

module.exports = {
  ArsSwapDeserializer,
};
