import { useDroppable } from "@dnd-kit/core";
import { Plus } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  id: string;
  label: string;
  taskCount: number;
  onAddClick: () => void;
  children: ReactNode;
}

export function KanbanColumn({
  id,
  label,
  taskCount,
  onAddClick,
  children,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "bg-muted/50 rounded-lg p-4 transition-colors",
        isOver && "bg-muted ring-2 ring-primary ring-inset",
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm">
          {label}
          <span className="ml-2 text-muted-foreground">({taskCount})</span>
        </h3>
        <Button
          variant="ghost"
          size="icon"
          className="size-6"
          onClick={onAddClick}
        >
          <Plus className="size-4" />
          <span className="sr-only">Add task to {label}</span>
        </Button>
      </div>

      {children}
    </div>
  );
}
