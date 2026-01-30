import type {
  CreateTaskInput,
  Task,
  TaskStatus,
  UpdateTaskInput,
} from "@/types/task";

export interface TasksContextType {
  tasks: Task[];
  isLoading: boolean;
  getTask: (id: string) => Task | undefined;
  getTasksByProject: (projectId: string) => Task[];
  createTask: (input: CreateTaskInput) => Promise<Task>;
  updateTask: (id: string, input: UpdateTaskInput) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  reorderTasks: (
    projectId: string,
    status: TaskStatus,
    taskIds: string[],
  ) => Promise<void>;
  addTimeToTask: (id: string, milliseconds: number) => Promise<Task>;
}
