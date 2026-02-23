import React, { useContext, useState } from "react";
import { Box, IconButton, Badge, Menu, MenuItem, Typography, Tooltip } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { NotificationContext } from "../context/NotificationContext";
import api from "../services/api";


const NotificationDropdown = () => {
  const { notifications, unreadCount, setUnreadCount } = useContext(NotificationContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  
  const markAsRead = async (notif) => {
  try {
    // If already read, do nothing
    if (notif.is_read) return;

    // Call your backend API
    await api.put(`/api/v1/notification/${notif.notification_id}/read`);

    // 🔥 Update UI instantly (no refresh needed)
    notif.is_read = true;
    setUnreadCount((prev) => Math.max(prev - 1, 0));

  } catch (error) {
    console.error("Mark as read error:", error);
  }
};
  return (
    <Box>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 350,
            width: "340px",
          },
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {notifications.length === 0 ? (
          <MenuItem>
            <Typography variant="body2" color="textSecondary">
              No notifications
            </Typography>
          </MenuItem>
        ) : (
          notifications.map((notif) => (
  <Tooltip key={notif.notification_id} title={notif.message} arrow>
    <MenuItem
      onClick={() => {
        markAsRead(notif);
        handleClose();
      }}
      sx={{
        alignItems: "flex-start",
        py: 1,
      }}
    >
      <Typography
        variant="body2"
        noWrap
        sx={{
          maxWidth: 260,
          fontWeight: notif.is_read ? 400 : 600,
        }}
      >
        {notif.message}
      </Typography>
    </MenuItem>
  </Tooltip>
))
        )}
      </Menu>
    </Box>
  );
};

export default NotificationDropdown;