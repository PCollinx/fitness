import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    const { pathname } = req.nextUrl;

    // Define protected routes
    const protectedRoutes = [
      "/dashboard",
      "/workouts",
      "/progress",
      "/social",
      "/profile",
      "/music",
      "/admin",
    ];

    // Define API routes that should bypass authentication
    const publicAPIRoutes = [
      "/api/workouts/seed",
    ];

    // Check if this is a public API route
    const isPublicAPI = publicAPIRoutes.some((route) =>
      pathname.startsWith(route)
    );

    // Allow public API routes to bypass authentication
    if (isPublicAPI) {
      return NextResponse.next();
    }

    // Handle root path - redirect based on authentication and onboarding status
    if (pathname === "/") {
      if (!token) {
        return NextResponse.redirect(new URL("/auth/signin", req.url));
      } else {
        // Only send to onboarding if user is truly new (no fitness goals)
        if (!token.onboardingCompleted && (!token.fitnessGoals || token.fitnessGoals.length === 0)) {
          return NextResponse.redirect(new URL("/onboarding", req.url));
        }
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // Check if the current route is protected
    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );

    // If trying to access a protected route without being authenticated
    if (isProtectedRoute && !token) {
      const url = new URL("/auth/signin", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    // Only redirect to onboarding for new users (those without any fitness goals)
    // Existing users can access the app even if onboardingCompleted is false
    if (
      token &&
      isProtectedRoute &&
      !token.onboardingCompleted &&
      pathname !== "/onboarding" &&
      token.fitnessGoals?.length === 0 // Only new users with no fitness goals
    ) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    // If user has completed onboarding but trying to access onboarding page
    if (token && pathname === "/onboarding" && token.onboardingCompleted) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // If already authenticated and trying to access auth routes
    if (
      token &&
      (pathname.startsWith("/auth/signin") ||
        pathname.startsWith("/auth/signup"))
    ) {
      // Redirect based on onboarding status
      const redirectPath = token.onboardingCompleted ? "/dashboard" : "/onboarding";
      return NextResponse.redirect(new URL(redirectPath, req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // On error, allow the request to proceed
    return NextResponse.next();
  }
}

// Configure which paths should run the middleware
export const config = {
  matcher: [
    // Add paths you want the middleware to run on
    "/",
    "/dashboard/:path*",
    "/workouts/:path*",
    "/progress/:path*",
    "/social/:path*",
    "/profile/:path*",
    "/music/:path*",
    "/admin/:path*",
    "/onboarding/:path*",
    "/auth/:path*",
    "/api/:path*",
  ],
};
