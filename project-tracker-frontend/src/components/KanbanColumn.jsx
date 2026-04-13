import { Droppable } from "@hello-pangea/dnd";
import { Box } from "@mui/material";
import TaskCard from "./Taskcard";

const KanbanColumn = ({ status, tasks }) => {
  return (
    <Droppable droppableId={status}>
      {(provided, snapshot) => (
  <Box
    ref={provided.innerRef}
    {...provided.droppableProps}
    sx={(theme) => ({
      minHeight: "70vh",
      p: 2,
      borderRadius: 3,
      display: "flex",
      flexDirection: "column",
      gap: 1.5,

      //  Smart Theme Background
      backgroundColor:
        theme.palette.mode === "dark"
          ? "#0F172A"        
          : "#F8FAFC",         

      
      border: "1px solid",
      borderColor: theme.palette.divider,

      
      boxShadow:
        theme.palette.mode === "dark"
          ? "0 4px 12px rgba(0,0,0,0.25)"
          : "0 4px 12px rgba(0,0,0,0.05)",

      transition: "all 0.25s ease",

    
      "&:hover": {
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(255,255,255,0.05)"
            : "#E2E8F0",
      },

      //  Drag Highlight Effect
      ...(snapshot.isDraggingOver && {
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(25,118,210,0.12)"
            : "rgba(25,118,210,0.08)",
        borderColor: theme.palette.primary.main,
      }),
    })}
  >
    {tasks.map((task, index) => (
      <TaskCard
        key={task.task_id}
        task={task}
        index={index}
        draggable
      />
    ))}

    {provided.placeholder}
  </Box>
)}

    </Droppable>
  );
};

export default KanbanColumn;
