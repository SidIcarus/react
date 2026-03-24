import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskCard } from "@/components/task/TaskCard";
import type { Task } from "@/types/task";

interface SortableTaskCardProps {
  task: Task;
  isTimerActive: boolean;
  timerStartedAt: number | null;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStartTimer: (taskId: string) => void;
  onStopTimer: () => void;
}

export function SortableTaskCard({
  task,
  isTimerActive,
  timerStartedAt,
  onEdit,
  onDelete,
  onStartTimer,
  onStopTimer,
}: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={isDragging ? "opacity-50" : ""}
    >
      <TaskCard
        task={task}
        isTimerActive={isTimerActive}
        timerStartedAt={timerStartedAt}
        onEdit={onEdit}
        onDelete={onDelete}
        onStartTimer={onStartTimer}
        onStopTimer={onStopTimer}
        isDragging={isDragging}
      />
    </div>
  );
}
