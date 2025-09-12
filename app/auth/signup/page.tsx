"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";

const signupSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Registration error response:", errorData);
        throw new Error(
          errorData.message || errorData.error || "Failed to sign up"
        );
      }

      // Sign in the user after successful registration
      await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error("Signup error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-yellow-500">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Or{" "}
            <Link
              href="/auth/signin"
              className="font-medium text-yellow-500 hover:text-yellow-400"
            >
              sign in to your account
            </Link>
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-900/50 p-4">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                {...register("name")}
                className="relative block w-full rounded-md border-0 bg-gray-800 p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Full Name"
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                type="email"
                {...register("email")}
                className="relative block w-full rounded-md border-0 bg-gray-800 p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Email address"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                className="relative block w-full rounded-md border-0 bg-gray-800 p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Password"
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                {...register("confirmPassword")}
                className="relative block w-full rounded-md border-0 bg-gray-800 p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Confirm Password"
              />
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md bg-yellow-500 px-3 py-2.5 text-sm font-semibold text-gray-900 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-70"
            >
              {isLoading ? "Creating account..." : "Sign up"}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gray-900 px-2 text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="group relative flex w-full justify-center rounded-md border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-700"
            >
              <span className="flex items-center">
                <FaGoogle className="mr-2 h-5 w-5 text-red-500" />
                Google
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
