import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const ContributorProjects = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);

      // Get current user from localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.user_id;

      if (!userId) {
        console.log("User ID not found");
        return;
      }

      const res = await api.get(`/api/v1/contributor/${userId}/projects`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Map backend response to consistent keys for frontend
      const formattedProjects = res.data.map((p) => ({
        project_id: p.project_id,
        project_name: p.project_title.trim(), // use project_name in frontend
        project_description: p.project_description,
        status: p.status,
        created_at: p.created_at,
      }));

      setProjects(formattedProjects);
      console.log("Formatted Projects:", formattedProjects);
    } catch (error) {
      console.log("Error fetching projects:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) =>
      project.project_name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [projects, search]);

  return (
    <Box sx={{ px: 6, py: 4 }}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        My Projects
      </Typography>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : filteredProjects.length === 0 ? (
        <Typography>No projects assigned yet.</Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredProjects.map((project) => (
            <Grid item xs={12} md={4} key={project.project_id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{project.project_name}</Typography>
                  <Typography variant="body2" mb={1}>
                    {project.project_description}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Status: {project.status}
                  </Typography>
                  <Box mt={2}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => navigate(`/project/${project.project_id}`)}
                    >
                      View
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ContributorProjects;