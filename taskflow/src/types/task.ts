export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: number | null;
  timeSpent: number; // milliseconds
  createdAt: number;
  updatedAt: number;
}

export type CreateTaskInput = Pick<
  Task,
  "projectId" | "title" | "description" | "status" | "priority" | "dueDate"
>;

export type UpdateTaskInput = Partial<Omit<CreateTaskInput, "projectId">>;
