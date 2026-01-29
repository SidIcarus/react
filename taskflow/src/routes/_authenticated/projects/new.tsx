import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProjectForm } from "@/components/project/ProjectForm";
import { useProjects } from "@/contexts/projects";

export const Route = createFileRoute("/_authenticated/projects/new")({
  component: NewProjectPage,
});

function NewProjectPage() {
  const { createProject } = useProjects();
  const navigate = useNavigate();

  async function onSubmitProject(input: Parameters<typeof createProject>[0]) {
    const project = await createProject(input);
    navigate({ to: "/projects/$projectId", params: { projectId: project.id } });
  }

  return (
    <div className="container py-8 max-w-xl">
      <h1 className="text-3xl font-bold mb-8">Create Project</h1>
      <ProjectForm onSubmitProject={onSubmitProject} />
    </div>
  );
}
