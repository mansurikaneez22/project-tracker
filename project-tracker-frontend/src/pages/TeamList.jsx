import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  Card,
  Typography,
  Stack,
  Box
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";

function TeamList() {
  const { deptId } = useParams();
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    api
      .get(`/api/v1/department/${deptId}/team`)
      .then((res) => setTeams(res.data))
      .catch((err) => {
        console.error("Error fetching teams", err);
      });
  }, [deptId]);

 return (
  <Box sx={{ mt: 5 }}>
    <Typography
      variant="h4"
      sx={{ mb: 4 }}
    >
      Teams
    </Typography>

    <Stack spacing={3}>
      {teams.map((team, index) => (
        <Card
          key={team.team_id}
          onClick={() =>
            navigate(`/department/${deptId}/team/${team.team_id}`)
          }
          sx={{
            cursor: "pointer",
            px: 3,
            py: 3,
            position: "relative",
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
            transition: "all 0.3s ease",

            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: 8,
            },

            /* LEFT ACCENT STRIP */
            "&::before": {
              content: '""',
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: "6px",
              backgroundColor: "primary.main",
              opacity: 0.7,
            },
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            {/* LEFT CONTENT */}
            <Stack direction="row" spacing={3} alignItems="center">
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: 3,
                  backgroundColor: "background.default",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <GroupsIcon color="primary" />
              </Box>

              <Box>
                <Typography variant="h6">
                  {team.team_name}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Team ID: {team.team_id}
                </Typography>
              </Box>
            </Stack>

            {/* RIGHT SIDE */}
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontWeight: 500,
              }}
            >
              Open →
            </Typography>
          </Stack>
        </Card>
      ))}

      {teams.length === 0 && (
        <Typography color="text.secondary">
          No teams found for this department.
        </Typography>
      )}
    </Stack>
  </Box>
);

}

export default TeamList;
