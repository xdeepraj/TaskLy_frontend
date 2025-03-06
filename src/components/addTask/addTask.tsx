import { useState } from "react";
import { Button, Stack } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import TaskForm from "../taskForm/taskForm";
import { useAuth } from "../../context/AuthContext";
import { useTask } from "../../context/TaskContext";

const AddTask = () => {
  const { userData: contextUserData } = useAuth();
  const { addTask } = useTask();

  const storedUserData = JSON.parse(localStorage.getItem("userData") || "{}");
  const userData = storedUserData.username ? storedUserData : contextUserData;

  const [showInput, setShowInput] = useState(false);

  const handleAddTask = (
    task: string,
    priority: "low" | "medium" | "high",
    dueDate: any
  ) => {
    addTask({
      task_description: task,
      task_priority: priority,
      datetime: dueDate ? dueDate.toISOString() : null,
      username: userData?.username,
      is_completed: false,
    });
    setShowInput(false);
  };

  const handleCancel = () => {
    setShowInput(false);
  };

  return (
    <Stack spacing={2}>
      {!showInput && (
        <Button
          onClick={() => setShowInput(true)}
          variant="contained"
          startIcon={<AddRoundedIcon />}
          sx={{ width: "auto", alignSelf: "flex-start" }}
        >
          Add a Task
        </Button>
      )}

      {showInput && (
        <TaskForm
          onSubmit={handleAddTask}
          onCancel={handleCancel}
          submitLabel="Add"
        />
      )}
    </Stack>
  );
};

export default AddTask;
