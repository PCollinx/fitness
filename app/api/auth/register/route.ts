import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "../../../../lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("Attempting to register user with email:", email);

    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (existingUser) {
        console.log("User already exists with email:", email);
        return NextResponse.json(
          { message: "User with this email already exists" },
          { status: 409 }
        );
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      return NextResponse.json(
        {
          message: "User registered successfully",
          user: userWithoutPassword,
        },
        { status: 201 }
      );
    } catch (dbError) {
      // Handle Prisma-specific errors
      if (dbError instanceof Prisma.PrismaClientValidationError) {
        console.error("Database validation error:", dbError.message);
        return NextResponse.json(
          {
            message: "Database configuration error",
            error:
              "The application cannot connect to the database. Please try again later.",
          },
          { status: 503 }
        );
      }

      if (dbError instanceof Prisma.PrismaClientKnownRequestError) {
        console.error("Known Prisma error:", dbError.code, dbError.message);
        if (dbError.code === "P2021") {
          return NextResponse.json(
            {
              message: "Database setup error",
              error:
                "The database tables don't exist yet. Please contact support.",
            },
            { status: 500 }
          );
        }
      }

      // Re-throw for the outer catch block
      throw dbError;
    }
  } catch (error) {
    console.error(
      "Registration error details:",
      error instanceof Error ? error.message : String(error)
    );
    if (error instanceof Error && error.stack) {
      console.error("Error stack:", error.stack);
    }

    return NextResponse.json(
      {
        message: "An error occurred during registration",
        error: "Server error - please try again later",
        detailedError:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : String(error)
            : undefined,
      },
      { status: 500 }
    );
  }
}
