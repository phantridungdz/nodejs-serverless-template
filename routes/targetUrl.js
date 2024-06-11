const express = require("express");
const { checkAuth } = require("../utils/middleware");
const { getTargetUrlData } = require("../controller/targetUrl");
const router = express.Router();

router.post("/", checkAuth, getTargetUrlData);

module.exports = router;
