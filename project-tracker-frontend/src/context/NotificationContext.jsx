import React, { createContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import api from "../services/api";

export const NotificationContext = createContext();

// Socket ko ref me store karo taaki re-renders se recreate na ho
const socketRef = { current: null };

export const NotificationProvider = ({ children, currentUser }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      const res = await api.get("/api/v1/notification/");
      console.log("FETCH NOTIFICATIONS RESPONSE:", res.data);  // ✅ Check yaha
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.is_read).length);
    } catch (err) {
      console.error("Fetch notification error", err);
    }
  };

  useEffect(() => {
  if (!currentUser?.user_id) return;  // token optional
  if (!socketRef.current) {
    socketRef.current = io("http://localhost:8000", { transports: ["websocket"] });
  }
  const socket = socketRef.current;

  // ✅ Token optional check
  if(currentUser?.token) socket.io.opts.auth = { token: currentUser.token };

  socket.connect();

  socket.on("connect", () => {
    console.log("SOCKET CONNECTED", socket.id);
    socket.emit("join", String(currentUser.user_id));
  });

  socket.on("new_notification", (data) => {
    console.log("NEW NOTIFICATION RECEIVED", data);
    setNotifications(prev => [data, ...prev]);
    setUnreadCount(prev => prev + 1);
  });

  fetchNotifications();

  return () => {
    socket.off("connect");
    socket.off("new_notification");
    // socket.disconnect(); // optional
  };
}, [currentUser?.user_id, currentUser?.token]);

  return (
    <NotificationContext.Provider
      value={{
        currentUser,
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