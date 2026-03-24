import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type {
  CreateTaskInput,
  Task,
  TaskStatus,
  UpdateTaskInput,
} from "@/types/task";
import type { TasksContextType, TimerState } from "./types";

const TasksContext = createContext<TasksContextType | null>(null);

const TASKS_STORAGE_KEY = "taskflow_tasks";
const TIMER_STORAGE_KEY = "taskflow_active_timer";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

async function simulateNetwork(ms = 300): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

interface TasksProviderProps {
  children: ReactNode;
}

export function TasksProvider({ children }: TasksProviderProps) {
  const [tasks, setTasks] = useLocalStorage<Task[]>(TASKS_STORAGE_KEY, []);
  const [activeTimer, setActiveTimer] = useLocalStorage<TimerState | null>(
    TIMER_STORAGE_KEY,
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  const getTask = useCallback(
    (id: string) => {
      return tasks.find((task) => task.id === id);
    },
    [tasks],
  );

  const getTasksByProject = useCallback(
    (projectId: string) => {
      return tasks.filter((task) => task.projectId === projectId);
    },
    [tasks],
  );

  const addTimeToTask = useCallback(
    async (id: string, milliseconds: number): Promise<Task> => {
      setIsLoading(true);
      try {
        await simulateNetwork(100);

        const existingTask = tasks.find((t) => t.id === id);
        if (!existingTask) {
          throw new Error("Task not found");
        }

        const updatedTask: Task = {
          ...existingTask,
          timeSpent: existingTask.timeSpent + milliseconds,
          updatedAt: Date.now(),
        };

        setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));

        return updatedTask;
      } finally {
        setIsLoading(false);
      }
    },
    [tasks, setTasks],
  );

  const startTimer = useCallback(
    (taskId: string) => {
      // If there's already a timer running, stop it first and save elapsed time
      if (activeTimer) {
        const elapsed = Date.now() - activeTimer.startedAt;
        addTimeToTask(activeTimer.taskId, elapsed);
      }

      // Start new timer
      setActiveTimer({
        taskId,
        startedAt: Date.now(),
      });
    },
    [activeTimer, addTimeToTask, setActiveTimer],
  );

  const stopTimer = useCallback(async () => {
    if (!activeTimer) return;

    const elapsed = Date.now() - activeTimer.startedAt;
    await addTimeToTask(activeTimer.taskId, elapsed);
    setActiveTimer(null);
  }, [activeTimer, addTimeToTask, setActiveTimer]);

  const createTask = useCallback(
    async (input: CreateTaskInput): Promise<Task> => {
      setIsLoading(true);
      try {
        await simulateNetwork();

        const now = Date.now();
        const newTask: Task = {
          id: generateId(),
          ...input,
          timeSpent: 0,
          createdAt: now,
          updatedAt: now,
        };

        setTasks((prev) => [...prev, newTask]);
        return newTask;
      } finally {
        setIsLoading(false);
      }
    },
    [setTasks],
  );

  const updateTask = useCallback(
    async (id: string, input: UpdateTaskInput): Promise<Task> => {
      setIsLoading(true);
      try {
        await simulateNetwork();

        const existingTask = tasks.find((t) => t.id === id);
        if (!existingTask) {
          throw new Error("Task not found");
        }

        const updatedTask: Task = {
          ...existingTask,
          ...input,
          updatedAt: Date.now(),
        };

        setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));

        return updatedTask;
      } finally {
        setIsLoading(false);
      }
    },
    [tasks, setTasks],
  );

  const deleteTask = useCallback(
    async (id: string): Promise<void> => {
      setIsLoading(true);
      try {
        await simulateNetwork();

        // Stop timer if deleting the active task
        if (activeTimer?.taskId === id) {
          setActiveTimer(null);
        }

        const existingTask = tasks.find((t) => t.id === id);
        if (!existingTask) {
          throw new Error("Task not found");
        }

        setTasks((prev) => prev.filter((t) => t.id !== id));
      } finally {
        setIsLoading(false);
      }
    },
    [tasks, setTasks, activeTimer, setActiveTimer],
  );

  const reorderTasks = useCallback(
    async (
      projectId: string,
      status: TaskStatus,
      taskIds: string[],
    ): Promise<void> => {
      setIsLoading(true);
      try {
        await simulateNetwork(100);

        setTasks((prev) => {
          const otherTasks = prev.filter(
            (t) => t.projectId !== projectId || t.status !== status,
          );
          const reorderedTasks = taskIds
            .map((id) => prev.find((t) => t.id === id))
            .filter((t): t is Task => t !== undefined);

          return [...otherTasks, ...reorderedTasks];
        });
      } finally {
        setIsLoading(false);
      }
    },
    [setTasks],
  );

  const value: TasksContextType = {
    tasks,
    isLoading,
    activeTimer,
    getTask,
    getTasksByProject,
    createTask,
    updateTask,
    deleteTask,
    reorderTasks,
    addTimeToTask,
    startTimer,
    stopTimer,
  };

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
}

export function useTasks(): TasksContextType {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
}
