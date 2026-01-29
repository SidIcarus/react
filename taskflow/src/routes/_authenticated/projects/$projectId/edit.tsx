import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { ProjectForm } from "@/components/project/ProjectForm";
import { useProjects } from "@/contexts/projects";

export const Route = createFileRoute(
  "/_authenticated/projects/$projectId/edit",
)({
  component: EditProjectPage,
});

function EditProjectPage() {
  const { projectId } = Route.useParams();
  const { getProject, updateProject } = useProjects();
  const navigate = useNavigate();

  const project = getProject(projectId);

  if (!project) {
    navigate({ to: "/projects" });
    return null;
  }

  async function handleSubmit(input: Parameters<typeof updateProject>[1]) {
    await updateProject(projectId, input);
    navigate({ to: "/projects/$projectId", params: { projectId } });
  }

  return (
    <div className="container py-8 max-w-xl">
      <h1 className="text-3xl font-bold mb-8">Edit Project</h1>
      <ProjectForm
        project={project}
        onSubmitProject={handleSubmit}
        submitLabel="Save Changes"
        submittingLabel="Saving..."
      />
    </div>
  );
}
