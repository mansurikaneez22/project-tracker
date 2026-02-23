import React, { useContext } from "react";
import { IconButton, Badge } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { NotificationContext } from "../context/NotificationContext";

const NotificationIcon = () => {
  const { unreadCount } = useContext(NotificationContext);

  return (
    <IconButton color="inherit">
      <Badge badgeContent={unreadCount} color="error">
        <NotificationsIcon />
      </Badge>
    </IconButton>
  );
};

export default NotificationIcon;