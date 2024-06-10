const express = require("express");
const { checkAuth } = require("../utils/middleware");
const { getLicenseData } = require("../controller/license-key");
const router = express.Router();

router.post("/", checkAuth, getLicenseData);

module.exports = router;
