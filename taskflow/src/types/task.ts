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

export type TaskSortField = "createdAt" | "dueDate" | "priority" | "title";
export type SortDirection = "asc" | "desc";

export interface TaskFilters {
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDateFrom?: number;
  dueDateTo?: number;
  search?: string;
}

export interface TaskSort {
  field: TaskSortField;
  direction: SortDirection;
}
