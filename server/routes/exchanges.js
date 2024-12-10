const router = require("express").Router();
const {
  getExchanges,
  saveUserExchange,
  updateUserExchange,
} = require("../controllers/exchangesController");
const {
  transactionToWallet,
} = require("../controllers/transectionController");

router.get("/", getExchanges);
router.post("/setexchange", saveUserExchange);
router.post("/updateexchange", updateUserExchange);
router.post("/walletAmmount", transactionToWallet);

module.exports = router;
