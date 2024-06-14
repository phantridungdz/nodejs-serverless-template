const { supabase } = require("../utils/supabase");

const limitPerRecord = 10;
const pagePerRecord = 0;

//create yup schema
const yup = require("yup");
const licenseKeySchema = yup.object().shape({
  pc_name: yup.string().notRequired(),
  cpu: yup
    .object()
    .shape({
      manufacturer: yup.string().notRequired(),
      brand: yup.string().notRequired(),
      vendor: yup.string().notRequired(),
      family: yup.string().notRequired(),
      model: yup.string().notRequired(),
      stepping: yup.string().notRequired(),
      revision: yup.string().notRequired(),
      voltage: yup.string().notRequired(),
      speed: yup.number().notRequired(),
      speedMin: yup.number().notRequired(),
      speedMax: yup.number().notRequired(),
      governor: yup.string().notRequired(),
      cores: yup.number().notRequired(),
      physicalCores: yup.number().notRequired(),
      performanceCores: yup.number().notRequired(),
      efficiencyCores: yup.number().notRequired(),
      processors: yup.number().notRequired(),
      socket: yup.string().notRequired(),
      flags: yup.string().notRequired(),
      virtualization: yup.boolean().notRequired(),
      cache: yup
        .object()
        .shape({
          l1d: yup.number().notRequired(),
          l1i: yup.number().notRequired(),
          l2: yup.number().notRequired(),
          l3: yup.number().notRequired(),
        })
        .notRequired(),
    })
    .notRequired(),
  system: yup
    .object()
    .shape({
      manufacturer: yup.string().notRequired(),
      model: yup.string().notRequired(),
      version: yup.string().notRequired(),
      serial: yup.string().notRequired(),
      uuid: yup.string().notRequired(),
      sku: yup.string().notRequired(),
      virtual: yup.boolean().notRequired(),
    })
    .notRequired(),
  license_key: yup.string().notRequired(),
  username: yup.string().notRequired(),
  team: yup.string().notRequired(),
});

const getLicenseData = async (req, res) => {
  const filterValue = req.body;
  const db = supabase();
  console.log("filterValue", filterValue);

  let page = filterValue?.page || pagePerRecord;
  let limit = filterValue?.limit || limitPerRecord;

  let dataPromise = db
    .from("license-key")
    .select("*")
    .order("created_at", { ascending: false });
  let countPromise = db.from("license-key").select("count");

  if (filterValue?.searchByPcName) {
    dataPromise = dataPromise.like(
      "account",
      `%${filterValue.searchByPcName}%`
    );
    countPromise = countPromise.like(
      "account",
      `%${filterValue.searchByPcName}%`
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

const createLicenseData = async (req, res) => {
  const data = req.body;
  //validate data
  try {
    await licenseKeySchema.validate(data);
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: err.message,
    });
  }

  const db = supabase();
  const promise = db.from("license-key").insert(data).select("*");
  console.log("data", data);
  const { data: dataInsert, status, error, statusText } = await promise;
  if (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
  return res.status(200).json({
    status,
    statusText,
    dataInsert,
  });
};

const updateLicenseData = async (req, res) => {
  const data = req.body;
  const id = req.params.id;
  //validate data
  try {
    await licenseKeySchema.validate(data);
  } catch (err) {
    return res.status(400).send(err.message);
  }
  const db = supabase();
  const {
    data: updateData,
    error,
    status,
    statusText,
  } = await db.from("license-key").update(data).eq("id", id).select("*");
  if (error) {
    return res.status(500).send(error.message);
  }
  return res.status(200).json({ status, statusText, updateData });
};

const deleteLicenseData = async (req, res) => {
  const id = req.params.id;
  const db = supabase();
  const { data, error, status, statusText } = await db
    .from("license-key")
    .delete()
    .eq("id", id)
    .select("*");
  if (error) {
    return;
  }
  return res.status(200).json({ status, statusText, data });
};

module.exports = {
  getLicenseData,
  updateLicenseData,
  createLicenseData,
  deleteLicenseData,
};
