import { Link } from "@tanstack/react-router";
import { Clock, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/contexts/projects";
import { useTasks } from "@/contexts/tasks";
import { useTimerDisplay } from "@/hooks/useTimerDisplay";

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function ActiveTimerIndicator() {
  const { activeTimer, getTask, stopTimer } = useTasks();
  const { getProject } = useProjects();

  const elapsed = useTimerDisplay(activeTimer?.startedAt ?? null);

  if (!activeTimer) return null;

  const task = getTask(activeTimer.taskId);
  if (!task) return null;

  const project = getProject(task.projectId);

  return (
    <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm">
      <Clock className="size-4 animate-pulse" />
      <span className="font-mono font-medium">{formatTime(elapsed)}</span>
      <Link
        to="/projects/$projectId"
        params={{ projectId: task.projectId }}
        className="hover:underline truncate max-w-32"
      >
        {task.title}
      </Link>
      <Button
        variant="ghost"
        size="icon"
        className="size-6 hover:bg-primary/20"
        onClick={stopTimer}
      >
        <Square className="size-3" />
        <span className="sr-only">Stop timer</span>
      </Button>
    </div>
  );
}
