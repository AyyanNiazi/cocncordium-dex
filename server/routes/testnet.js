const express = require("express");

const router = express.Router();
const formController = require("../controllers/testnetController");

router.post("/submit", formController.submitForm);
router.get("/user/:username", formController.getUserByUsername);

module.exports = router;
