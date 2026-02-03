import { useEffect, useState } from "react";
import axios from "axios";
import { List, ListItem, ListItemText } from "@mui/material";

function ProjectsList({ deptId, teamId, refresh, onProjectClick }) {
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    if (!teamId) return;

    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://127.0.0.1:8000/api/v1/project/department/${deptId}/team/${teamId}/project`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setProjects(res.data);
    } catch (err) {
      console.error("Failed to fetch projects", err.response?.data || err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [deptId, teamId, refresh]);

  return (
    <List>
      {projects.map((proj) => (
        <ListItem
          key={proj.project_id}
          button
          onClick={() =>
            onProjectClick({
              deptId,
              teamId,
              projectId: proj.project_id
            })
          }
        >
          <ListItemText
            primary={proj.project_title}
            secondary={proj.project_description}
          />
        </ListItem>
      ))}
    </List>
  );
}

export default ProjectsList;
