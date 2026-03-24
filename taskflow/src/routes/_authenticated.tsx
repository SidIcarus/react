import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { getInitialAuthState } from "@/contexts/auth/getInitialAuthState";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: () => {
    // Skip auth check on server — let client handle it
    if (typeof window === "undefined") return;

    // On client, it reads from localStorage
    const { isAuthenticated } = getInitialAuthState();

    if (!isAuthenticated) {
      throw redirect({
        to: "/auth/signin",
        search: { redirect: location.pathname },
      });
    }
  },

  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
