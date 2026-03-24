// src/routes/_authenticated/projects/$projectId/index.tsx

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Pencil, Trash2, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { KanbanBoard } from "@/components/KanbanBoard";
import { useProjects } from "@/contexts/projects";
import { useTasks } from "@/contexts/tasks";

export const Route = createFileRoute("/_authenticated/projects/$projectId/")({
  component: ProjectDetailPage,
});

function ProjectDetailPage() {
  const { projectId } = Route.useParams();
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
  const navigate = useNavigate();

  const project = getProject(projectId);
  const tasks = getTasksByProject(projectId);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!project) {
    navigate({ to: "/projects" });
    return null;
  }

  async function onDeleteProject() {
    if (!confirm("Are you sure you want to delete this project and all its tasks?")) return;

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

      <KanbanBoard
        projectId={projectId}
        tasks={tasks}
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
