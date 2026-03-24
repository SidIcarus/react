import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DashboardStats } from "@/lib/dashboardStats";

const PRIORITY_COLORS = {
  high: "#ef4444",
  medium: "#eab308",
  low: "#94a3b8",
};

interface TasksByPriorityChartProps {
  data: DashboardStats["tasksByPriority"];
}

export function TasksByPriorityChart({ data }: TasksByPriorityChartProps) {
  if (data.every((d) => d.count === 0)) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No tasks yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} layout="vertical">
        <XAxis type="number" allowDecimals={false} />
        <YAxis type="category" dataKey="label" width={80} />
        <Tooltip />
        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
          {data.map((entry) => (
            <Cell key={entry.priority} fill={PRIORITY_COLORS[entry.priority]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
