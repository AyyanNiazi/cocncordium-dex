const mongoose = require("mongoose");

const { Schema } = mongoose;
const exchangeSchema = new Schema({
  exchanges: [
    {
      lpTokenId: {
        type: String,
        required: true,
      },
      lpTokensHolderBalance: {
        type: String,
        required: true,
      },
      lpTokensSupply: {
        type: String,
        required: true,
      },
      token: {
        address: {
          type: String,
          required: true,
        },
        id: String,
      },
    },
  ],
});

const Exchange = mongoose.model("exchange", exchangeSchema);
module.exports = Exchange;
