import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { generateId, simulatedNetworkCall } from "@/lib/utils";
import type {
  CreateProjectInput,
  Project,
  UpdateProjectInput,
} from "@/types/project";
import type { ProjectsContextType } from "./types";

const ProjectsContext = createContext<ProjectsContextType | null>(null);

const PROJECTS_STORAGE_KEY = "taskflow_projects";

interface ProjectsProviderProps {
  children: ReactNode;
}

export function ProjectsProvider({ children }: ProjectsProviderProps) {
  const [projects, setProjects] = useLocalStorage<Project[]>(
    PROJECTS_STORAGE_KEY,
    [],
  );
  const [isLoading, setIsLoading] = useState(false);

  const getProject = useCallback(
    (id: string) => {
      return projects.find((project) => project.id === id);
    },
    [projects],
  );

  const createProject = useCallback(
    async (input: CreateProjectInput): Promise<Project> => {
      setIsLoading(true);
      try {
        await simulatedNetworkCall();

        const now = Date.now();
        const newProject: Project = {
          id: generateId(),
          ...input,
          createdAt: now,
          updatedAt: now,
        };

        setProjects((prev) => [...prev, newProject]);
        return newProject;
      } finally {
        setIsLoading(false);
      }
    },
    [setProjects],
  );

  const updateProject = useCallback(
    async (id: string, input: UpdateProjectInput): Promise<Project> => {
      setIsLoading(true);
      try {
        await simulatedNetworkCall();

        const existingProject = projects.find((p) => p.id === id);
        if (!existingProject) throw new Error("Project not found");

        const updatedProject: Project = {
          ...existingProject,
          ...input,
          updatedAt: Date.now(),
        };

        setProjects((prev) =>
          prev.map((p) => (p.id === id ? updatedProject : p)),
        );

        return updatedProject;
      } finally {
        setIsLoading(false);
      }
    },
    [projects, setProjects],
  );

  const deleteProject = useCallback(
    async (id: string): Promise<void> => {
      setIsLoading(true);
      try {
        await simulatedNetworkCall();

        const existingProject = projects.find((p) => p.id === id);
        if (!existingProject) {
          throw new Error("Project not found");
        }

        setProjects((prev) => prev.filter((p) => p.id !== id));
      } finally {
        setIsLoading(false);
      }
    },
    [projects, setProjects],
  );

  const value: ProjectsContextType = {
    projects,
    isLoading,
    getProject,
    createProject,
    updateProject,
    deleteProject,
  };

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects(): ProjectsContextType {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return context;
}
