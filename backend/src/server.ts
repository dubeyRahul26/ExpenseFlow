import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import { setupChatSocket } from "./modules/chat/chat.socket";

const startServer = async () => {
  await connectDB();

  const httpServer = createServer(app);

  const io = new Server(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  setupChatSocket(io);

  httpServer.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
  });
};

startServer();
