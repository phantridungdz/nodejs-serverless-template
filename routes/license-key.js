const express = require("express");
const { checkAuth } = require("../utils/middleware");
const { getLicenseData, updateLicenseData, createLicenseData, deleteLicenseData } = require("../controller/license-key");
const router = express.Router();

router.post("/", checkAuth, getLicenseData);
router.put("/:id", checkAuth, updateLicenseData);
router.post("/create", checkAuth, createLicenseData);
router.delete("/:id", checkAuth, deleteLicenseData);

module.exports = router;
