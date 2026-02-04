import { Droppable } from "@hello-pangea/dnd";
import { Box } from "@mui/material";
import TaskCard from "./Taskcard";

const KanbanColumn = ({ status, tasks }) => {
  return (
    <Droppable droppableId={status}>
      {(provided) => (
        <Box
          ref={provided.innerRef}
          {...provided.droppableProps}
          sx={{
            minHeight: "70vh",
            backgroundColor: "#f4f5f7",
            p: 1,
            borderRadius: 2
          }}
        >
          {tasks.map((task, index) => (
            <TaskCard
              key={task.task_id}
              task={task}
              index={index}
            />
          ))}
          {provided.placeholder}
        </Box>
      )}
    </Droppable>
  );
};

export default KanbanColumn;
