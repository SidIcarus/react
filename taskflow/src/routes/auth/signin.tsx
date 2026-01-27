import { createFileRoute } from "@tanstack/react-router";
import { AuthTemplate } from "@/components/auth/AuthTemplate";
import { SigninForm } from "@/components/auth/SigninForm";

export const Route = createFileRoute("/auth/signin")({
  component: Signin,
});

function Signin() {
  return (
    <AuthTemplate>
      <SigninForm />
    </AuthTemplate>
  );
}
