import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  Stack,
  Box,
} from "@mui/material";
import api from "../../services/api";
import { formatDistanceToNow } from "date-fns";

const ContributorActivityFeed = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await api.get("/api/v1/activity/all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const mapped = res.data.map((act) => {
  // Determine type for avatar
  let type = "update";
  if (act.action_type === "COMPLETED") type = "completed";
  else if (act.action_type === "ASSIGNED") type = "assigned";

  // Safely get initials from user_name
  const name = act.user_name || "NA"; // fallback
  const nameParts = name.split(" ");
  const initials =
    nameParts.length === 1
      ? nameParts[0][0]
      : nameParts[0][0] + nameParts[1][0];

  return {
    activity_id: act.id,
    action: type,
    text: `${name} ${act.message}`, // combine name + message
    created_at: act.created_at,
    initials: initials.toUpperCase(),
  };
});

      setActivities(mapped);
    } catch (err) {
      console.log("Activity fetch error:", err.response?.data || err);
    }
  };

  return (
    <Card
      sx={{
        borderRadius: 2,
        bgcolor: "background.paper",
        border: 1,
        borderColor: "divider",
        maxHeight: 420,
        overflowY: "auto",
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          sx={{ mb: 2 }}
          color="text.primary"
        >
          Recent Activity
        </Typography>

        <List disablePadding>
          {activities.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
              No activity yet.
            </Typography>
          ) : (
            activities.map((activity, index) => (
              <Box key={activity.activity_id}>
                <ListItem disableGutters sx={{ py: 1.2 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar
                      sx={{
                        bgcolor:
                          activity.action === "completed"
                            ? "success.main"
                            : "primary.main",
                        width: 28,
                        height: 28,
                        fontSize: 12,
                      }}
                    >
                      {activity.initials.toUpperCase()}
                    </Avatar>

                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          sx={{ fontSize: 13 }}
                          color="text.primary"
                        >
                          {activity.text}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {formatDistanceToNow(new Date(activity.created_at), {
                            addSuffix: true,
                          })}
                        </Typography>
                      }
                    />
                  </Stack>
                </ListItem>

                {index !== activities.length - 1 && (
                  <Divider sx={{ borderColor: "divider" }} />
                )}
              </Box>
            ))
          )}
        </List>
      </CardContent>
    </Card>
  );
};

export default ContributorActivityFeed;