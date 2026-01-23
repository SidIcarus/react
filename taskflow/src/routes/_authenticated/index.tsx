import { createFileRoute } from "@tanstack/react-router";
import { ComponentExample } from "@/components/component-example";
import { AuthProvider } from "@/contexts/auth";

export const Route = createFileRoute("/_authenticated/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AuthProvider>
      <ComponentExample />
    </AuthProvider>
  );
}
