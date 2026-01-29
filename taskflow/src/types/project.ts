export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: number;
  updatedAt: number;
}

export type CreateProjectInput = Pick<
  Project,
  "name" | "description" | "color"
>;
export type UpdateProjectInput = Partial<CreateProjectInput>;
