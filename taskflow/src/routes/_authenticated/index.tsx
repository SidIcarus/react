// src/routes/_authenticated/index.tsx

import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  CheckSquare,
  Clock,
  FolderKanban,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { TasksByPriorityChart } from "@/components/dashboard/TasksByPriorityChart";
import { TasksByStatusChart } from "@/components/dashboard/TasksByStatusChart";
import { TasksOverTimeChart } from "@/components/dashboard/TasksOverTimeChart";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/contexts/projects";
import { useTasks } from "@/contexts/tasks";
import { calculateDashboardStats, formatDuration } from "@/lib/dashboardStats";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/")({
  component: DashboardPage,
});

function DashboardPage() {
  const { projects } = useProjects();
  const { tasks } = useTasks();

  const stats = calculateDashboardStats(projects, tasks);

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your projects and tasks
          </p>
        </div>
        <Button asChild>
          <Link to="/projects">
            View Projects
            <ArrowRight className="size-4 ml-2" />
          </Link>
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={<FolderKanban className="size-5" />}
        />
        <StatCard
          title="Total Tasks"
          value={stats.totalTasks}
          subtitle={`${stats.completedTasks} completed`}
          icon={<CheckSquare className="size-5" />}
        />
        <StatCard
          title="Completion Rate"
          value={`${Math.round(stats.completionRate)}%`}
          icon={<CheckSquare className="size-5" />}
        />
        <StatCard
          title="Time Tracked"
          value={formatDuration(stats.totalTimeSpent)}
          icon={<Clock className="size-5" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-card border rounded-lg p-6">
          <h2 className="font-semibold mb-4">Tasks by Status</h2>
          <TasksByStatusChart data={stats.tasksByStatus} />
        </div>

        <div className="bg-card border rounded-lg p-6">
          <h2 className="font-semibold mb-4">Tasks by Priority</h2>
          <TasksByPriorityChart data={stats.tasksByPriority} />
        </div>
      </div>

      <div className="bg-card border rounded-lg p-6 mb-8">
        <h2 className="font-semibold mb-4">Activity (Last 7 Days)</h2>
        <TasksOverTimeChart data={stats.tasksOverTime} />
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overdue Tasks */}
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="size-5 text-destructive" />
            <h2 className="font-semibold">Overdue Tasks</h2>
          </div>
          {stats.overdueTasks.length === 0 ? (
            <p className="text-muted-foreground text-sm">No overdue tasks</p>
          ) : (
            <ul className="space-y-2">
              {stats.overdueTasks.slice(0, 5).map((task) => (
                <li key={task.id}>
                  <Link
                    to="/projects/$projectId"
                    params={{ projectId: task.projectId }}
                    className="flex items-center justify-between p-2 rounded hover:bg-muted"
                  >
                    <span className="text-sm truncate">{task.title}</span>
                    <span className="text-xs text-destructive">
                      {new Date(task.dueDate!).toLocaleDateString()}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="size-5 text-muted-foreground" />
            <h2 className="font-semibold">Upcoming Deadlines</h2>
          </div>
          {stats.upcomingDeadlines.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No upcoming deadlines
            </p>
          ) : (
            <ul className="space-y-2">
              {stats.upcomingDeadlines.slice(0, 5).map((task) => (
                <li key={task.id}>
                  <Link
                    to="/projects/$projectId"
                    params={{ projectId: task.projectId }}
                    className="flex items-center justify-between p-2 rounded hover:bg-muted"
                  >
                    <span className="text-sm truncate">{task.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(task.dueDate!).toLocaleDateString()}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
