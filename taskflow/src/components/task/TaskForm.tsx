import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type {
  CreateTaskInput,
  Task,
  TaskPriority,
  TaskStatus,
} from "@/types/task";

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const validators = {
  title(value: string) {
    if (!value.trim()) return "Task title is required";
    if (value.length > 200) return "Title must be 200 characters or less";
    return null;
  },
  description(value: string) {
    if (value.length > 2000)
      return "Description must be 2000 characters or less";
    return null;
  },
};

interface TaskFormProps extends React.ComponentProps<"form"> {
  projectId: string;
  task?: Task;
  onSubmit: (input: CreateTaskInput) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  submittingLabel?: string;
}

export function TaskForm({
  projectId,
  task,
  onSubmit,
  onCancel,
  submitLabel = "Create Task",
  submittingLabel = "Creating...",
  className,
  ...props
}: TaskFormProps) {
  const titleId = useId();
  const descriptionId = useId();
  const statusId = useId();
  const priorityId = useId();
  const dueDateId = useId();

  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? "todo");
  const [priority, setPriority] = useState<TaskPriority>(
    task?.priority ?? "medium",
  );
  const [dueDate, setDueDate] = useState<string>(
    task?.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        projectId,
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate).getTime() : null,
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

    const titleError = validators.title(title);
    if (titleError) newErrors.title = titleError;

    const descriptionError = validators.description(description);
    if (descriptionError) newErrors.description = descriptionError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function onTitleChange(value: string) {
    setTitle(value);
    if (errors.title) {
      setErrors((prev) => {
        const { title: _, ...rest } = prev;
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
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-4", className)}
      {...props}
    >
      {errors.form && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
          {errors.form}
        </div>
      )}

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor={titleId}>Title</FieldLabel>
          <Input
            id={titleId}
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            disabled={isSubmitting}
          />
          {errors.title && <FieldError>{errors.title}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor={descriptionId}>Description</FieldLabel>
          <Textarea
            id={descriptionId}
            placeholder="Add more details..."
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            disabled={isSubmitting}
            rows={3}
          />
          {errors.description && <FieldError>{errors.description}</FieldError>}
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor={statusId}>Status</FieldLabel>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as TaskStatus)}
              disabled={isSubmitting}
            >
              <SelectTrigger id={statusId}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor={priorityId}>Priority</FieldLabel>
            <Select
              value={priority}
              onValueChange={(value) => setPriority(value as TaskPriority)}
              disabled={isSubmitting}
            >
              <SelectTrigger id={priorityId}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORITY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor={dueDateId}>Due Date</FieldLabel>
          <Input
            id={dueDateId}
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            disabled={isSubmitting}
          />
        </Field>
      </FieldGroup>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting || !title.trim()}>
          {isSubmitting ? submittingLabel : submitLabel}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
