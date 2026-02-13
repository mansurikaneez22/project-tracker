import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { useState, useEffect } from "react";

const AddToSprintDialog = ({
  open,
  onClose,
  sprints,
  task,
  onConfirm
}) => {
  const [selectedSprint, setSelectedSprint] = useState("");

  useEffect(() => {
    if (!open) {
      setSelectedSprint("");
    }
  }, [open]);

  const handleConfirm = () => {
    if (!selectedSprint) return;
    onConfirm(task.task_id, selectedSprint);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add Task to Sprint</DialogTitle>

      <DialogContent>
        <FormControl fullWidth size="small" sx={{ mt: 2 }}>
          <InputLabel>Select Sprint</InputLabel>
          <Select
            value={selectedSprint}
            label="Select Sprint"
            onChange={(e) =>
              setSelectedSprint(e.target.value)
            }
          >
            {sprints.map((sprint) => (
              <MenuItem
                key={sprint.sprint_id}
                value={sprint.sprint_id}
              >
                {sprint.sprint_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          disabled={!selectedSprint}
          onClick={handleConfirm}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddToSprintDialog;
