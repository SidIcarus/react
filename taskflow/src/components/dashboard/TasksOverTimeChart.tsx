import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DashboardStats } from "@/lib/dashboardStats";

interface TasksOverTimeChartProps {
  data: DashboardStats["tasksOverTime"];
}

export function TasksOverTimeChart({ data }: TasksOverTimeChartProps) {
  const hasData = data.some((d) => d.created > 0 || d.completed > 0);

  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No activity yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="created"
          name="Created"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="completed"
          name="Completed"
          stroke="#22c55e"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
