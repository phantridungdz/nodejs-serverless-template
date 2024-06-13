const { supabase } = require('./supabase');

const checkAuth = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({
      error: "No token provided",
    });
  }

  try {
    const { data, error } = await supabase().auth.getUser(token);
    if (error) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      error: "Unauthorized",
    });
  }
};

module.exports = { checkAuth };
