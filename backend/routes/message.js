const express = require("express");
const router = express.Router();
const User = require("../models/User.js");

// Get all the messagers between user and receiver
router.get("/", async (req, res) => {
  const { sender_id, receiver_id } = req.query;

  try {
    const sender = await User.findById(sender_id).populate("profile");
    const receiver = await User.findById(receiver_id).populate("profile");

    if (!sender.profile || !receiver.profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    // Combine messages from both profiles
    const allMessages = [
      ...sender.profile.messages.filter(
        (msg) =>
          (msg.sender.toString() === sender_id && msg.receiver.toString() === receiver_id) ||
          (msg.sender.toString() === receiver_id && msg.receiver.toString() === sender_id)
      ),
    ];

    // Sort by date
    allMessages.sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json(allMessages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load messages" });
  }
});

// Returns all messages of a specific user.
router.get("/:id", async (req, res) => {
  const user_id = req.params.id;
  const user = await User.findById(user_id).populate("profile");
  res.send(user.profile.messages);
})


// Create a message between sender and receiver and saves it in the database for both users
router.post("/", async (req, res) => {
  try {
    const { sender_id, receiver_id, msg } = req.body;

    const sender = await User.findById(sender_id).populate("profile");
    const receiver = await User.findById(receiver_id).populate("profile");

   
    // Create message object
    const senderMessageObj = {
      sender: sender_id,
      receiver: receiver_id,
      msg,
      date: new Date(),
      read: true
    };

    const receiverMessageObj = {
      sender: sender_id,
      receiver: receiver_id,
      msg,
      date: new Date(),
      read: false
    };

    // Push message to both profiles
    sender.profile.messages.push(senderMessageObj);
    receiver.profile.messages.push(receiverMessageObj);

    await sender.profile.save();
    await receiver.profile.save();

    res.status(200).json({ success: true, message: "Message sent and saved." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Message could not be saved." });
  }
});

// Get all the connections of the user who have messaged user or have been messaged by the user
router.get("/connections/:userId", async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId).populate("profile");

  if (!user) {
    return res.status(404).json({ error: "User or profile not found" });
  }

  const messages = user.profile.messages || [];
  const connectionsMap = new Map();

  messages.forEach((msg) => {
    const senderId = msg.sender.toString();
    const receiverId = msg.receiver.toString();

    let otherUserId = null;

    if (senderId !== userId) otherUserId = senderId;
    if (receiverId !== userId) otherUserId = receiverId;

    if (!otherUserId) return;

    const isUnread = receiverId === userId && msg.read === false;

    if (!connectionsMap.has(otherUserId)) {
      connectionsMap.set(otherUserId, { unreadCount: 0 });
    }

    if (isUnread) {
      connectionsMap.get(otherUserId).unreadCount += 1;
    }
  });

  const connectionIds = Array.from(connectionsMap.keys());

  const users = await User.find({ _id: { $in: connectionIds } }).populate("profile");

  const result = users.map((u) => ({
    _id: u._id,
    username: u.username,
    unreadCount: connectionsMap.get(u._id.toString())?.unreadCount || 0,
  }));

  res.json(result);
});

// Marks a message as read
router.post("/readMsg", async (req, res) => {
  const { user_id, conn_id } = req.body;

  const user = await User.findById(user_id).populate("profile");

  let updated = false;
  for (let msg of user.profile.messages) {
    if (msg.sender.toString() === conn_id && !msg.read) {
      msg.read = true;
      updated = true;
    }
  }

  if (updated) {
    await user.profile.save();
  }

  res.send("Messages read successfully");
});


module.exports = router;
