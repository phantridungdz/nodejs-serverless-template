require("dotenv").config();
const express = require("express");
const { MongoClient } = require("mongodb");
const home = require("./routes/index");
const login = require("./routes/create-session-subscription");
const authRoutes = require("./routes/auth");

const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017";
const dbName = "mydatabase"; // Change this to your actual database name

const client = new MongoClient(mongoURI);

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");
    const db = client.db(dbName);
    app.locals.db = db; // Store the database instance for global access
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // Exit if the connection fails
  }
}

connectDB();

// Routes
app.use("/", home);
app.use("/api/create-session-subscription", login);
app.use("/api/auth", authRoutes);

// Server Connection
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));

process.on("SIGINT", async () => {
  console.log("🔄 Closing MongoDB connection...");
  await client.close();
  process.exit(0);
});
