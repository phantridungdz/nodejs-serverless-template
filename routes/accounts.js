const express = require("express");
const { checkAuth } = require("../utils/middleware");
const { getAccountsData } = require("../controller/accounts");
const router = express.Router();

router.post("/", checkAuth, getAccountsData);

module.exports = router;
