const express = require("express");
const { checkAuth } = require("../utils/middleware");
const {
  getHistoryData,
  getWeekAnalytics,
  getMonthAnalytics,
  getChartAndTotalMoneyByKeys,
  getMonthAnalyticsByKey,
  getWeekAnalyticsByKey,
  getWeekAnalyticsByTeam,
  getMonthAnalyticsByTeam,
  getChartMonthyMoneyByDate
} = require("../controller/history");
const router = express.Router();

router.post("/", checkAuth, getHistoryData);
router.get("/weekly-analysis", checkAuth, getWeekAnalytics);
router.get("/current-monthly-analysis", checkAuth, getMonthAnalytics);
router.get("/monthly-analysis", checkAuth, getChartMonthyMoneyByDate);
router.get("/weekly-analysis-key/:key", checkAuth, getWeekAnalyticsByKey);
router.get("/monthly-analysis-key/:key", checkAuth, getMonthAnalyticsByKey);
router.get("/money/:key", checkAuth, getChartAndTotalMoneyByKeys);
router.get("/current-weekly-analysis-team/:team", checkAuth, getWeekAnalyticsByTeam);
router.get("/current-monthly-analysis-team/:team", checkAuth, getMonthAnalyticsByTeam);

module.exports = router;
