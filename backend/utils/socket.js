// socket.js
let ioInstance = null;

const initSocket = (server) => {
  const { Server } = require("socket.io");

  ioInstance = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  ioInstance.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    socket.on("send-msg", (data) => {
      const { sender, receiver, msg } = data;
      console.log("Received message: ", data);
      ioInstance.to(receiver).emit("chat message", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

const sendNotification = (userId, notificationData) => {
  if (ioInstance) {
    ioInstance.to(userId).emit("notify", notificationData);
  }
};

module.exports = {
  initSocket,
  sendNotification,
};
