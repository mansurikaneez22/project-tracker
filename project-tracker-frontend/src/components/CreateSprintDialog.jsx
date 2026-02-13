import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useState } from "react";
import api from "../services/api";

const CreateSprintDialog = ({
  open,
  onClose,
  projectId,
  onCreated
}) => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const today = dayjs().startOf("day");

  const handleCreate = async () => {
    if (!name || !startDate || !endDate) return;

    try {
      await api.post(
        `/api/v1/project/${projectId}/sprints/`,
        {
          sprint_name: name,
          start_date: startDate.format("YYYY-MM-DD"),
          end_date: endDate.format("YYYY-MM-DD"),
        }
      );

      onCreated();
      onClose();
      setName("");
      setStartDate(null);
      setEndDate(null);
    } catch (err) {
      console.error("Create sprint error", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Create Sprint</DialogTitle>

      <DialogContent>
        <Stack spacing={3} mt={1}>
          <TextField
            label="Sprint Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />

          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => {
              setStartDate(newValue);
              if (endDate && newValue && endDate.isBefore(newValue)) {
                setEndDate(null);
              }
            }}
            disablePast
            minDate={today}
          />

          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            disablePast
            minDate={startDate || today}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleCreate}
          disabled={!name || !startDate || !endDate}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateSprintDialog;
