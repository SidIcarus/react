import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockAuth, mockNavigate, resetMocks } from "@/test/utils";
import { SignupForm } from "./SignupForm";

describe("SignupForm", () => {
  beforeEach(() => {
    resetMocks();
  });

  describe("rendering", () => {
    it("renders all form fields", () => {
      render(<SignupForm />);

      expect(
        screen.getByRole("heading", { name: /sign up/i }),
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /sign up/i }),
      ).toBeInTheDocument();
    });

    it("renders sign in link", () => {
      render(<SignupForm />);

      const link = screen.getByRole("link", { name: /sign in/i });
      expect(link).toHaveAttribute("href", "/auth/signin");
    });

    it("submit button is disabled initially", () => {
      render(<SignupForm />);

      expect(screen.getByRole("button", { name: /sign up/i })).toBeDisabled();
    });
  });

  describe("validation", () => {
    it("shows name error on blur when empty", async () => {
      const user = userEvent.setup();
      render(<SignupForm />);

      const nameInput = screen.getByLabelText(/name/i);
      await user.click(nameInput);
      await user.tab();

      expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    });

    it("shows email error for invalid email", async () => {
      const user = userEvent.setup();
      render(<SignupForm />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, "invalid-email");
      await user.tab();

      expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
    });

    it("shows email error for email without TLD", async () => {
      const user = userEvent.setup();
      render(<SignupForm />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, "test@example");
      await user.tab();

      expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
    });

    it("shows password error when too short", async () => {
      const user = userEvent.setup();
      render(<SignupForm />);

      const passwordInput = screen.getByLabelText(/^password$/i);
      await user.type(passwordInput, "short");
      await user.tab();

      expect(
        await screen.findByText(/at least 8 characters/i),
      ).toBeInTheDocument();
    });

    it("shows confirm password error when passwords do not match", async () => {
      const user = userEvent.setup();
      render(<SignupForm />);

      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmInput = screen.getByLabelText(/confirm password/i);

      await user.type(passwordInput, "password123");
      await user.type(confirmInput, "different456");
      await user.tab();

      expect(
        await screen.findByText(/passwords do not match/i),
      ).toBeInTheDocument();
    });

    it("clears name error when user starts typing", async () => {
      const user = userEvent.setup();
      render(<SignupForm />);

      const nameInput = screen.getByLabelText(/name/i);
      await user.click(nameInput);
      await user.tab();

      expect(await screen.findByText(/name is required/i)).toBeInTheDocument();

      await user.type(nameInput, "J");

      await waitFor(() => {
        expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();
      });
    });

    it("clears email error when user starts typing", async () => {
      const user = userEvent.setup();
      render(<SignupForm />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, "invalid");
      await user.tab();

      expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();

      await user.type(emailInput, "@");

      await waitFor(() => {
        expect(screen.queryByText(/invalid email/i)).not.toBeInTheDocument();
      });
    });

    it("clears password error when user starts typing", async () => {
      const user = userEvent.setup();
      render(<SignupForm />);

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
      const user = userEvent.setup();
      render(<SignupForm />);

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
  });

  describe("submission", () => {
    it("enables submit button when all fields are valid", async () => {
      const user = userEvent.setup();
      render(<SignupForm />);

      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/email/i), "john@example.com");
      await user.type(screen.getByLabelText(/^password$/i), "password123");
      await user.type(
        screen.getByLabelText(/confirm password/i),
        "password123",
      );

      expect(screen.getByRole("button", { name: /sign up/i })).toBeEnabled();
    });

    it("calls signup and navigates on successful submission", async () => {
      const user = userEvent.setup();
      mockAuth.signup.mockResolvedValue(undefined);
      render(<SignupForm />);

      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/email/i), "john@example.com");
      await user.type(screen.getByLabelText(/^password$/i), "password123");
      await user.type(
        screen.getByLabelText(/confirm password/i),
        "password123",
      );
      await user.click(screen.getByRole("button", { name: /sign up/i }));

      await waitFor(() => {
        expect(mockAuth.signup).toHaveBeenCalledWith(
          "John Doe",
          "john@example.com",
          "password123",
        );
      });

      expect(mockNavigate).toHaveBeenCalledWith({ to: "/auth/signin" });
    });

    it("shows loading state during submission", async () => {
      const user = userEvent.setup();
      mockAuth.signup.mockImplementation(() => new Promise(() => {})); // Never resolves
      render(<SignupForm />);

      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/email/i), "john@example.com");
      await user.type(screen.getByLabelText(/^password$/i), "password123");
      await user.type(
        screen.getByLabelText(/confirm password/i),
        "password123",
      );
      await user.click(screen.getByRole("button", { name: /sign up/i }));

      expect(
        await screen.findByRole("button", { name: /creating account/i }),
      ).toBeDisabled();
      expect(screen.getByLabelText(/name/i)).toBeDisabled();
      expect(screen.getByLabelText(/email/i)).toBeDisabled();
      expect(screen.getByLabelText(/^password$/i)).toBeDisabled();
      expect(screen.getByLabelText(/confirm password/i)).toBeDisabled();
    });

    it("displays error message on signup failure", async () => {
      const user = userEvent.setup();
      mockAuth.signup.mockRejectedValue(new Error("Email already exists"));
      render(<SignupForm />);

      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/email/i), "john@example.com");
      await user.type(screen.getByLabelText(/^password$/i), "password123");
      await user.type(
        screen.getByLabelText(/confirm password/i),
        "password123",
      );
      await user.click(screen.getByRole("button", { name: /sign up/i }));

      expect(
        await screen.findByText(/email already exists/i),
      ).toBeInTheDocument();
    });

    it("displays generic error for non-Error exceptions", async () => {
      const user = userEvent.setup();
      mockAuth.signup.mockRejectedValue("Unknown error");
      render(<SignupForm />);

      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/email/i), "john@example.com");
      await user.type(screen.getByLabelText(/^password$/i), "password123");
      await user.type(
        screen.getByLabelText(/confirm password/i),
        "password123",
      );
      await user.click(screen.getByRole("button", { name: /sign up/i }));

      expect(await screen.findByText(/sign up failed/i)).toBeInTheDocument();
    });

    it("does not submit when validation fails", async () => {
      const user = userEvent.setup();
      render(<SignupForm />);

      // Fill only some fields
      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/email/i), "invalid");
      await user.type(screen.getByLabelText(/^password$/i), "short");
      await user.type(screen.getByLabelText(/confirm password/i), "different");

      // Button should be disabled due to errors
      expect(screen.getByRole("button", { name: /sign up/i })).toBeDisabled();
      expect(mockAuth.signup).not.toHaveBeenCalled();
    });
  });
});
