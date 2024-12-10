const router = require("express").Router();
const {
  getTokens,
  postToken,
  limit,
  getLimitOrders,
  compeleteLimitOrders,
  hello,
  getLimitOrdersbywallet,
  refundLimitOrder,
} = require("../controllers/tokensController");
const {
  transactionController,
  handleswap,
  createConcordiumClientfunc,
  transectiontokens,
} = require("../controllers/transectionController");

router.get("/list", getTokens);
router.post("/add", postToken);
router.post("/limit", limit);
router.get("/getlimitorders", getLimitOrders);
router.post("/getlimitordersbywallet", getLimitOrdersbywallet);
router.post("/compeletelimitorders", compeleteLimitOrders);
router.get("/transection", transactionController);
router.post("/swap", handleswap);
router.post("/tokenswap", transectiontokens);
router.get("/createConcordiumClient", createConcordiumClientfunc);
router.put("/refundLimitOrder/:id", refundLimitOrder);
router.get("/hello", hello);
module.exports = router;
