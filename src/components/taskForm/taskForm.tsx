import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Stack,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

interface TaskFormProps {
  initialTask?: string;
  initialPriority?: "low" | "medium" | "high";
  initialDueDate?: dayjs.Dayjs | null;
  onSubmit: (
    task: string,
    priority: "low" | "medium" | "high",
    dueDate: dayjs.Dayjs | null
  ) => void;
  onCancel: () => void;
  submitLabel: string;
}

const TaskForm: React.FC<TaskFormProps> = ({
  initialTask = "",
  initialPriority = "low",
  initialDueDate = null,
  onSubmit,
  onCancel,
  submitLabel,
}) => {
  const [task, setTask] = useState(initialTask);
  const [priority, setPriority] = useState<"low" | "medium" | "high">(
    initialPriority
  );
  const [dueDate, setDueDate] = useState<dayjs.Dayjs | null>(initialDueDate);

  const handleSubmit = () => {
    if (task.trim() !== "") {
      onSubmit(task, priority, dueDate);
      setTask("");
      setPriority("low");
      setDueDate(null);
    }
  };

  return (
    <Stack spacing={2} sx={{ marginTop: 2 }}>
      {/* DateTimePicker */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          label="Select Due Date and Time"
          value={dueDate}
          onChange={(newValue) => setDueDate(newValue)}
        />
      </LocalizationProvider>

      {/* Priority Selection */}
      <FormControl variant="standard" sx={{ width: "100px" }}>
        <InputLabel>Set Priority</InputLabel>
        <Select
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value as "low" | "medium" | "high")
          }
        >
          <MenuItem value="low">Low</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="high">High</MenuItem>
        </Select>
      </FormControl>

      {/* Task Input */}
      <TextField
        label="Enter Task"
        variant="standard"
        multiline
        minRows={1}
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />

      <Box display="flex" justifyContent="space-between">
        <Button onClick={handleSubmit} variant="contained">
          {submitLabel}
        </Button>
        <Button onClick={onCancel} variant="contained" color="error">
          Cancel
        </Button>
      </Box>
    </Stack>
  );
};

export default TaskForm;
