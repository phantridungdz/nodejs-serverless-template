const express = require("express");
const { checkAuth } = require("../utils/middleware");
const { getHistoryData } = require("../controller/history");
const router = express.Router();

router.post("/", checkAuth, getHistoryData);

module.exports = router;
