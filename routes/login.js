const express = require("express");
const { supabase } = require("../utils/supabase");
const router = express.Router();

router.post("/", async function (req, res) {
  const { email, password } = req.body;

  try {
    const db = supabase();
    const { data, error } = await db.auth.signInWithPassword({
      email: email,
      password: password,
    });
    console.log(data);
    if (error) {
      res.status(500).send(error.message);
    } else {
      res.status(200).json(data);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
