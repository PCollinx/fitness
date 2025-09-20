"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaLock } from "react-icons/fa";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  useEffect(() => {
    // Validate token is present
    if (!token) {
      setStatus({
        type: "error",
        message:
          "Invalid or missing reset token. Please request a new password reset link.",
      });
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setStatus({
        type: "error",
        message: "Passwords do not match",
      });
      return;
    }

    if (password.length < 8) {
      setStatus({
        type: "error",
        message: "Password must be at least 8 characters long",
      });
      return;
    }

    setIsLoading(true);
    setStatus({ type: null, message: "" });

    try {
      // Call API to reset password with token
      const response = await fetch("/api/auth/reset-password/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      if (response.ok) {
        setStatus({
          type: "success",
          message:
            "Your password has been successfully reset. You can now sign in with your new password.",
        });

        // Clear form
        setPassword("");
        setConfirmPassword("");

        // Redirect to sign in page after a delay
        setTimeout(() => {
          router.push("/auth/signin");
        }, 3000);
      } else {
        const data = await response.json();
        throw new Error(data.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Password reset error:", error);
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to reset password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-yellow-500">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Enter your new password below
          </p>
        </div>

        {status.type && (
          <div
            className={`rounded-md p-4 ${
              status.type === "success"
                ? "bg-green-900/50 text-green-400"
                : "bg-red-900/50 text-red-400"
            }`}
          >
            <p className="text-sm">{status.message}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="password" className="sr-only">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full rounded-md border-0 bg-gray-800 p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="New Password"
                disabled={!token || isLoading}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="relative block w-full rounded-md border-0 bg-gray-800 p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Confirm New Password"
                disabled={!token || isLoading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={!token || isLoading}
              className="group relative flex w-full justify-center rounded-md bg-yellow-500 px-3 py-2.5 text-sm font-semibold text-gray-900 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-70"
            >
              {isLoading ? (
                "Resetting password..."
              ) : (
                <>
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaLock className="h-5 w-5 text-gray-900" />
                  </span>
                  Reset Password
                </>
              )}
            </button>
          </div>

          <div className="flex justify-center">
            <Link
              href="/auth/signin"
              className="flex items-center text-sm text-gray-300 hover:text-yellow-500"
            >
              <FaArrowLeft className="mr-2" />
              Back to sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 w-64 bg-gray-800 rounded mb-4 mx-auto"></div>
              <div className="h-4 w-48 bg-gray-800 rounded mx-auto"></div>
            </div>
          </div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
