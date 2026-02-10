import React from "react";
import { Card, CardContent, Typography, List, ListItem, ListItemText, Divider } from "@mui/material";

const activities = [
  { text: "Task 'Login UI' moved to In Progress", time: "2 min ago" },
  { text: "New task added to Project Alpha", time: "10 min ago" },
  { text: "Task 'API Integration' marked Done", time: "1 hr ago" },
];

const ActivityFeed = () => {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Activity Feed
        </Typography>

        <List>
          {activities.map((activity, index) => (
            <React.Fragment key={index}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={activity.text}
                  secondary={activity.time}
                />
              </ListItem>
              {index !== activities.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
