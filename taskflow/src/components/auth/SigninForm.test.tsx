// src/components/SigninForm.test.tsx

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { mockAuth, mockNavigate, resetMocks } from "@/test/utils";
import { SigninForm } from "./SigninForm";

describe("SigninForm", () => {
  beforeEach(() => {
    resetMocks();
  });

  describe("rendering", () => {
    it("renders email and password fields", () => {
      render(<SigninForm />);

      expect(
        screen.getByRole("heading", { name: /signin/i }),
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /^signin$/i }),
      ).toBeInTheDocument();
    });

    it("renders sign up and forgot password links", () => {
      render(<SigninForm />);

      expect(screen.getByRole("link", { name: /sign up/i })).toHaveAttribute(
        "href",
        "/auth/signup",
      );
      expect(
        screen.getByRole("link", { name: /forgot your password/i }),
      ).toHaveAttribute("href", "/auth/forgotpassword");
    });

    it("displays successMessage prop when provided", () => {
      render(<SigninForm successMessage="Password reset successfully" />);

      expect(
        screen.getByText(/password reset successfully/i),
      ).toBeInTheDocument();
    });
  });

  describe("submission", () => {
    it("submits form with email and password", async () => {
      const user = userEvent.setup();
      mockAuth.signin.mockResolvedValue(undefined);

      render(<SigninForm />);

      await user.type(screen.getByLabelText(/email/i), "test@example.com");
      await user.type(screen.getByLabelText(/password/i), "password123");
      await user.click(screen.getByRole("button", { name: /^signin$/i }));

      await waitFor(() => {
        expect(mockAuth.signin).toHaveBeenCalledWith(
          "test@example.com",
          "password123",
        );
      });
    });

    it("navigates to home on successful signin", async () => {
      const user = userEvent.setup();
      mockAuth.signin.mockResolvedValue(undefined);

      render(<SigninForm />);

      await user.type(screen.getByLabelText(/email/i), "test@example.com");
      await user.type(screen.getByLabelText(/password/i), "password123");
      await user.click(screen.getByRole("button", { name: /^signin$/i }));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith({ to: "/" });
      });
    });

    it("displays error message on signin failure", async () => {
      const user = userEvent.setup();
      mockAuth.signin.mockRejectedValue(new Error("Invalid credentials"));

      render(<SigninForm />);

      await user.type(screen.getByLabelText(/email/i), "test@example.com");
      await user.type(screen.getByLabelText(/password/i), "wrong");
      await user.click(screen.getByRole("button", { name: /^signin$/i }));

      expect(
        await screen.findByText(/invalid credentials/i),
      ).toBeInTheDocument();
    });

    it("displays generic error for non-Error exceptions", async () => {
      const user = userEvent.setup();
      mockAuth.signin.mockRejectedValue("Unknown error");

      render(<SigninForm />);

      await user.type(screen.getByLabelText(/email/i), "test@example.com");
      await user.type(screen.getByLabelText(/password/i), "password123");
      await user.click(screen.getByRole("button", { name: /^signin$/i }));

      expect(await screen.findByText(/signin failed/i)).toBeInTheDocument();
    });

    it("shows loading state during submission", async () => {
      const user = userEvent.setup();
      mockAuth.signin.mockImplementation(() => new Promise(() => {}));

      render(<SigninForm />);

      await user.type(screen.getByLabelText(/email/i), "test@example.com");
      await user.type(screen.getByLabelText(/password/i), "password123");
      await user.click(screen.getByRole("button", { name: /^signin$/i }));

      expect(
        await screen.findByRole("button", { name: /signing in/i }),
      ).toBeDisabled();
      expect(screen.getByLabelText(/email/i)).toBeDisabled();
      expect(screen.getByLabelText(/password/i)).toBeDisabled();
    });
  });
});
