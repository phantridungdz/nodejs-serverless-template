const express = require("express");
const { checkAuth } = require("../utils/middleware");
const moment = require("moment-timezone");
const { ObjectId } = require("mongodb");

const router = express.Router();

// User Sign-Up
router.post("/", checkAuth, async (req, res) => {
  const { candidates, name, numOfCandidate, numOfVote } = req.body;

  // Validate input
  if (!name) {
    return res.status(400).json({ message: "Election name is required!" });
  }

  if (!Array.isArray(candidates)) {
    return res
      .status(400)
      .json({ message: "Candidates must be a non-empty array!" });
  }

  try {
    const db = req.app.locals.db;
    const electionsCollection = db.collection("elections");

    // Save to database

    const newElection = {
      candidates,
      name,
      numOfCandidate,
      numOfVote,
      createdAt: moment().tz("Asia/Ho_Chi_Minh").toDate(),
    };
    await electionsCollection.insertOne(newElection);

    res.status(201).json({ message: "election created successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.put("/:id", checkAuth, async (req, res) => {
  const { id } = req.params;
  const { name, candidates, numOfCandidate, numOfVote } = req.body;

  // Validate input
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid election ID!" });
  }
  if (!name) {
    return res.status(400).json({ message: "Election name is required!" });
  }
  if (!Array.isArray(candidates) || candidates.length === 0) {
    return res
      .status(400)
      .json({ message: "Candidates must be a non-empty array!" });
  }

  try {
    const db = req.app.locals.db;
    const electionsCollection = db.collection("elections");

    // Find the election by ID
    const existingElection = await electionsCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!existingElection) {
      return res.status(404).json({ message: "Election not found!" });
    }

    // Update the election
    const updatedElection = {
      name,
      candidates,
      numOfCandidate,
      numOfVote,
      updatedAt: moment().tz("Asia/Ho_Chi_Minh").toDate(),
    };

    await electionsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedElection }
    );

    res.status(200).json({
      message: "Election updated successfully!",
      election: updatedElection,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.delete("/:id", checkAuth, async (req, res) => {
  const { id } = req.params;

  // Validate input
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid election ID!" });
  }

  try {
    const db = req.app.locals.db;
    const electionsCollection = db.collection("elections");

    // Find the election before deleting
    const existingElection = await electionsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!existingElection) {
      return res.status(404).json({ message: "Election not found!" });
    }

    // Delete the election
    await electionsCollection.deleteOne({ _id: new ObjectId(id) });

    res.status(200).json({ message: "Election deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/", checkAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const electionsCollection = db.collection("elections");

    // Get query parameters
    let { page, limit, sortBy, order, search } = req.query;

    // Default values
    page = parseInt(page) || 1; // Default page 1
    limit = parseInt(limit) || 10; // Default 10 items per page
    order = order === "desc" ? -1 : 1; // Default ascending order
    sortBy = sortBy || "createdAt"; // Default sorting field

    // Search filter
    let filter = {};
    if (search) {
      filter.name = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    // Get total count of elections
    const totalElections = await electionsCollection.countDocuments(filter);

    // Fetch elections with pagination
    const elections = await electionsCollection
      .find(filter)
      .sort({ [sortBy]: order })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    res.status(200).json({
      message: "Elections retrieved successfully!",
      totalElections,
      totalPages: Math.ceil(totalElections / limit),
      currentPage: page,
      data: elections,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
