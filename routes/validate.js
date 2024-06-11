const express = require("express");
const { supabase } = require("../utils/supabase");

const router = express.Router();

router.get("/", async function (req, res) {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({
      error: "No token provided",
    });
  }

  try {
    const { data, error } = await supabase().auth.getUser(token);
    console.log("data", data);
    console.log("error", error);
    if (error?.status === 403) {
      return res.status(401).json({
        error: "Token Expired",
      });
    }
    if (error) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }
    return res.status(200).json(data)
  } catch (error) {
    console.log(error);
    if (error.status === 403) {
      return res.status(401).json({
        error: "Token Expired",
      });
    }
    return res.status(401).json({
      error: "Unauthorized",
    });
  }
});

module.exports = router;
