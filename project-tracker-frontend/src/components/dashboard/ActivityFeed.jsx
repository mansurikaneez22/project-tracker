import React, { useEffect, useState, useCallback } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Box,
  Avatar,
  Stack,
} from "@mui/material";
import api from "../../services/api";

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // =============================
  // Time Formatter (Safe Version)
  // =============================
  const formatTimeAgo = (dateString) => {
    if (!dateString) return "";

    const now = new Date();
    const activityTime = new Date(dateString);
    const diffInSeconds = Math.floor((now - activityTime) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hr ago`;

    return `${Math.floor(diffInSeconds / 86400)} day(s) ago`;
  };

  // =============================
  // Fetch Activities
  // =============================
  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/api/v1/activity/pm");

      setActivities(response.data || []);
    } catch (err) {
      console.error("Activity fetch error:", err);
      setError("Failed to load activity feed.");
    } finally {
      setLoading(false);
    }
  }, []);

  // =============================
  // Initial Load + Auto Refresh
  // =============================
  useEffect(() => {
    fetchActivities();

    const interval = setInterval(() => {
      fetchActivities();
    }, 15000); // refresh every 15 seconds

    return () => clearInterval(interval);
  }, [fetchActivities]);

  
  return (
  <Box
    sx={{
      backgroundColor: "background.paper",
      borderRadius: 4,
      p: 4,
      border: "1px solid",
      borderColor: "divider",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      transition: "all 0.25s ease",

      "&:hover": {
        transform: "translateY(-6px)",
        borderColor: "primary.main",
        boxShadow: (theme) =>
          theme.palette.mode === "dark"
            ? "0 15px 40px rgba(96,165,250,0.25)"
            : "0 12px 30px rgba(0,0,0,0.08)",
      },
    }}
  >
    {/* Header */}
    <Box mb={3}>
      <Typography variant="h6" fontWeight={600}>
        Recent Activity
      </Typography>
    </Box>

    {/* Content Area (Scrollable) */}
    <Box sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
      {loading && (
        <Box display="flex" justifyContent="center" py={3}>
          <CircularProgress size={28} />
        </Box>
      )}

      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}

      {!loading && !error && activities.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          No recent activity available.
        </Typography>
      )}

      <List sx={{ p: 0 }}>
        {activities.slice(0, 6).map((activity, index) => (
          <React.Fragment key={activity.id}>
            <ListItem alignItems="flex-start" sx={{ px: 0 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ width: 36, height: 36 }}>
                  {activity.user_name
                    ? activity.user_name.charAt(0).toUpperCase()
                    : "U"}
                </Avatar>

                <ListItemText
                  primary={
                    <Typography variant="body2">
                      <strong>
                        {activity.user_name || "User"}
                      </strong>{" "}
                      {activity.message}
                      {activity.project_name && (
                        <Typography
                          component="span"
                          variant="caption"
                          sx={{
                            ml: 1,
                            color: "primary.main",
                            fontWeight: 500,
                          }}
                        >
                          • {activity.project_name}
                        </Typography>
                      )}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {formatTimeAgo(activity.created_at)}
                    </Typography>
                  }
                />
              </Stack>
            </ListItem>

            {index !== Math.min(activities.length, 6) - 1 && (
              <Divider sx={{ my: 1 }} />
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  </Box>
);
};

export default ActivityFeed;