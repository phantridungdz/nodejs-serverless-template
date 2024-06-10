const { createClient } = require("@supabase/supabase-js");
const config = require("../config.json");

// Instantiate Supabase

const supabase = () => {
  const supabaseUrl = config.NEXT_PUBLIC_SUPABASE_URL ?? "";
    console.log("supabaseUrl", supabaseUrl);

  const supabaseKey = config.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  console.log("supabaseKey", supabaseKey);
  const supabase = createClient(supabaseUrl, supabaseKey);
  return supabase;
};

module.exports = { supabase };
