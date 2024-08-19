// Import packages
require("dotenv").config();
const express = require("express");
const home = require("./routes/index");
const login = require("./routes/create-session-subscription");
var cors = require("cors");

// Middlewares
const app = express();
app.use(cors());
app.use(express.json());
// Routes
app.use("/", home);
app.use("/api/create-session-subscription", login);
// connection
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening to port ${port}`));
