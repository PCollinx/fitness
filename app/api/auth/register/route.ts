import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "../../../../lib/prisma";

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
  } catch (error) {
    console.error("Registration error details:", error instanceof Error ? error.message : String(error));
    if (error instanceof Error && error.stack) {
      console.error("Error stack:", error.stack);
    }
    
    return NextResponse.json(
      { message: "An error occurred during registration", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}