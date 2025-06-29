// In routes/user.js or wherever appropriate
const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate({
          path: "profile",
          populate: [{ path: "education" }, { path: "experience" }],
        });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
