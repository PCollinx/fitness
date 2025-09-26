import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { randomBytes } from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // For security reasons, we still return a success response
      // even if the email doesn't exist in our database
      return NextResponse.json(
        {
          message:
            "If your email exists in our system, you will receive a reset link",
        },
        { status: 200 }
      );
    }

    // Generate a reset token
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour from now

    // Store the token in the database
    try {
      // First delete any existing tokens for this user
      // Using dynamic access as a workaround if prisma types aren't updated
      await prisma.$transaction([
        (prisma as any).passwordResetToken.deleteMany({
          where: { userId: user.id },
        }),
        (prisma as any).passwordResetToken.create({
          data: {
            token,
            expires,
            userId: user.id,
          },
        }),
      ]);

      console.log(`[Password Reset] Created token for user ${user.id}`);
    } catch (error) {
      console.error("Error storing reset token:", error);
    }

    // Send the reset email
    try {
      // Send the actual email
      await sendPasswordResetEmail(user.email, token, user.name || user.email);

      // Also log it for debugging
      console.log(`[Password Reset] Sending reset email to: ${user.email}`);
      console.log(
        `Reset link: ${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`
      );
    } catch (emailError) {
      console.error("Error sending reset email:", emailError);
      // We still return success to the user even if email fails
      // to prevent email enumeration attacks
    }

    // Return success response
    return NextResponse.json(
      {
        message:
          "If your email exists in our system, you will receive a reset link",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
