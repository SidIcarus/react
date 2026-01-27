import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockAuth, mockNavigate, resetMocks } from "@/test/utils";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

describe("ForgotPasswordForm", () => {
  beforeEach(() => {
    resetMocks();
    vi.spyOn(Date, "now").mockReturnValue(1000000);
  });

  describe("rendering", () => {
    it("renders the form with heading and description", () => {
      render(<ForgotPasswordForm />);

      expect(
        screen.getByRole("heading", { name: /request password reset/i }),
      ).toBeInTheDocument();
      expect(screen.getByText(/enter your email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /send reset link/i }),
      ).toBeInTheDocument();
    });

    it("renders sign in link", () => {
      render(<ForgotPasswordForm />);

      const link = screen.getByRole("link", { name: /sign in/i });
      expect(link).toHaveAttribute("href", "/auth/signup");
    });

    it("displays errorMessage prop when provided", () => {
      render(<ForgotPasswordForm errorMessage="Reset link has expired" />);

      expect(screen.getByText(/reset link has expired/i)).toBeInTheDocument();
    });
  });

  describe("submission", () => {
    it("calls forgetPassword and navigates on success", async () => {
      const user = userEvent.setup();
      mockAuth.forgetPassword.mockResolvedValue({
        email: "john@example.com",
        name: "John Doe",
      });
      render(<ForgotPasswordForm />);

      await user.type(screen.getByLabelText(/email/i), "john@example.com");
      await user.click(
        screen.getByRole("button", { name: /send reset link/i }),
      );

      await waitFor(() => {
        expect(mockAuth.forgetPassword).toHaveBeenCalledWith(
          "john@example.com",
        );
      });

      expect(mockNavigate).toHaveBeenCalledWith({
        to: "/auth/resetpassword",
        search: {
          email: "john@example.com",
          name: "John Doe",
          expiresAt: 1000000 + 15 * 60 * 1000,
        },
      });
    });

    it("shows loading state during submission", async () => {
      const user = userEvent.setup();
      mockAuth.forgetPassword.mockImplementation(() => new Promise(() => {}));
      render(<ForgotPasswordForm />);

      await user.type(screen.getByLabelText(/email/i), "john@example.com");
      await user.click(
        screen.getByRole("button", { name: /send reset link/i }),
      );

      expect(
        await screen.findByRole("button", { name: /sending/i }),
      ).toBeDisabled();
      expect(screen.getByLabelText(/email/i)).toBeDisabled();
    });

    it("displays error message on failure", async () => {
      const user = userEvent.setup();
      mockAuth.forgetPassword.mockRejectedValue(new Error("No account found"));
      render(<ForgotPasswordForm />);

      await user.type(screen.getByLabelText(/email/i), "unknown@example.com");
      await user.click(
        screen.getByRole("button", { name: /send reset link/i }),
      );

      expect(await screen.findByText(/no account found/i)).toBeInTheDocument();
    });

    it("displays generic error for non-Error exceptions", async () => {
      const user = userEvent.setup();
      mockAuth.forgetPassword.mockRejectedValue("Unknown");
      render(<ForgotPasswordForm />);

      await user.type(screen.getByLabelText(/email/i), "test@example.com");
      await user.click(
        screen.getByRole("button", { name: /send reset link/i }),
      );

      expect(
        await screen.findByText(/link failed to send/i),
      ).toBeInTheDocument();
    });

    it("clears previous error on new submission", async () => {
      const user = userEvent.setup();
      mockAuth.forgetPassword
        .mockRejectedValueOnce(new Error("No account found"))
        .mockResolvedValueOnce({ email: "test@example.com", name: "Test" });
      render(<ForgotPasswordForm />);

      await user.type(screen.getByLabelText(/email/i), "test@example.com");
      await user.click(
        screen.getByRole("button", { name: /send reset link/i }),
      );

      expect(await screen.findByText(/no account found/i)).toBeInTheDocument();

      await user.click(
        screen.getByRole("button", { name: /send reset link/i }),
      );

      await waitFor(() => {
        expect(screen.queryByText(/no account found/i)).not.toBeInTheDocument();
      });
    });
  });

  describe("error precedence", () => {
    it("shows submission error over errorMessage prop", async () => {
      const user = userEvent.setup();
      mockAuth.forgetPassword.mockRejectedValue(new Error("Submission error"));
      render(<ForgotPasswordForm errorMessage="Prop error" />);

      await user.type(screen.getByLabelText(/email/i), "test@example.com");
      await user.click(
        screen.getByRole("button", { name: /send reset link/i }),
      );

      expect(await screen.findByText(/submission error/i)).toBeInTheDocument();
      expect(screen.queryByText(/prop error/i)).not.toBeInTheDocument();
    });
  });
});
