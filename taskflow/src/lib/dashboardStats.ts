import type { Project } from "@/types/project";
import type { Task, TaskPriority, TaskStatus } from "@/types/task";

export interface DashboardStats {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  totalTimeSpent: number;
  tasksByStatus: { status: TaskStatus; count: number; label: string }[];
  tasksByPriority: { priority: TaskPriority; count: number; label: string }[];
  tasksOverTime: { date: string; created: number; completed: number }[];
  projectStats: {
    project: Project;
    taskCount: number;
    completedCount: number;
    timeSpent: number;
  }[];
  upcomingDeadlines: Task[];
  overdueTasks: Task[];
}

const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
};

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export function calculateDashboardStats(
  projects: Project[],
  tasks: Task[],
): DashboardStats {
  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const completionRate =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const totalTimeSpent = tasks.reduce((sum, t) => sum + t.timeSpent, 0);

  // Tasks by status
  const tasksByStatus: DashboardStats["tasksByStatus"] = (
    ["todo", "in_progress", "done"] as TaskStatus[]
  ).map((status) => ({
    status,
    count: tasks.filter((t) => t.status === status).length,
    label: STATUS_LABELS[status],
  }));

  // Tasks by priority
  const tasksByPriority: DashboardStats["tasksByPriority"] = (
    ["high", "medium", "low"] as TaskPriority[]
  ).map((priority) => ({
    priority,
    count: tasks.filter((t) => t.priority === priority).length,
    label: PRIORITY_LABELS[priority],
  }));

  // Tasks over time (last 7 days)
  const tasksOverTime = calculateTasksOverTime(tasks, 7);

  // Per-project stats
  const projectStats = projects.map((project) => {
    const projectTasks = tasks.filter((t) => t.projectId === project.id);
    return {
      project,
      taskCount: projectTasks.length,
      completedCount: projectTasks.filter((t) => t.status === "done").length,
      timeSpent: projectTasks.reduce((sum, t) => sum + t.timeSpent, 0),
    };
  });

  // Upcoming deadlines (next 7 days, not done)
  const now = Date.now();
  const sevenDaysFromNow = now + 7 * 24 * 60 * 60 * 1000;
  const upcomingDeadlines = tasks
    .filter(
      (t) =>
        t.dueDate &&
        t.dueDate >= now &&
        t.dueDate <= sevenDaysFromNow &&
        t.status !== "done",
    )
    .sort((a, b) => (a.dueDate ?? 0) - (b.dueDate ?? 0));

  // Overdue tasks
  const overdueTasks = tasks
    .filter((t) => t.dueDate && t.dueDate < now && t.status !== "done")
    .sort((a, b) => (a.dueDate ?? 0) - (b.dueDate ?? 0));

  return {
    totalProjects,
    totalTasks,
    completedTasks,
    completionRate,
    totalTimeSpent,
    tasksByStatus,
    tasksByPriority,
    tasksOverTime,
    projectStats,
    upcomingDeadlines,
    overdueTasks,
  };
}

function calculateTasksOverTime(
  tasks: Task[],
  days: number,
): DashboardStats["tasksOverTime"] {
  const result: DashboardStats["tasksOverTime"] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const dayStart = date.getTime();
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;

    const created = tasks.filter(
      (t) => t.createdAt >= dayStart && t.createdAt < dayEnd,
    ).length;

    const completed = tasks.filter(
      (t) =>
        t.status === "done" && t.updatedAt >= dayStart && t.updatedAt < dayEnd,
    ).length;

    result.push({
      date: date.toLocaleDateString("en-US", { weekday: "short" }),
      created,
      completed,
    });
  }

  return result;
}

export function formatDuration(ms: number): string {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
