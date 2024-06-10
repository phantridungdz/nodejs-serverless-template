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

module.exports = { getHistoryData };