const { supabase } = require("../utils/supabase");
const moment = require("moment");
const limitPerRecord = 10;
const pagePerRecord = 0;

const getAccountsData = async (req, res) => {
  const filterValue = req.body;
  const db = supabase();
  console.log("filterValue", filterValue);

  let page = filterValue?.page || pagePerRecord;
  let limit = filterValue?.limit || limitPerRecord;

  let dataPromise = db
    .from("accounts")
    .select("*")
    .order("created_at", { ascending: false });
  let countPromise = db.from("accounts").select("count");
  if (filterValue?.licenseKey) {
    dataPromise = dataPromise.like(
      "license_key",
      `%${filterValue.licenseKey}%`
    );
    countPromise = countPromise.like(
      "license_key",
      `%${filterValue.licenseKey}%`
    );
  }

  if (filterValue?.searchByUserName) {
    dataPromise = dataPromise.like(
      "username",
      `%${filterValue.searchByAccount}%`
    );
    countPromise = countPromise.like(
      "username",
      `%${filterValue.searchByAccount}%`
    );
  }
  // to timezone 0

  if (filterValue?.startDate) {
    dataPromise = dataPromise.gte("created_at", filterValue.startDate);
    countPromise = countPromise.gte("created_at", filterValue.startDate);
  }
  if (filterValue?.endDate) {
    dataPromise = dataPromise.lte("created_at", filterValue.endDate);
    countPromise = countPromise.lte("created_at", filterValue.endDate);
  }
  
  const beginOfDay = moment(filterValue.startDate).startOf("day").toDate();
  let { data: account_count, error: account_count_err } = await db.rpc(
    "get_account_count_by_site",
    {
      p_key: filterValue?.licenseKey ?? null,
      p_date: filterValue?.startDate ? beginOfDay : null,
    }
  );
  console.log("account_count", account_count);
  const { data, error } = await dataPromise;
  const { data: count, error: countError } = await countPromise;
  console.log("count", count);

  if (error) {
    return res.status(500).send(error.message);
  }
  if (countError) {
    return res.status(500).send(countError.message);
  }
  if (account_count_err) {
    return res.status(500).send(account_count_err.message);
  }
  // console.log(data);
  return res.status(200).json({
    account_count: account_count,
    data,
    metaData: {
      total: count[0].count,
      page: page,
      limit: limit,
    },
  });
};

module.exports = { getAccountsData };
