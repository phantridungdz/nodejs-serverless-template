const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

// User Sign-Up
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    const db = req.app.locals.db;
    const usersCollection = db.collection("users");

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to database
    const newUser = { username, email, password: hashedPassword };
    await usersCollection.insertOne(newUser);

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// User Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    const db = req.app.locals.db;
    const usersCollection = db.collection("users");

    // Check if user exists
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password!" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password!" });
    }

    // Remove password before sending response
    delete user.password;

    // Token Expiry Configuration
    const expiresIn = "3h"; // 1 hour expiration time
    const expiresAt = Math.floor(Date.now() / 1000) + 3600; // Current time + 1 hour

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, exp: expiresAt }, process.env.JWT_SECRET, { expiresIn });

    return res.status(200).json({
      message: "Login successful!",
      data: {
        ...user,
        token,
        expiresAt, // Include expiry timestamp
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

router.get("/user", checkAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const usersCollection = db.collection("users");

    // Get the user ID from the authenticated request
    const userId = req.user._id;

    // Find user in MongoDB
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Remove password from response
    delete user.password;

    res.status(200).json({ message: "User retrieved successfully!", data: user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
