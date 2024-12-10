const { ARS_SWAP } = require("../config/constants");
const { getClient, invokeContract } = require("./helpers");
const { updateTokensMetadataInDb } = require("./utils");

const isObjectiveContract = (contract) => {
  const objectiveContract = {
    index: BigInt(ARS_SWAP.index),
    subindex: BigInt(ARS_SWAP.subindex),
  };

  if (
    contract.index === objectiveContract.index &&
    contract.subindex === objectiveContract.subindex
  ) {
    return true;
  }

  return false;
};

const isObjectiveEvent = (event, targetEvent) => {
  if (event === `${ARS_SWAP.contract_name}.${targetEvent}`) {
    return true;
  }

  return false;
};

const isAddLiquidityEvent = (event) => {
  const { type, transactionType, events } = event;

  if (
    type === "accountTransaction" &&
    transactionType === "update" &&
    isObjectiveContract(events[0].address) &&
    isObjectiveEvent(events[0].receiveName, "addLiquidity")
  ) {
    return true;
  }

  return false;
};

const getBlockTransactionDetails = async (client, hash) => {
  const transactionEvents = client.getBlockTransactionEvents(hash);
  for await (const transactionEvent of transactionEvents) {
    if (isAddLiquidityEvent(transactionEvent)) {
      await invokeContract(
        ARS_SWAP,
        "getExchanges",
        {
          holder: {
            Contract: [
              { index: +ARS_SWAP.index, subindex: +ARS_SWAP.subindex },
            ],
          },
        },
        false,
        true
      ).then(({ exchanges }) => {
        updateTokensMetadataInDb(exchanges, "Liquidity Event");
      });
    }
  }
};

const setBlocksStream = async () => {
  const client = await getClient();
  const blockStream = client.getBlocks();
  for await (const block of blockStream) {
    getBlockTransactionDetails(client, block.hash);
  }
};

module.exports = {
  setBlocksStream,
};
