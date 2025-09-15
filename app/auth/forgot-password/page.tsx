"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: null, message: "" });

    try {
      // Here we would typically call an API endpoint to send the reset email
      // For now, we'll simulate a successful request
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus({
          type: "success",
          message: `Password reset instructions sent to ${email}. Please check your inbox.`,
        });
        setEmail("");
      } else {
        const data = await response.json();
        throw new Error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Password reset error:", error);
      setStatus({
        type: "error",
        message:
          "We couldn't process your request. Please verify your email and try again.",
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
            Enter your email address and we'll send you a link to reset your
            password.
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
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full rounded-md border-0 bg-gray-800 p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Email address"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md bg-yellow-500 px-3 py-2.5 text-sm font-semibold text-gray-900 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-70"
            >
              {isLoading ? "Sending..." : "Send reset instructions"}
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