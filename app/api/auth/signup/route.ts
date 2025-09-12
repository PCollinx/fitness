import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt";
import { z } from "zod";
import prisma from "../../../../lib/prisma";

const signupSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate the request body
    const validation = signupSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid input data", errors: validation.error.errors },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Return the created user without the password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: passwordToRemove, ...userWithoutPassword } = user;

    return NextResponse.json(
      { message: "User created successfully", user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
