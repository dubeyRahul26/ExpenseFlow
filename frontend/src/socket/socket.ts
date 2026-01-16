import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (token: string): Socket => {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      auth: { token }
    });
  }

  return socket;
};

export const getSocket = (): Socket => {
  if (!socket) {
    throw new Error(
      "Socket not initialized. Call connectSocket() first."
    );
  }
  return socket;
};

export const disconnectSocket = (): void => {
  socket?.disconnect();
  socket = null;
};
