import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { KanbanBoard } from "@/components/KanbanBoard";
import { TaskFilterBar } from "@/components/TaskFilterBar";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/contexts/projects";
import { useTasks } from "@/contexts/tasks";
import { useDebounce } from "@/hooks/useDebounce";
import { filterAndSortTasks } from "@/lib/taskFilters";
import type {
  SortDirection,
  TaskFilters,
  TaskPriority,
  TaskSort,
  TaskSortField,
} from "@/types/task";

type ProjectSearchParams = {
  priority?: TaskPriority;
  sortField?: TaskSortField;
  sortDir?: SortDirection;
  search?: string;
};

export const Route = createFileRoute("/_authenticated/projects/$projectId/")({
  validateSearch: (search: Record<string, unknown>): ProjectSearchParams => ({
    priority: ["high", "medium", "low"].includes(search.priority as string)
      ? (search.priority as TaskPriority)
      : undefined,
    sortField: ["createdAt", "dueDate", "priority", "title"].includes(
      search.sortField as string,
    )
      ? (search.sortField as TaskSortField)
      : undefined,
    sortDir: ["asc", "desc"].includes(search.sortDir as string)
      ? (search.sortDir as SortDirection)
      : undefined,
    search: typeof search.search === "string" ? search.search : undefined,
  }),
  component: ProjectDetailPage,
});

function ProjectDetailPage() {
  const { projectId } = Route.useParams();
  const searchParams = Route.useSearch();
  const navigate = useNavigate();

  const { getProject, deleteProject } = useProjects();
  const {
    getTasksByProject,
    createTask,
    updateTask,
    deleteTask,
    activeTimer,
    startTimer,
    stopTimer,
  } = useTasks();

  const project = getProject(projectId);
  const allTasks = getTasksByProject(projectId);
  const [isDeleting, setIsDeleting] = useState(false);

  // Local search input state (for immediate UI feedback)
  const [searchInput, setSearchInput] = useState(searchParams.search ?? "");
  const debouncedSearch = useDebounce(searchInput, 300);

  // Build filters from URL params
  const filters: TaskFilters = {
    priority: searchParams.priority,
    search: debouncedSearch || undefined,
  };

  const sort: TaskSort = {
    field: searchParams.sortField ?? "createdAt",
    direction: searchParams.sortDir ?? "desc",
  };

  // Apply filtering and sorting
  const filteredTasks = filterAndSortTasks(allTasks, filters, sort);

  if (!project) {
    navigate({ to: "/projects" });
    return null;
  }

  function updateSearchParams(updates: Partial<ProjectSearchParams>) {
    navigate({
      to: ".",
      search: (prev) => {
        const next = { ...prev, ...updates };
        // Remove undefined values
        Object.keys(next).forEach((key) => {
          if (next[key as keyof ProjectSearchParams] === undefined) {
            delete next[key as keyof ProjectSearchParams];
          }
        });
        return next;
      },
      replace: true,
    });
  }

  function onFiltersChange(newFilters: TaskFilters) {
    updateSearchParams({
      priority: newFilters.priority,
      search: newFilters.search,
    });
  }

  function onSortChange(newSort: TaskSort) {
    updateSearchParams({
      sortField: newSort.field,
      sortDir: newSort.direction,
    });
  }

  function onSearchChange(value: string) {
    setSearchInput(value);
    // Update URL after debounce settles (handled by effect below)
  }

  // Sync debounced search to URL
  // This runs when debouncedSearch changes
  useState(() => {
    if (debouncedSearch !== searchParams.search) {
      updateSearchParams({ search: debouncedSearch || undefined });
    }
  });

  async function onDeleteProject() {
    if (
      !confirm(
        "Are you sure you want to delete this project and all its tasks?",
      )
    )
      return;

    setIsDeleting(true);
    try {
      await deleteProject(projectId);
      navigate({ to: "/projects" });
    } catch (error) {
      console.error("Failed to delete project:", error);
      setIsDeleting(false);
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <Link
          to="/projects"
          className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        >
          <ArrowLeft className="size-4" />
          Back to projects
        </Link>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-3">
          <div
            className="size-4 rounded-full"
            style={{ backgroundColor: project.color }}
          />
          <h1 className="text-3xl font-bold">{project.name}</h1>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/projects/$projectId/edit" params={{ projectId }}>
              <Pencil className="size-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button
            variant="destructive"
            onClick={onDeleteProject}
            disabled={isDeleting}
          >
            <Trash2 className="size-4 mr-2" />
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      {project.description && (
        <p className="text-muted-foreground mb-8">{project.description}</p>
      )}

      <TaskFilterBar
        filters={filters}
        sort={sort}
        onFiltersChange={onFiltersChange}
        onSortChange={onSortChange}
        searchValue={searchInput}
        onSearchChange={onSearchChange}
      />

      <KanbanBoard
        projectId={projectId}
        tasks={filteredTasks}
        activeTimer={activeTimer}
        onCreateTask={createTask}
        onUpdateTask={updateTask}
        onDeleteTask={deleteTask}
        onStartTimer={startTimer}
        onStopTimer={stopTimer}
      />
    </div>
  );
}
