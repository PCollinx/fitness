import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  // Define protected routes
  const protectedRoutes = [
    "/dashboard",
    "/workouts",
    "/nutrition",
    "/progress",
    "/social",
    "/profile",
  ];

  // Handle root path - redirect to login if not authenticated, dashboard if authenticated
  if (pathname === "/") {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    } else {
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

  // If already authenticated and trying to access auth routes
  if (
    token &&
    (pathname.startsWith("/auth/signin") || pathname.startsWith("/auth/signup"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

// Configure which paths should run the middleware
export const config = {
  matcher: [
    // Add paths you want the middleware to run on
    "/",
    "/dashboard/:path*",
    "/workouts/:path*",
    "/nutrition/:path*",
    "/progress/:path*",
    "/social/:path*",
    "/profile/:path*",
    "/auth/:path*",
  ],
};
