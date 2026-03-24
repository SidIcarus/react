// src/components/KanbanBoard.tsx

import { Plus } from "lucide-react";
import { useState } from "react";
import { TaskCard } from "@/components/TaskCard";
import { TaskForm } from "@/components/TaskForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { TimerState } from "@/contexts/tasks/types";
import type {
  CreateTaskInput,
  Task,
  TaskStatus,
  UpdateTaskInput,
} from "@/types/task";

const COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: "todo", label: "To Do" },
  { status: "in_progress", label: "In Progress" },
  { status: "done", label: "Done" },
];

interface KanbanBoardProps {
  projectId: string;
  tasks: Task[];
  activeTimer: TimerState | null;
  onCreateTask: (input: CreateTaskInput) => Promise<Task>;
  onUpdateTask: (id: string, input: UpdateTaskInput) => Promise<Task>;
  onDeleteTask: (id: string) => Promise<void>;
  onStartTimer: (taskId: string) => void;
  onStopTimer: () => Promise<void>;
}

export function KanbanBoard({
  projectId,
  tasks,
  activeTimer,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onStartTimer,
  onStopTimer,
}: KanbanBoardProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForStatus, setCreateForStatus] = useState<TaskStatus>("todo");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  function onOpenCreateDialog(status: TaskStatus) {
    setCreateForStatus(status);
    setIsCreateOpen(true);
  }

  async function onCreate(input: CreateTaskInput) {
    await onCreateTask(input);
    setIsCreateOpen(false);
  }

  async function onUpdate(input: CreateTaskInput) {
    if (!editingTask) return;
    await onUpdateTask(editingTask.id, input);
    setEditingTask(null);
  }

  function getTasksByStatus(status: TaskStatus) {
    return tasks.filter((task) => task.status === status);
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map((column) => (
          <div key={column.status} className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">
                {column.label}
                <span className="ml-2 text-muted-foreground">
                  ({getTasksByStatus(column.status).length})
                </span>
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="size-6"
                onClick={() => onOpenCreateDialog(column.status)}
              >
                <Plus className="size-4" />
                <span className="sr-only">Add task to {column.label}</span>
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              {getTasksByStatus(column.status).map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isTimerActive={activeTimer?.taskId === task.id}
                  timerStartedAt={activeTimer?.startedAt ?? null}
                  onEdit={setEditingTask}
                  onDelete={onDeleteTask}
                  onStartTimer={onStartTimer}
                  onStopTimer={onStopTimer}
                />
              ))}

              {getTasksByStatus(column.status).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No tasks
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
          </DialogHeader>
          <TaskForm
            projectId={projectId}
            onSubmit={onCreate}
            onCancel={() => setIsCreateOpen(false)}
            task={{ status: createForStatus } as Task}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <TaskForm
              projectId={projectId}
              task={editingTask}
              onSubmit={onUpdate}
              onCancel={() => setEditingTask(null)}
              submitLabel="Save Changes"
              submittingLabel="Saving..."
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
