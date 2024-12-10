const { invokeContract } = require("./helpers");
const { updateTokensMetadataInDb, sendExchangesToDb } = require("./utils");

const setExchangesLoop = async (
  contract,
  method,
  params,
  cronOptions,
  verbose = false,
  silent = true
) => {
  setInterval(() => {
    invokeContract(contract, method, params, verbose, silent).then((data) => {
      sendExchangesToDb(data.exchanges);
      updateTokensMetadataInDb(data.exchanges, "Exchanges list every 1 hour");
    });
  }, Number(cronOptions));
};

module.exports = {
  setExchangesLoop,
};
