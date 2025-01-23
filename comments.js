// Create web server
// Create a new comment
// Delete a comment
// Get all comments
// Get a comment by ID
// Update a comment

// Import express
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Comment = require("../models/Comment");
const auth = require("../middleware/auth");

// @route POST api/comments
// @desc Create a new comment
// @access Private
router.post(
  "/",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Create a new comment
      const newComment = new Comment({
        text: req.body.text,
        user: req.user.id,
      });

      // Save the comment
      const comment = await newComment.save();
      res.json(comment);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

// @route DELETE api/comments/:id
// @desc Delete a comment
// @access Private
router.delete("/:id", auth, async (req, res) => {
  try {
    // Find the comment by ID
    let comment = await Comment.findById(req.params.id);

    // Check if the comment exists
    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    // Check if the user owns the comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    // Delete the comment
    await Comment.findByIdAndRemove(req.params.id);
    res.json({ msg: "Comment removed" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// @route GET api/comments
// @desc Get all comments
// @access Public
router.get("/", async (req, res) => {
  try {
    // Get all comments
    const comments = await Comment.find().sort({ date: -1 });
    res.json(comments);
  } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
      }
    });