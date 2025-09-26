import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import bcrypt from "bcrypt";
import { sendPasswordChangeConfirmationEmail } from "../../../../../lib/email";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { message: "Token and password are required" },
        { status: 400 }
      );
    }

    try {
      // Find the token in the database
      // Using dynamic access as a workaround if prisma types aren't updated
      const resetToken = await (prisma as any).passwordResetToken.findUnique({
        where: { token },
        include: { user: true },
      });

      if (!resetToken) {
        return NextResponse.json(
          { message: "Invalid or expired token" },
          { status: 400 }
        );
      }

      if (resetToken.expires < new Date()) {
        // Token has expired, delete it
        await (prisma as any).passwordResetToken.delete({
          where: { id: resetToken.id },
        });

        return NextResponse.json(
          {
            message: "Token has expired. Please request a new password reset.",
          },
          { status: 400 }
        );
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update the user's password
      await prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
      });

      // Delete the used token
      await (prisma as any).passwordResetToken.delete({
        where: { id: resetToken.id },
      });

      // Send confirmation email
      await sendPasswordChangeConfirmationEmail(
        resetToken.user.email,
        resetToken.user.name || resetToken.user.email
      );

      console.log(
        `[Password Reset Confirm] Password successfully reset for user: ${resetToken.userId}`
      );
    } catch (error) {
      console.error("Error processing password reset:", error);
      return NextResponse.json(
        { message: "Failed to reset password" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Password reset successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset confirm error:", error);
    return NextResponse.json(
      { message: "Failed to reset password" },
      { status: 500 }
    );
  }
}
