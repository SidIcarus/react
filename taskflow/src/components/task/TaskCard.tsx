import { Clock, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task";

const PRIORITY_COLORS = {
  low: "bg-slate-100 text-slate-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
};

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m`;
  }
  return `${seconds}s`;
}

function formatDueDate(timestamp: number): string {
  const date = new Date(timestamp);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  }
  if (date.toDateString() === tomorrow.toDateString()) {
    return "Tomorrow";
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function isOverdue(timestamp: number): boolean {
  return timestamp < Date.now();
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStartTimer: (taskId: string) => void;
  isDragging?: boolean;
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onStartTimer,
  isDragging = false,
}: TaskCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this task?")) return;

    setIsDeleting(true);
    try {
      await onDelete(task.id);
    } catch (error) {
      console.error("Failed to delete task:", error);
      setIsDeleting(false);
    }
  }

  return (
    <div
      className={cn(
        "bg-card border rounded-lg p-3 shadow-sm",
        isDragging && "opacity-50 rotate-2 shadow-lg",
        task.status === "done" && "opacity-60",
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4
          className={cn(
            "font-medium text-sm",
            task.status === "done" && "line-through",
          )}
        >
          {task.title}
        </h4>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-6 shrink-0">
              <MoreHorizontal className="size-3" />
              <span className="sr-only">Task options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task)}>
              <Pencil className="size-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStartTimer(task.id)}>
              <Clock className="size-4 mr-2" />
              Start Timer
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="size-4 mr-2" />
              {isDeleting ? "Deleting..." : "Delete"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {task.description && (
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={cn(
            "text-xs px-2 py-0.5 rounded-full",
            PRIORITY_COLORS[task.priority],
          )}
        >
          {task.priority}
        </span>

        {task.dueDate && (
          <span
            className={cn(
              "text-xs",
              isOverdue(task.dueDate) && task.status !== "done"
                ? "text-destructive"
                : "text-muted-foreground",
            )}
          >
            {formatDueDate(task.dueDate)}
          </span>
        )}

        {task.timeSpent > 0 && (
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="size-3" />
            {formatTime(task.timeSpent)}
          </span>
        )}
      </div>
    </div>
  );
}
