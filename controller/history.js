const moment = require("moment");
const { supabase } = require("../utils/supabase");

const limitPerRecord = 10;
const pagePerRecord = 0;

const getHistoryData = async (req, res) => {
  const filterValue = req.body;
  const db = supabase();
  console.log("filterValue", filterValue);

  let page = filterValue?.page || pagePerRecord;
  let limit = filterValue?.limit || limitPerRecord;

  let dataPromise = db
    .from("history")
    .select("*")
    .order("created_at", { ascending: false });
  let countPromise = db.from("history").select("count");

  if (filterValue?.searchByAccount) {
    dataPromise = dataPromise.like(
      "account",
      `%${filterValue.searchByAccount}%`
    );
    countPromise = countPromise.like(
      "account",
      `%${filterValue.searchByAccount}%`
    );
  }
  if (filterValue?.startDate) {
    dataPromise = dataPromise.gte("created_at", filterValue.startDate);
    countPromise = countPromise.gte("created_at", filterValue.startDate);
  }
  if (filterValue?.endDate) {
    dataPromise = dataPromise.lte("created_at", filterValue.endDate);
    countPromise = countPromise.lte("created_at", filterValue.endDate);
  }
  if (filterValue?.page) {
  }

  const { data, error } = await dataPromise.range(
    page * limit,
    page * limit + limit - 1
  );
  const { data: count, error: countError } = await countPromise;
  console.log("count", count);
  if (error) {
    return res.status(500).send(error.message);
  }
  // console.log(data);
  return res.status(200).json({
    data,
    metaData: {
      total: count[0].count,
      page: page,
      limit: limit,
    },
  });
};

const getThisWeekData = async () => {
  const startDateThisWeek = moment().startOf("week").toDate();
  const endDateThisWeek = moment().endOf("week").toDate();
  //convert moment to Date
  const db = supabase();
  let dataPromise = db.rpc("get_range_history_money", {
    start_date: startDateThisWeek,
    end_date: endDateThisWeek,
  });

  const { data, error } = await dataPromise;
  console.log("data", data);
  console.log("error", error);
  return data;
};

const getLastWeekData = async () => {
  const startDateLastWeek = moment()
    .subtract(1, "week")
    .startOf("week")
    .toDate();
  const endDateLastWeek = moment().subtract(1, "week").endOf("week").toDate();
  //convert moment to Date
  const db = supabase();
  let dataPromise = db.rpc("get_range_history_money", {
    start_date: startDateLastWeek,
    end_date: endDateLastWeek,
  });

  const { data, error } = await dataPromise;
  console.log("data", data);
  console.log("error", error);
  return data;
};

const getThisMonthData = async () => {
  const startDateThisMonth = moment().startOf("month").toDate();
  const endDateThisMonth = moment().endOf("month").toDate();
  //convert moment to Date
  const db = supabase();
  let dataPromise = db.rpc("get_range_history_money", {
    start_date: startDateThisMonth,
    end_date: endDateThisMonth,
  });

  const { data, error } = await dataPromise;
  console.log("data", data);
  console.log("error", error);
  return data;
}

const getLastMonthData = async () => {
  const startDateLastMonth = moment().subtract(1, "month").startOf("month").toDate();
  const endDateLastMonth = moment().subtract(1, "month").endOf("month").toDate();
  //convert moment to Date
  const db = supabase();
  let dataPromise = db.rpc("get_range_history_money", {
    start_date: startDateLastMonth,
    end_date: endDateLastMonth,
  });

  const { data, error } = await dataPromise;
  console.log("data", data);
  console.log("error", error);
  return data;
}

const getWeekAnalytics = async (req, res) => {
  const thisWeekData = await getThisWeekData();
  const lastWeekData = await getLastWeekData();

  const percentage = ((thisWeekData - lastWeekData) / lastWeekData) * 100;
  console.log("percentage", percentage);
  return res.status(200).json({
    thisWeekData,
    lastWeekData,
    percentage,
  });
};

const getMonthAnalytics = async (req, res) => {
  const thisMonthData = await getThisMonthData();
  const lastMonthData = await getLastMonthData();

  const percentage = ((thisMonthData - lastMonthData) / lastMonthData) * 100;
  console.log("percentage", percentage);
  return res.status(200).json({
    thisMonthData,
    lastMonthData,
    percentage,
  });
};

module.exports = {
  getHistoryData,
  getWeekAnalytics,
  getMonthAnalytics
};
