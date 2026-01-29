import type {
  CreateProjectInput,
  Project,
  UpdateProjectInput,
} from "@/types/project";

export interface ProjectsContextType {
  projects: Project[];
  isLoading: boolean;
  getProject: (id: string) => Project | undefined;
  createProject: (input: CreateProjectInput) => Promise<Project>;
  updateProject: (id: string, input: UpdateProjectInput) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
}
