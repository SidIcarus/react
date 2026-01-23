import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import Header from "@/components/Header";
import { getInitialAuthState } from "@/contexts/auth/getInitialAuthState";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    // This runs on both server and client
    // On server, getInitialAuthState returns not authenticated
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
    <>
      <Header />
      <Outlet />;
    </>
  );
}
