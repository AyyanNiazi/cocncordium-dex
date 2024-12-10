/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
const {
  SchemaVersion,
  createConcordiumClient,
  serializeUpdateContractParameters,
  deserializeReceiveReturnValue,
  deserializeReceiveError,
} = require("@concordium/node-sdk/lib");
const { credentials } = require("@grpc/grpc-js");
const fs = require("fs");

const getClient = async () =>
  createConcordiumClient(
    process.env.CONCORDIUM_NODE,
    process.env.CONCORDIUM_PORT,
    credentials.createInsecure(),
  );

const invokeContract = async (
  contract,
  method,
  params = null,
) => {
  const client = await getClient();
  const message = params
    ? serializeUpdateContractParameters(
        contract.contract_name,
        method,
        params,
        Buffer.from(fs.readFileSync(contract.schema_path)),
        SchemaVersion.V2,
      )
    : null;

  const result = await client.invokeContract(
    {
      contract: {
        index: BigInt(contract.index),
        subindex: BigInt(contract.subindex),
      },
      method: `${contract.contract_name}.${method}`,
      parameter: message,
      energy: 30000n,
    },
    (
      await client.getConsensusStatus()
    ).bestBlock,
  );

  try {
    if (result.tag === "success" && result.returnValue) {
      const returnValue = deserializeReceiveReturnValue(
        Buffer.from(result.returnValue, "hex"),
        Buffer.from(fs.readFileSync(contract.schema_path)),
        contract.contract_name,
        method,
      );

      return returnValue;
    }

    if (result.tag === "failure" && result.returnValue) {
      const returnValue = deserializeReceiveError(
        Buffer.from(result.returnValue, "hex"),
        Buffer.from(fs.readFileSync(contract.schema_path)),
        contract.contract_name,
        method,
      );
      console.error("\nFailure: ");
      console.dir(returnValue, { depth: null });

      return returnValue;
    }
  } catch (e) {
    console.error("\nError: ");
    console.error(e);
  }
};

module.exports = {
  invokeContract,
};
