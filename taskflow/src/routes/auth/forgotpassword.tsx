import { createFileRoute } from "@tanstack/react-router";
import { AuthTemplate } from "@/components/auth/AuthTemplate";

export const Route = createFileRoute("/auth/forgotpassword")({
  component: ForgotPassword,
});

function ForgotPassword() {
  return (
    <AuthTemplate>
      <div>Hello "/forgotpassword"!</div>
    </AuthTemplate>
  );
}
