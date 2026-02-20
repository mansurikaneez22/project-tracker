import React from "react";
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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AssignmentIcon from "@mui/icons-material/Assignment";

const activities = [
  {
    text: "You moved 'Login UI' to In Progress",
    time: "2 min ago",
    type: "update",
  },
  {
    text: "You were assigned 'Dashboard API'",
    time: "10 min ago",
    type: "assigned",
  },
  {
    text: "You completed 'API Integration'",
    time: "1 hr ago",
    type: "completed",
  },
];

const ContributorActivityFeed = () => {
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
          {activities.map((activity, index) => (
            <Box key={index}>
              <ListItem disableGutters sx={{ py: 1.2 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  
                  <Avatar
                    sx={{
                      bgcolor:
                        activity.type === "completed"
                          ? "success.main"
                          : "primary.main",
                      width: 28,
                      height: 28,
                    }}
                  >
                    {activity.type === "completed" ? (
                      <CheckCircleIcon sx={{ fontSize: 16 }} />
                    ) : (
                      <AssignmentIcon sx={{ fontSize: 16 }} />
                    )}
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
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {activity.time}
                      </Typography>
                    }
                  />
                </Stack>
              </ListItem>

              {index !== activities.length - 1 && (
                <Divider sx={{ borderColor: "divider" }} />
              )}
            </Box>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};


export default ContributorActivityFeed;
