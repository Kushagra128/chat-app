const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const app = express();
const socket = require("socket.io");
require("dotenv").config();
const path = require("path");

app.use(
	cors({
		origin: process.env.FRONTEND_URL || "http://localhost:3000",
		credentials: true,
	})
);
app.use(express.json());

mongoose
	.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("DB Connetion Successfull");
	})
	.catch((err) => {
		console.log(err.message);
	});

app.get("/ping", (_req, res) => {
	return res.json({ msg: "Ping Successful" });
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Catch-all route to serve index.html for any unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});


const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
	console.log(`Server started on ${PORT}`)
);
const io = socket(server, {
	cors: {
		origin: process.env.FRONTEND_URL || "http://localhost:3000",
		credentials: true,
	},
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
	global.chatSocket = socket;
	socket.on("add-user", (userId) => {
		onlineUsers.set(userId, socket.id);
	});

	socket.on("send-msg", (data) => {
		const sendUserSocket = onlineUsers.get(data.to);
		if (sendUserSocket) {
			socket.to(sendUserSocket).emit("msg-recieve", data.msg);
		}
	});
});