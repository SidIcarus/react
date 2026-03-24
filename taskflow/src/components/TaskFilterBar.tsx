import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  SortDirection,
  TaskFilters,
  TaskPriority,
  TaskSort,
  TaskSortField,
} from "@/types/task";

const PRIORITY_OPTIONS: { value: TaskPriority | "all"; label: string }[] = [
  { value: "all", label: "All Priorities" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const SORT_OPTIONS: { value: TaskSortField; label: string }[] = [
  { value: "createdAt", label: "Date Created" },
  { value: "dueDate", label: "Due Date" },
  { value: "priority", label: "Priority" },
  { value: "title", label: "Title" },
];

interface TaskFilterBarProps {
  filters: TaskFilters;
  sort: TaskSort;
  onFiltersChange: (filters: TaskFilters) => void;
  onSortChange: (sort: TaskSort) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export function TaskFilterBar({
  filters,
  sort,
  onFiltersChange,
  onSortChange,
  searchValue,
  onSearchChange,
}: TaskFilterBarProps) {
  function onPriorityChange(value: string) {
    if (value === "all") {
      const { priority: _, ...rest } = filters;
      onFiltersChange(rest);
    } else {
      onFiltersChange({ ...filters, priority: value as TaskPriority });
    }
  }

  function onSortFieldChange(value: string) {
    onSortChange({ ...sort, field: value as TaskSortField });
  }

  function onToggleSortDirection() {
    onSortChange({
      ...sort,
      direction: sort.direction === "asc" ? "desc" : "asc",
    });
  }

  function onClearFilters() {
    onFiltersChange({});
    onSearchChange("");
  }

  const hasActiveFilters = filters.priority || filters.search || searchValue;

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search tasks..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select
        value={filters.priority ?? "all"}
        onValueChange={onPriorityChange}
      >
        <SelectTrigger className="w-full sm:w-40">
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

      <Select value={sort.field} onValueChange={onSortFieldChange}>
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="icon"
        onClick={onToggleSortDirection}
        title={sort.direction === "asc" ? "Ascending" : "Descending"}
      >
        {sort.direction === "asc" ? "↑" : "↓"}
      </Button>

      {hasActiveFilters && (
        <Button variant="ghost" size="icon" onClick={onClearFilters}>
          <X className="size-4" />
          <span className="sr-only">Clear filters</span>
        </Button>
      )}
    </div>
  );
}
