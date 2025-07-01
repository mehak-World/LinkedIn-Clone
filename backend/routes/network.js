const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const Profile = require("../models/Profile.js");
const { sendNotification } = require("../utils/socket.js");

// Get the user connections and pending requests
router.get("/:user_id", async (req, res) => {
  try {
    const user_id = req.params.user_id;

    const user = await User.findById(user_id).populate({
      path: "profile",
      populate: [{ path: "connections" }, { path: "pendingRequests" }],
    });

    res.status(200).json(user.profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Create a pending request by connection to user
router.post("/pending", async (req, res) => {
  try {
    const { user_id, connection_id } = req.body;
    let user = await User.findById(user_id).populate("profile");
    if (!user) return res.status(404).send("User not found");

    let connection = await User.findById(connection_id).populate("profile");
    if (!connection) return res.status(404).send("Connection user not found");

    if (user.profile.pendingRequests.includes(connection_id)) {
      res.status(400).send("Connection is already in the pending list");
    }

    user.profile.pendingRequests.push(connection_id);

    user.profile.notifications.push({
      from: connection_id,
      to: user_id,
      notifType: "pending",
      message: `You have a pending request from ${connection.username}`,
      read: false,
    });

    sendNotification(user_id, {
      message: `You have a pending request from ${connection.username}`,
      type: "connection",
      timestamp: new Date(),
    });

    await user.profile.save();
    res.status(200).send("Pending request added");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

// Accepting the connection request
router.post("/accept", async (req, res) => {
  const { user_id, connection_id } = req.body;

  const user = await User.findById(user_id).populate("profile");
  const connection = await User.findById(connection_id).populate("profile");

  if (!user || !connection) {
    return res.status(404).send("User or connection not found");
  }

  if (user.profile.connections.includes(connection_id)) {
    user.profile.notifications = user.profile.notifications.filter(
      (notif) =>
        notif.from.toString() != connection_id && notif.notifType != "pending"
    );
    user.profile.save();
    return res.status(404).send("You are already connected");
  }

  // Add connection and remove from pending list
  user.profile.connections.push(connection_id);
  user.profile.pendingRequests = user.profile.pendingRequests.filter(
    (pId) => pId != connection_id
  );

  user.profile.notifications = user.profile.notifications.filter(
    (notif) =>
      notif.from.toString() != connection_id && notif.notifType != "pending"
  );

  // Save the notification in the user and connection database.
  user.profile.notifications.push({
    from: connection_id,
    to: user_id,
    notifType: "accepted",
    message: `${connection.username} is now a connection.`,
    date: new Date(),
    read: false,
  });

  connection.profile.connections.push(user_id);
  connection.profile.notifications.push({
    from: user_id,
    to: connection_id,
    notifType: "accepted",
    message: `${user.username} accepted your friend request.`,
    date: new Date(),
    read: false,
  });

  // For real-time notification
  sendNotification(connection_id, {
    message: `${user.username} is now a connection.`,
    type: "connection",
    timestamp: new Date(),
  });

  sendNotification(user_id, {
    message: `${connection.username} is now a connection.`,
    type: "connection",
    timestamp: new Date(),
  });

  await user.profile.save();
  await connection.profile.save();

  res.status(200).send(user.profile);
});

// Delete a specific notification
router.post("/notif/delete", async (req, res) => {
  try {
    const { user_id, notif_id } = req.body;
    const user = await User.findById(user_id).populate("profile");
    user.profile.notifications = user.profile.notifications.filter(
      (notif) => notif._id.toString() != notif_id
    );
    await user.profile.save();
    res.status(200).send("Notification successfully deleted");
  } catch (err) {
    res.status(500).send("An error occured");
  }
});


// Ignore or reject a connection request
router.post("/reject", async (req, res) => {
  try {
    const { user_id, connection_id } = req.body;
    const user = await User.findById(user_id).populate("profile");
    user.profile.pendingRequests = user.profile.pendingRequests.filter(
      (pId) => pId != connection_id
    );
   
    // Find the id of the rejected notification
    let rejected_notif_id = null;
    for(let notif of user.profile.notifications){
      if(notif.from.toString() == connection_id && notif.notifType == "pending"){
          rejected_notif_id = notif._id;
      }
    }

    // Since user deleted the notification, remove it from user's notification
     user.profile.notifications = user.profile.notifications.filter(
      (notif) =>
        notif._id != rejected_notif_id  
      );


    await user.profile.save();
    res.status(200).send(user.profile);
  } catch (err) {
    res.status(500).send("An error occured");
  }
});

// Mark the notification as read
router.post("/readNotif", async (req, res) => {
  const { user_id } = req.body;
  const user = await User.findById(user_id).populate("profile");
  for (let notif of user.profile.notifications) {
    notif.read = true;
  }
  await user.profile.save();
  res.send("Read all notifications");
});
module.exports = router;
