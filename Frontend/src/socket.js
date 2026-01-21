import { io } from "socket.io-client";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : "https://hackmate-ybgv.onrender.com";

export const socket = io(API_URL, {
  autoConnect: false,
});