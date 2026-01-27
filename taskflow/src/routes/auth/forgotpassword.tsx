import { createFileRoute } from "@tanstack/react-router";
import { AuthTemplate } from "@/components/auth/AuthTemplate";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const Route = createFileRoute("/auth/forgotpassword")({
  component: ForgotPassword,
});

function ForgotPassword() {
  return (
    <AuthTemplate>
      <ForgotPasswordForm/>
    </AuthTemplate>
  );
}
