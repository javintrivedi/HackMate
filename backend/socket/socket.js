import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import ChatModel from "../Modules/Chat.js";

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://hack-mate-ten.vercel.app"
      ],
      credentials: true
    }
  });

  // 🔐 SOCKET AUTH (JWT)
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) throw new Error("Token missing");

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      console.error("❌ Socket auth failed");
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.userId);

    // Join specific chat room
    socket.on("join-chat", (chatId) => {
      socket.join(chatId);
      console.log(`👥 User ${socket.userId} joined chat ${chatId}`);
    });

    // Send message
    socket.on("send-message", async ({ chatId, text }) => {
      try {
        if (!text || !chatId) return;

        const chat = await ChatModel.findById(chatId);

        if (!chat || chat.isLocked) {
          socket.emit("chat-locked");
          return;
        }

        // 🔒 Ensure sender is part of chat
        if (!chat.participants.map(id => id.toString()).includes(socket.userId)) {
          return;
        }

        // 🚫 Message limit check
        if (chat.messages.length >= chat.messageLimit) {
          chat.isLocked = true;
          await chat.save();
          io.to(chatId).emit("chat-locked");
          return;
        }

        // ✅ Save message
        const message = {
          sender: socket.userId,
          text
        };

        chat.messages.push(message);
        await chat.save();

        // 📡 Broadcast message
        io.to(chatId).emit("new-message", {
          sender: socket.userId,
          text,
          createdAt: new Date()
        });

      } catch (err) {
        console.error("❌ Socket message error:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.userId);
    });
  });
};