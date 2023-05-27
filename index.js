import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { config } from "dotenv";
import connectDB from "./utils/database.js";
import ErrorMiddleware from "./middlewares/ErrorMiddleware.js";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/userRoute.js";
import conversationRoutes from "./routes/conversationRoute.js";
import messageRoutes from "./routes/messageRoute.js";
import { sendMessage } from "./controllers/messageController.js";
import { Conversation } from "./models/Conversation.js";

config();

connectDB();

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use("/api/v1", userRoutes);
app.use("/api/v1", conversationRoutes);
app.use("/api/v1", messageRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("join_room", (data) => {
    // console.log(data);
    socket.join(data);
  });

  socket.on("send_message", async (data) => {
    // console.log(data);

    // console.log(message);
    // socket.broadcast.emit("receive_message", data);
    socket.to(data.conversationId).emit("receive_message", data);
  });
});

app.use(ErrorMiddleware);

server.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});
