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
  <>
    <Typography variant="h5" fontWeight={600} sx={{ mb: 4 }}>
      Teams
    </Typography>

    <Stack spacing={2.5}>
      {teams.map((team) => (
        <Card
          key={team.team_id}
          onClick={() =>
            navigate(`/department/${deptId}/team/${team.team_id}`)
          }
          sx={{
            cursor: "pointer",
            px: 3,
            py: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: "1px solid",
            borderColor: "divider",
            transition: "all 0.25s ease",

            "&:hover": {
              transform: "translateX(6px)",
              borderColor: "primary.main",
              boxShadow: 4,
            },
          }}
        >
          <Stack direction="row" spacing={2.5} alignItems="center">
            <Box
              sx={{
                bgcolor: "primary.main",
                borderRadius: "50%",
                width: 48,
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <GroupsIcon sx={{ color: "#0F1115" }} />
            </Box>

            <Box>
              <Typography variant="h6" fontWeight={600}>
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

          <Typography
            variant="body2"
            color="text.secondary"
          >
            View →
          </Typography>
        </Card>
      ))}

      {teams.length === 0 && (
        <Typography color="text.secondary">
          No teams found for this department
        </Typography>
      )}
    </Stack>
  </>
);

}

export default TeamList;
