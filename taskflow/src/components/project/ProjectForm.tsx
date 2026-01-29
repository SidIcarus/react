import { useNavigate } from "@tanstack/react-router";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { CreateProjectInput, Project } from "@/types/project";

const PROJECT_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#14b8a6", // teal
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
];

const validators = {
  name(value: string) {
    if (!value.trim()) return "Project name is required";
    if (value.length > 100)
      return "Project name must be 100 characters or less";
    return null;
  },
  description(value: string) {
    if (value.length > 500) return "Description must be 500 characters or less";
    return null;
  },
};

interface ProjectFormProps extends React.ComponentProps<"form"> {
  project?: Project;
  onSubmitProject: (input: CreateProjectInput) => Promise<void>;
  submitLabel?: string;
  submittingLabel?: string;
}

export function ProjectForm({
  project,
  onSubmitProject,
  submitLabel = "Create Project",
  submittingLabel = "Creating...",
  className,
  ...props
}: ProjectFormProps) {
  const nameId = useId();
  const descriptionId = useId();
  const navigate = useNavigate();

  const [name, setName] = useState(project?.name ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [color, setColor] = useState(project?.color ?? PROJECT_COLORS[0]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmitProject({
        name: name.trim(),
        description: description.trim(),
        color,
      });
    } catch (error) {
      setErrors({
        form: error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function validate() {
    const newErrors: Record<string, string> = {};

    const nameError = validators.name(name);
    if (nameError) newErrors.name = nameError;

    const descriptionError = validators.description(description);
    if (descriptionError) newErrors.description = descriptionError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function onNameChange(value: string) {
    setName(value);
    if (errors.name) {
      setErrors((prev) => {
        const { name: _, ...rest } = prev;
        return rest;
      });
    }
  }

  function onDescriptionChange(value: string) {
    setDescription(value);
    if (errors.description) {
      setErrors((prev) => {
        const { description: _, ...rest } = prev;
        return rest;
      });
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        {errors.form && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
            {errors.form}
          </div>
        )}

        <Field>
          <FieldLabel htmlFor={nameId}>Name</FieldLabel>
          <Input
            id={nameId}
            type="text"
            placeholder="My Awesome Project"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            disabled={isSubmitting}
          />
          {errors.name && <FieldError>{errors.name}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor={descriptionId}>Description</FieldLabel>
          <Textarea
            id={descriptionId}
            placeholder="What's this project about?"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            disabled={isSubmitting}
            rows={3}
          />
          {errors.description && <FieldError>{errors.description}</FieldError>}
        </Field>

        <Field>
          <FieldLabel>Color</FieldLabel>
          <div className="flex gap-2 flex-wrap">
            {PROJECT_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                disabled={isSubmitting}
                className={cn(
                  "size-8 rounded-full transition-transform",
                  color === c && "ring-2 ring-offset-2 ring-primary scale-110",
                )}
                style={{ backgroundColor: c }}
                aria-label={`Select color ${c}`}
              />
            ))}
          </div>
        </Field>

        <div className="flex gap-3">
          <Button type="submit" disabled={isSubmitting || !name.trim()}>
            {isSubmitting ? submittingLabel : submitLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: "/projects" })}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
