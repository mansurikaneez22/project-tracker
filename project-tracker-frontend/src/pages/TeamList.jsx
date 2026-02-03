import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";

function TeamList() {
  const { departmentId } = useParams();
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    api
      .get(`/api/v1/department/${departmentId}/team`)
      .then((res) => setTeams(res.data))
      .catch((err) => {
        console.error("Error fetching teams", err);
      });
  }, [departmentId]);

  return (
    <>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Teams
      </Typography>

      <Stack spacing={2}>
        {teams.map((team) => (
          <Card
            key={team.team_id}
            onClick={() =>
  navigate(
    `/department/${departmentId}/team/${team.team_id}`
  )
}

            sx={{
              borderRadius: 2,
              cursor: "pointer",
              transition: "0.3s",
              "&:hover": {
                boxShadow: 6,
                backgroundColor: "#F8FAFC"
              }
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    backgroundColor: "#E3F2FD",
                    borderRadius: "50%",
                    p: 1
                  }}
                >
                  <GroupsIcon color="primary" />
                </Box>

                <Box>
                  <Typography variant="h6">
                    {team.team_name}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Team ID: {team.team_id}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
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
