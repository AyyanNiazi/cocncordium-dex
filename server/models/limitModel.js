const mongoose = require("mongoose");

const { Schema } = mongoose;

const LimitModel = mongoose.model(
  "LimitOrders",
  new Schema({
    tokenfromvalue: Number,
    tokentovalue: Number,
    tokenfromName: String,
    tokentoName: String,
    price: Number,
    tokenToindex: Schema.Types.Mixed,
    tokenFromindex: Schema.Types.Mixed,
    expiry: Schema.Types.Mixed,
    tokenFromid: Schema.Types.Mixed,
    tokenToid: Schema.Types.Mixed,
    address: Schema.Types.Mixed,
    paid: Schema.Types.Mixed,
    refund: Boolean,
  })
);

module.exports = LimitModel;
