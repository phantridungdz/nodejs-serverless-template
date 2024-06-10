// Import packages
require("dotenv").config();
const express = require("express");
const home = require("./routes/index");
const login = require("./routes/login");
const accounts = require("./routes/accounts");
const history = require("./routes/history");
const licenseKey = require("./routes/license-key");
const validate = require("./routes/validate");

// Middlewares
const app = express();
app.use(express.json());

// Routes
app.use("/", home);
app.use("/api/login", login);
app.use("/api/validate", validate);
// app.use("/api/accounts", accounts);
app.use("/api/history", history);
// app.use("/api/license-key", licenseKey);

// connection
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening to port ${port}`));
