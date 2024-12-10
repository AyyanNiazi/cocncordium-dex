const ARS_SWAP = {
  name: "Ars Swap",
  index: process.env.SMARTCONTRACT_INDEX,
  subindex: process.env.SMARTCONTRACT_SUBINDEX,
  contract_name: process.env.SMARTCONTRACT_NAME,
  schema_path: "./schemas/schema-ars-swap.bin",
};

module.exports = {
  ARS_SWAP,
};
