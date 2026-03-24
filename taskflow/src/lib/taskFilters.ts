import type { Task, TaskFilters, TaskPriority, TaskSort } from "@/types/task";

const PRIORITY_ORDER: Record<TaskPriority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
  return tasks.filter((task) => {
    // Priority filter
    if (filters.priority && task.priority !== filters.priority) {
      return false;
    }

    // Status filter
    if (filters.status && task.status !== filters.status) {
      return false;
    }

    // Due date range filter
    if (filters.dueDateFrom && task.dueDate) {
      if (task.dueDate < filters.dueDateFrom) return false;
    }

    if (filters.dueDateTo && task.dueDate) {
      if (task.dueDate > filters.dueDateTo) return false;
    }

    // Search filter (title and description)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesTitle = task.title.toLowerCase().includes(searchLower);
      const matchesDescription = task.description
        .toLowerCase()
        .includes(searchLower);
      if (!matchesTitle && !matchesDescription) return false;
    }

    return true;
  });
}

export function sortTasks(tasks: Task[], sort: TaskSort): Task[] {
  const sorted = [...tasks];

  sorted.sort((a, b) => {
    let comparison = 0;

    switch (sort.field) {
      case "title":
        comparison = a.title.localeCompare(b.title);
        break;

      case "priority":
        comparison = PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];
        break;

      case "dueDate":
        // Null dates go to the end
        if (!a.dueDate && !b.dueDate) comparison = 0;
        else if (!a.dueDate) comparison = 1;
        else if (!b.dueDate) comparison = -1;
        else comparison = a.dueDate - b.dueDate;
        break;

      case "createdAt":
      default:
        comparison = a.createdAt - b.createdAt;
        break;
    }

    return sort.direction === "desc" ? -comparison : comparison;
  });

  return sorted;
}

export function filterAndSortTasks(
  tasks: Task[],
  filters: TaskFilters,
  sort: TaskSort,
): Task[] {
  const filtered = filterTasks(tasks, filters);
  return sortTasks(filtered, sort);
}
