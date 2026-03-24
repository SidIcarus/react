// src/contexts/tasks/types.ts

import type { Task, CreateTaskInput, UpdateTaskInput, TaskStatus } from "@/types/task";

export interface TimerState {
  taskId: string;
  startedAt: number;
}

export interface TasksContextType {
  tasks: Task[];
  isLoading: boolean;
  activeTimer: TimerState | null;
  getTask: (id: string) => Task | undefined;
  getTasksByProject: (projectId: string) => Task[];
  createTask: (input: CreateTaskInput) => Promise<Task>;
  updateTask: (id: string, input: UpdateTaskInput) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  reorderTasks: (projectId: string, status: TaskStatus, taskIds: string[]) => Promise<void>;
  addTimeToTask: (id: string, milliseconds: number) => Promise<Task>;
  startTimer: (taskId: string) => void;
  stopTimer: () => Promise<void>;
}
