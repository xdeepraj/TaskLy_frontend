import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { v4 as uuidv4 } from "uuid";
import API_BASE_URL from "../config";

import { useAuth } from "../context/AuthContext";

interface Task {
  task_id: string;
  task_description: string;
  task_priority: "low" | "medium" | "high";
  datetime: any;
  is_completed: boolean;
}

interface TaskContextType {
  tasks: Task[];
  completedTasks: Task[];
  addTask: (task: {
    task_description: string;
    task_priority: "low" | "medium" | "high";
    username: string | undefined;
    datetime: any;
    is_completed: boolean;
  }) => void;
  deleteTask: (task_id: string) => void;
  deleteAllTasks: () => void;
  updateTask: (task_id: string, updatedTask: Partial<Task>) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const { userData: contextUserData, accessToken, setAccessToken } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);

  const completedTasks = tasks.filter((task) => task.is_completed);

  const storedUserData = JSON.parse(localStorage.getItem("userData") || "{}");
  const username = storedUserData.username
    ? storedUserData.username
    : contextUserData?.username;

  // Function to fetch tasks for the user from the database
  const fetchTasksFromDB = async (username: string | undefined) => {
    if (!username) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/getTasks?username=${username}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();

      if (Array.isArray(data.tasks)) {
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error("Failed to fetch tasks from database:", error);
    }
  };

  // Fetch tasks when the username is changed
  useEffect(() => {
    fetchTasksFromDB(username);
  }, [username]);

  // Store new task in db
  const addTaskToDB = async (task: Task) => {
    try {
      let response = await fetch(`${API_BASE_URL}/addTask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(task),
      });

      const newAccessToken = response.headers.get("x-new-access-token");

      if (newAccessToken) {
        setAccessToken(newAccessToken); // Update stored token
        localStorage.setItem("accessToken", newAccessToken);
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const addTask = ({
    task_description,
    task_priority,
    username,
    datetime,
    is_completed,
  }: {
    task_description: string;
    task_priority: "low" | "medium" | "high";
    username: string | undefined;
    datetime: any;
    is_completed: boolean;
  }) => {
    const newTask = {
      task_id: uuidv4(),
      task_description,
      task_priority,
      username,
      datetime,
      is_completed,
    };
    setTasks([...tasks, newTask]);

    addTaskToDB(newTask);
  };

  // Delete task or tasks from db
  const deleteTaskToDB = async (task_id?: string) => {
    if (!username) return;

    try {
      const url = task_id
        ? `${API_BASE_URL}/deleteTask?username=${username}&task_id=${task_id}`
        : `${API_BASE_URL}/deleteTask?username=${username}`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        console.log("Task(s) deleted successfully");
      } else {
        console.error("Failed to delete task(s) from database");
      }
    } catch (error) {
      console.error("Error deleting task(s) from database:", error);
    }
  };

  const deleteTask = (task_id: string) => {
    setTasks(tasks.filter((task) => task.task_id !== task_id));
    deleteTaskToDB(task_id);
  };

  const deleteAllTasks = () => {
    setTasks([]);
    deleteTaskToDB();
  };

  // Function to update a task in the database
  const updateTaskToDB = async (
    task_id: string,
    updatedTask: Partial<Task>
  ) => {
    try {
      const response = await fetch(`${API_BASE_URL}/updateTask`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ task_id, ...updatedTask }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task in database");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const updateTask = (task_id: string, updatedTask: Partial<Task>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.task_id === task_id ? { ...task, ...updatedTask } : task
      )
    );

    updateTaskToDB(task_id, updatedTask);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        completedTasks,
        addTask,
        deleteTask,
        deleteAllTasks,
        updateTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};
