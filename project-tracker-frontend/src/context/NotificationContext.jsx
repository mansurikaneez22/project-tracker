import React, { createContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import api from "../services/api";

export const NotificationContext = createContext();

const socket = io("http://localhost:8000", {
  autoConnect: false,
  transports: ["websocket"]  // 🔥 important
});

export const NotificationProvider = ({ children, currentUser }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/api/v1/notification/");
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.is_read).length);
    } catch (err) {
      console.error("Fetch notification error", err);
    }
  };

  useEffect(() => {
    if (!currentUser?.user_id) return;

    console.log("CURRENT USER:", currentUser);

    socket.connect();

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
      socket.emit("join", String(currentUser.user_id));
    });

    socket.on("new_notification", (data) => {
  console.log("REAL TIME:", data);

  // 🔥 Short message for toast (future use)
  const shortMessage =
    data.message && data.message.length > 40
      ? data.message.slice(0, 40) + "..."
      : data.message;

  // Keep full message for dropdown (important)
  setNotifications(prev => [data, ...prev]);
  setUnreadCount(prev => prev + 1);

  // (Optional console to verify)
  console.log("SHORT:", shortMessage);
});

    fetchNotifications();

    return () => {
      socket.off("connect");
      socket.off("new_notification");
      socket.disconnect();
    };
  }, [currentUser?.user_id]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        setUnreadCount,
        fetchNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};