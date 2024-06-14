const express = require("express");
const { checkAuth } = require("../utils/middleware");
const {
  getHistoryData,
  getWeekAnalytics,
  getMonthAnalytics,
  getChartAndTotalMoneyByKeys,
  getMonthAnalyticsByKey,
  getWeekAnalyticsByKey
} = require("../controller/history");
const router = express.Router();

router.post("/", checkAuth, getHistoryData);
router.get("/weekly-analysis", checkAuth, getWeekAnalytics);
router.get("/monthly-analysis", checkAuth, getMonthAnalytics);
router.get("/weekly-analysis-key/:key", checkAuth, getWeekAnalyticsByKey);
router.get("/monthly-analysis-key/:key", checkAuth, getMonthAnalyticsByKey);
router.get("/money/:key", checkAuth, getChartAndTotalMoneyByKeys);

module.exports = router;
