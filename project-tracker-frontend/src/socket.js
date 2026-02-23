import { io } from "socket.io-client";

const socket = io("http://localhost:8000", {
  transports: ["websocket", "polling"],
});

socket.on("connect", () => {
  console.log("Connected:", socket.id);
});

socket.on("reply", (msg) => {
  console.log("Server says:", msg);
});

export default socket;