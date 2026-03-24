import {
  closestCorners,
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { useState } from "react";
import { KanbanColumn } from "@/components/KanbanColumn";
import { SortableTaskCard } from "@/components/SortableTaskCard";
import { TaskCard } from "@/components/task/TaskCard";
import { TaskForm } from "@/components/task/TaskForm";
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
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Sensors determine how drag is initiated (pointer, keyboard)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Require 8px movement before drag starts
      // Prevents accidental drags when clicking
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

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

  function getTasksByStatus(status: TaskStatus): Task[] {
    return tasks.filter((task) => task.status === status);
  }

  function onDragStart(event: DragStartEvent) {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  }

  async function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveTask(null);

    if (!over) return;

    const activeTaskId = active.id as string;
    const activeTaskData = tasks.find((t) => t.id === activeTaskId);

    if (!activeTaskData) return;

    // Determine the target status
    // `over.id` could be a column ID (status) or another task ID
    let targetStatus: TaskStatus;

    if (COLUMNS.some((col) => col.status === over.id)) {
      // Dropped on a column
      targetStatus = over.id as TaskStatus;
    } else {
      // Dropped on another task — find that task's status
      const overTask = tasks.find((t) => t.id === over.id);
      if (!overTask) return;
      targetStatus = overTask.status;
    }

    // Only update if status changed
    if (activeTaskData.status !== targetStatus) {
      await onUpdateTask(activeTaskId, { status: targetStatus });
    }
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COLUMNS.map((column) => {
            const columnTasks = getTasksByStatus(column.status);

            return (
              <KanbanColumn
                key={column.status}
                id={column.status}
                label={column.label}
                taskCount={columnTasks.length}
                onAddClick={() => onOpenCreateDialog(column.status)}
              >
                <SortableContext
                  items={columnTasks.map((t) => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex flex-col gap-2">
                    {columnTasks.map((task) => (
                      <SortableTaskCard
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

                    {columnTasks.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No tasks
                      </p>
                    )}
                  </div>
                </SortableContext>
              </KanbanColumn>
            );
          })}
        </div>

        {/* DragOverlay renders the dragged item outside the normal flow */}
        <DragOverlay>
          {activeTask && (
            <TaskCard
              task={activeTask}
              isTimerActive={activeTimer?.taskId === activeTask.id}
              timerStartedAt={activeTimer?.startedAt ?? null}
              onEdit={() => {}}
              onDelete={() => {}}
              onStartTimer={() => {}}
              onStopTimer={() => {}}
              isDragging
            />
          )}
        </DragOverlay>
      </DndContext>

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
