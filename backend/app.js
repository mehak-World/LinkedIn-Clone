const express = require("express");
const http = require("http"); 
const cors = require("cors");
require("dotenv").config();
const userRouter = require("./routes/user");
const connect_db = require("./utils/db_setup");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/posts");
const profileRouter = require("./routes/profile");
const networkRouter = require("./routes/network.js");
const messageRouter = require("./routes/message.js");
const User = require("./models/User.js");
const Profile = require("./models/Profile.js"); 

const app = express();
const server = http.createServer(app); // Use HTTP server for socket.io

// DB connection
connect_db();


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  credentials: true
}));

// Routes
app.use("/auth", authRouter);
app.use("/posts", postRouter);
app.use("/profile", profileRouter);
app.use("/connections", networkRouter);
app.use("/messages", messageRouter)
app.use("/users", userRouter)

app.get("/search-users", async (req, res) => {
  const { query } = req.query;
  const users = await User.find({
    username: { $regex: query, $options: "i" },
  }).populate("profile").limit(5);
  res.json(users);
});


const { initSocket } = require("./utils/socket.js");
initSocket(server);

// Server start
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

