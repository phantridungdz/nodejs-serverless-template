const express = require("express");
const { checkAuth } = require("../utils/middleware");
const { getTargetUrlData, createTargetUrlData, updateTargetUrlData, deleteTargetUrlData } = require("../controller/targetUrl");
const router = express.Router();

router.post("/", checkAuth, getTargetUrlData);
router.post("/create", checkAuth, createTargetUrlData);
router.put("/", checkAuth, updateTargetUrlData);
router.delete("/", checkAuth, deleteTargetUrlData);

module.exports = router;
