import { useState } from "react";
import {
  Box,
  List,
  ListItem,
  IconButton,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

import { useTask } from "../../context/TaskContext";
import TaskForm from "../taskForm/taskForm";

const TaskBox = () => {
  const { tasks, completedTasks, deleteTask, deleteAllTasks, updateTask } =
    useTask();
  const [openDialog, setOpenDialog] = useState<"all" | string | null>(null);
  const [editTask, setEditTask] = useState<any>(null);
  const [showCompleted, setShowCompleted] = useState(false);

  // Filter states
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string | null>(null);

  const getBorderColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "#05f50d";
      case "medium":
        return "#eef505";
      case "high":
        return "#f50505";
      default:
        return "#ccc";
    }
  };

  const getBackgroundColor = (priority: string, is_completed: boolean) => {
    if (is_completed) {
      return "#d3d3d3";
    }

    switch (priority) {
      case "low":
        return "#8ef5a9";
      case "medium":
        return "#f2f58e";
      case "high":
        return "#f58e8e";
      default:
        return "#ccc";
    }
  };

  const handleDeleteConfirm = () => {
    if (openDialog === "all") deleteAllTasks();
    else if (typeof openDialog === "string") deleteTask(openDialog);
    setOpenDialog(null);
  };

  const handleEditSubmit = (
    updatedTask: string,
    updatedPriority: "low" | "medium" | "high",
    updatedDueDate: any
  ) => {
    if (editTask) {
      updateTask(editTask.task_id, {
        task_description: updatedTask,
        task_priority: updatedPriority,
        datetime: updatedDueDate ? updatedDueDate.toISOString() : null,
      });
      setEditTask(null);
    }
  };

  // Filtered tasks based on priority and date
  const filteredTasks = (showCompleted ? completedTasks : tasks).filter(
    (task) => {
      if (!showCompleted && task.is_completed) return false;

      // Priority filter
      if (priorityFilter !== "all" && task.task_priority !== priorityFilter) {
        return false;
      }

      // Date filter
      if (dateFilter) {
        const taskDate = dayjs(task.datetime).format("YYYY-MM-DD");
        if (taskDate !== dateFilter) return false;
      }

      return true;
    }
  );

  return (
    <>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Button
          variant="contained"
          color={showCompleted ? "primary" : "secondary"}
          onClick={() => setShowCompleted((prev) => !prev)}
        >
          {showCompleted ? "Goto Active Tasks" : "Goto Completed Tasks"}
        </Button>

        {tasks.length > 0 && (
          <IconButton onClick={() => setOpenDialog("all")} color="error">
            <DeleteIcon />
          </IconButton>
        )}
      </Box>

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        {/* Priority Filter */}
        <Select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          displayEmpty
        >
          <MenuItem value="all">All Priorities</MenuItem>
          <MenuItem value="low">Low</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="high">High</MenuItem>
        </Select>

        {/* Date Filter */}
        <TextField
          type="date"
          value={dateFilter || ""}
          onChange={(e) => setDateFilter(e.target.value || null)}
        />
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog !== null} onClose={() => setOpenDialog(null)}>
        <DialogTitle>
          {openDialog === "all"
            ? "Delete All Tasks. This can't be undone."
            : "Delete Task. This can't be undone."}
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDialog(null)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={!!editTask} onClose={() => setEditTask(null)}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          {editTask && (
            <TaskForm
              initialTask={editTask.task_description}
              initialPriority={editTask.task_priority}
              initialDueDate={
                editTask.datetime ? dayjs(editTask.datetime) : null
              }
              onSubmit={handleEditSubmit}
              onCancel={() => setEditTask(null)}
              submitLabel="Update"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Task List */}
      <Box>
        <Typography variant="h6" sx={{ mb: 1 }}>
          {showCompleted ? "Completed Tasks" : "Active Tasks"}
        </Typography>

        <List sx={{ display: "flex", flexWrap: "wrap", gap: 1, padding: 0 }}>
          {filteredTasks.map((task) => (
            <ListItem
              key={task.task_id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 12px",
                border: `1px solid ${getBorderColor(task.task_priority)}`,
                borderRadius: "8px",
                alignItems: "center",
                maxWidth: "fit-content",
                backgroundColor: getBackgroundColor(
                  task.task_priority,
                  task.is_completed
                ),
                minWidth: "300px",
              }}
            >
              <IconButton
                onClick={() =>
                  updateTask(task.task_id, { is_completed: !task.is_completed })
                }
                color={task.is_completed ? "success" : "default"}
              >
                {task.is_completed ? (
                  <CheckCircleIcon sx={{ fontSize: "medium" }} />
                ) : (
                  <RadioButtonUncheckedIcon sx={{ fontSize: "medium" }} />
                )}
              </IconButton>

              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ paddingBottom: "4px" }}>
                  {dayjs(task.datetime)
                    .utc()
                    .local()
                    .format("Do, MMM YYYY [at] h:mm A")}
                </Typography>
                <Typography variant="body1">{task.task_description}</Typography>
              </Box>

              <Box>
                {!showCompleted && (
                  <IconButton onClick={() => setEditTask(task)} color="inherit">
                    <EditRoundedIcon sx={{ fontSize: "medium" }} />
                  </IconButton>
                )}
                <IconButton
                  edge="end"
                  onClick={() => setOpenDialog(task.task_id)}
                  color="error"
                >
                  <DeleteIcon sx={{ fontSize: "medium" }} />
                </IconButton>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  );
};

export default TaskBox;
