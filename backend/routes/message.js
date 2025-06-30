const express = require("express");
const router = express.Router();
const User = require("../models/User.js");

// In your /routes/messages.js or similar
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

router.get("/:id", async (req, res) => {
  const user_id = req.params.id;
  const user = await User.findById(user_id).populate("profile");
  res.send(user.profile.messages);
})


router.post("/", async (req, res) => {
  try {
    const { sender_id, receiver_id, msg } = req.body;

    const sender = await User.findById(sender_id).populate("profile");
    const receiver = await User.findById(receiver_id).populate("profile");

    // Ensure sender has a profile
    if (!sender.profile) {
      const newProfile = new Profile();
      await newProfile.save();
      sender.profile = newProfile;
      await sender.save();
    }

    // Ensure receiver has a profile
    if (!receiver.profile) {
      const newProfile = new Profile();
      await newProfile.save();
      receiver.profile = newProfile;
      await receiver.save();
    }

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

router.get("/connections/:userId", async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId).populate("profile");

  if (!user) {
    return res.status(404).json({ error: "User or profile not found" });
  }

  if (!user.profile) {
    const newProfile = new Profile();
    await newProfile.save();
    user.profile = newProfile;
    await user.save();
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



// router.get("/connections/:userId", async (req, res) => {
//   const userId = req.params.userId;
//   const user = await User.findById(userId).populate("profile");
//   if (!user) {
//     return res.status(404).json({ error: "User or profile not found" });
//   }
//   if(!user.profile){
//     const newProfile = new Profile();
//     await newProfile.save();
//     user.profile = newProfile;
//     await user.save();
//   }

//   const messages = user.profile.messages || [];

//   // Extract unique receiver and sender IDs that are not self
//   const connectionsSet = new Set();

//   messages.forEach((msg) => {
//     const senderId = msg.sender.toString();
//     const receiverId = msg.receiver.toString();

//     if (senderId !== userId) connectionsSet.add(senderId);
//     if (receiverId !== userId) connectionsSet.add(receiverId);
//   });

//   const connectionIds = Array.from(connectionsSet);

//   const users = await User.find({ _id: { $in: connectionIds } }).populate("profile");

//   res.json(users);
// });

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
