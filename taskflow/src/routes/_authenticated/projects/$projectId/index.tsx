import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/contexts/projects";

export const Route = createFileRoute("/_authenticated/projects/$projectId/")({
  component: ProjectDetailPage,
});

function ProjectDetailPage() {
  const { projectId } = Route.useParams();
  const { getProject, deleteProject } = useProjects();
  const navigate = useNavigate();

  const project = getProject(projectId);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!project) {
    navigate({ to: "/projects" });
    return null;
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this project?")) return;

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
    <div className="container py-8 mx-auto">
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
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="size-4 mr-2" />
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      <p className="text-muted-foreground mb-8">
        {project.description || "No description"}
      </p>

      {/* Tasks will go here later */}
      <div className="border rounded-lg p-8 text-center text-muted-foreground">
        Tasks coming soon...
      </div>
    </div>
  );
}
