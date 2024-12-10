const express = require("express");

const router = express.Router();

const exchanges = require("./exchanges");
const tokens = require("./tokens");
const metadata = require("./metadata");
const testnet = require("./testnet");

router.use("/exchanges", exchanges);
router.use("/tokens", tokens);
router.use("/metadata", metadata);
router.use("/testnet", testnet);

module.exports = router;
