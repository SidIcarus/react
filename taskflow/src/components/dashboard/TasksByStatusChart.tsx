import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { DashboardStats } from "@/lib/dashboardStats";

const STATUS_COLORS = {
  todo: "#94a3b8",
  in_progress: "#3b82f6",
  done: "#22c55e",
};

interface TasksByStatusChartProps {
  data: DashboardStats["tasksByStatus"];
}

export function TasksByStatusChart({ data }: TasksByStatusChartProps) {
  const chartData = data.filter((d) => d.count > 0);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No tasks yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="label"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={({ label, count }) => `${label}: ${count}`}
        >
          {chartData.map((entry) => (
            <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
