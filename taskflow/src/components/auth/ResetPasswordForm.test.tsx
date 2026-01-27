import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mockAuth, mockNavigate, resetMocks } from "@/test/utils";
import { ResetPasswordForm } from "./ResetPasswordForm";

const NOW = 1000000;
const FIFTEEN_MINUTES = 15 * 60 * 1000;

const defaultProps = {
  email: "john@example.com",
  name: "John Doe",
  expiresAt: NOW + FIFTEEN_MINUTES, // 15 minutes from now
};

describe("ResetPasswordForm", () => {
  beforeEach(() => {
    resetMocks();
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("rendering", () => {
    it("renders all form fields", () => {
      render(<ResetPasswordForm {...defaultProps} />);

      expect(
        screen.getByRole("heading", { name: /reset password/i }),
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /reset password/i }),
      ).toBeInTheDocument();
    });

    it("displays name and email as disabled inputs", () => {
      render(<ResetPasswordForm {...defaultProps} />);

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);

      expect(nameInput).toBeDisabled();
      expect(nameInput).toHaveValue("John Doe");
      expect(emailInput).toBeDisabled();
      expect(emailInput).toHaveValue("john@example.com");
    });

    it("renders sign in link", () => {
      render(<ResetPasswordForm {...defaultProps} />);

      const link = screen.getByRole("link", { name: /sign in/i });
      expect(link).toHaveAttribute("href", "/auth/signin");
    });

    it("submit button is disabled initially", () => {
      render(<ResetPasswordForm {...defaultProps} />);

      expect(
        screen.getByRole("button", { name: /reset password/i }),
      ).toBeDisabled();
    });

    it("displays time remaining", () => {
      render(<ResetPasswordForm {...defaultProps} />);

      expect(screen.getByText(/time remaining/i)).toBeInTheDocument();
      expect(screen.getByText("15:00")).toBeInTheDocument();
    });
  });

  describe("timer", () => {
    it("counts down every second", async () => {
      render(<ResetPasswordForm {...defaultProps} />);

      expect(screen.getByText("15:00")).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(screen.getByText("14:59")).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(60000);
      });

      expect(screen.getByText("13:59")).toBeInTheDocument();
    });

    it("redirects to forgot password when timer expires", async () => {
      render(<ResetPasswordForm {...defaultProps} />);

      act(() => {
        vi.advanceTimersByTime(FIFTEEN_MINUTES + 1000);
      });

      expect(mockNavigate).toHaveBeenCalledWith({
        to: "/auth/forgotpassword",
        search: { error: "Reset link has expired. Please try again." },
      });
    });

    it("cleans up interval on unmount", () => {
      const clearIntervalSpy = vi.spyOn(global, "clearInterval");
      const { unmount } = render(<ResetPasswordForm {...defaultProps} />);

      unmount();

      expect(clearIntervalSpy).toHaveBeenCalled();
    });
  });

  describe("validation", () => {
    it("shows password error when too short", async () => {
      vi.useRealTimers();
      const user = userEvent.setup();
      render(<ResetPasswordForm {...defaultProps} />);

      const passwordInput = screen.getByLabelText(/^password$/i);
      await user.type(passwordInput, "short");
      await user.tab();

      expect(
        await screen.findByText(/at least 8 characters/i),
      ).toBeInTheDocument();
    });

    it("shows confirm password error when passwords do not match", async () => {
      vi.useRealTimers();
      const user = userEvent.setup();
      render(<ResetPasswordForm {...defaultProps} />);

      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmInput = screen.getByLabelText(/confirm password/i);

      await user.type(passwordInput, "password123");
      await user.type(confirmInput, "different456");
      await user.tab();

      expect(
        await screen.findByText(/passwords do not match/i),
      ).toBeInTheDocument();
    });

    it("clears password error when user starts typing", async () => {
      vi.useRealTimers();
      const user = userEvent.setup();
      render(<ResetPasswordForm {...defaultProps} />);

      const passwordInput = screen.getByLabelText(/^password$/i);
      await user.type(passwordInput, "short");
      await user.tab();

      expect(
        await screen.findByText(/at least 8 characters/i),
      ).toBeInTheDocument();

      await user.type(passwordInput, "1");

      await waitFor(() => {
        expect(
          screen.queryByText(/at least 8 characters/i),
        ).not.toBeInTheDocument();
      });
    });

    it("clears confirm password error when password changes", async () => {
      vi.useRealTimers();
      const user = userEvent.setup();
      render(<ResetPasswordForm {...defaultProps} />);

      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmInput = screen.getByLabelText(/confirm password/i);

      await user.type(passwordInput, "password123");
      await user.type(confirmInput, "different456");
      await user.tab();

      expect(
        await screen.findByText(/passwords do not match/i),
      ).toBeInTheDocument();

      await user.type(passwordInput, "7");

      await waitFor(() => {
        expect(
          screen.queryByText(/passwords do not match/i),
        ).not.toBeInTheDocument();
      });
    });

    it("clears confirm password error on blur when passwords match", async () => {
      vi.useRealTimers();
      const user = userEvent.setup();
      render(<ResetPasswordForm {...defaultProps} />);

      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmInput = screen.getByLabelText(/confirm password/i);

      await user.type(passwordInput, "password123");
      await user.type(confirmInput, "password123");
      await user.tab();

      expect(
        screen.queryByText(/passwords do not match/i),
      ).not.toBeInTheDocument();
    });
  });

  describe("submission", () => {
    it("enables submit button when all fields are valid", async () => {
      vi.useRealTimers();
      const user = userEvent.setup();
      render(<ResetPasswordForm {...defaultProps} />);

      await user.type(screen.getByLabelText(/^password$/i), "password123");
      await user.type(
        screen.getByLabelText(/confirm password/i),
        "password123",
      );

      expect(
        screen.getByRole("button", { name: /reset password/i }),
      ).toBeEnabled();
    });

    it("calls resetPassword and navigates on successful submission", async () => {
      vi.useRealTimers();
      const user = userEvent.setup();
      mockAuth.resetPassword.mockResolvedValue(undefined);
      render(<ResetPasswordForm {...defaultProps} />);

      await user.type(screen.getByLabelText(/^password$/i), "password123");
      await user.type(
        screen.getByLabelText(/confirm password/i),
        "password123",
      );
      await user.click(screen.getByRole("button", { name: /reset password/i }));

      await waitFor(() => {
        expect(mockAuth.resetPassword).toHaveBeenCalledWith(
          "John Doe",
          "john@example.com",
          "password123",
        );
      });

      expect(mockNavigate).toHaveBeenCalledWith({
        to: "/auth/signin",
        search: { message: "Password reset successfully. Please sign in" },
      });
    });

    it("shows loading state during submission", async () => {
      vi.useRealTimers();
      const user = userEvent.setup();
      mockAuth.resetPassword.mockImplementation(() => new Promise(() => {}));
      render(<ResetPasswordForm {...defaultProps} />);

      await user.type(screen.getByLabelText(/^password$/i), "password123");
      await user.type(
        screen.getByLabelText(/confirm password/i),
        "password123",
      );
      await user.click(screen.getByRole("button", { name: /reset password/i }));

      expect(
        await screen.findByRole("button", { name: /resetting password/i }),
      ).toBeDisabled();
      expect(screen.getByLabelText(/^password$/i)).toBeDisabled();
      expect(screen.getByLabelText(/confirm password/i)).toBeDisabled();
    });

    it("displays error message on resetPassword failure", async () => {
      vi.useRealTimers();
      const user = userEvent.setup();
      mockAuth.resetPassword.mockRejectedValue(new Error("Reset failed"));
      render(<ResetPasswordForm {...defaultProps} />);

      await user.type(screen.getByLabelText(/^password$/i), "password123");
      await user.type(
        screen.getByLabelText(/confirm password/i),
        "password123",
      );
      await user.click(screen.getByRole("button", { name: /reset password/i }));

      expect(await screen.findByText(/reset failed/i)).toBeInTheDocument();
    });

    it("displays generic error for non-Error exceptions", async () => {
      vi.useRealTimers();
      const user = userEvent.setup();
      mockAuth.resetPassword.mockRejectedValue("Unknown error");
      render(<ResetPasswordForm {...defaultProps} />);

      await user.type(screen.getByLabelText(/^password$/i), "password123");
      await user.type(
        screen.getByLabelText(/confirm password/i),
        "password123",
      );
      await user.click(screen.getByRole("button", { name: /reset password/i }));

      expect(
        await screen.findByText(/something went wrong/i),
      ).toBeInTheDocument();
    });
  });
});
