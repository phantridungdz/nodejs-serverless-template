const express = require("express");
const { checkAuth } = require("../utils/middleware");
const moment = require("moment-timezone");
const { ObjectId } = require("mongodb");

const router = express.Router();

// 📌 Create a new vote
router.post("/", checkAuth, async (req, res) => {
  const { selections, electionId } = req.body;

  if (!Array.isArray(selections) || selections.length === 0) {
    return res.status(400).json({ message: "Selections must be a non-empty array!" });
  }

  if (!electionId || !ObjectId.isValid(electionId.toString())) {
    return res.status(400).json({ message: "Invalid election ID!" });
  }

  try {
    const db = req.app.locals.db;
    const electionsCollection = db.collection("elections");
    const votesCollection = db.collection("votes");

    // Convert electionId to ObjectId
    const electionObjectId = new ObjectId(electionId.toString());

    // Check if the election exists
    const electionExists = await electionsCollection.findOne({ _id: electionObjectId });
    if (!electionExists) {
      return res.status(404).json({ message: "Election not found!" });
    }

    // Save to database
    const newVote = {
      selections,
      electionId: electionObjectId,
      createdAt: moment().tz("Asia/Ho_Chi_Minh").toDate(),
    };

    await votesCollection.insertOne(newVote);

    res.status(201).json({ message: "Vote created successfully!", vote: newVote });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// 📌 Update a vote
router.put("/:id", checkAuth, async (req, res) => {
  const { id } = req.params;
  const { selections } = req.body;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid vote ID!" });
  }

  if (!Array.isArray(selections) || selections.length === 0) {
    return res.status(400).json({ message: "Selections must be a non-empty array!" });
  }

  try {
    const db = req.app.locals.db;
    const votesCollection = db.collection("votes");

    const voteObjectId = new ObjectId(id);

    // Check if the vote exists
    const existingVote = await votesCollection.findOne({ _id: voteObjectId });
    if (!existingVote) {
      return res.status(404).json({ message: "Vote not found!" });
    }

    // Update vote
    const updatedVote = {
      selections,
      updatedAt: moment().tz("Asia/Ho_Chi_Minh").toDate(),
    };

    await votesCollection.updateOne({ _id: voteObjectId }, { $set: updatedVote });

    res.status(200).json({ message: "Vote updated successfully!", vote: updatedVote });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// 📌 Delete a vote
router.delete("/:id", checkAuth, async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid vote ID!" });
  }

  try {
    const db = req.app.locals.db;
    const votesCollection = db.collection("votes");

    const voteObjectId = new ObjectId(id);

    // Check if the vote exists
    const existingVote = await votesCollection.findOne({ _id: voteObjectId });
    if (!existingVote) {
      return res.status(404).json({ message: "Vote not found!" });
    }

    // Delete vote
    await votesCollection.deleteOne({ _id: voteObjectId });

    res.status(200).json({ message: "Vote deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
