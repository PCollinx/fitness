export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { adminEmail, secretKey } = body;

    // Use a secret key to prevent unauthorized admin creation
    // You should set this in your environment variables
    const ADMIN_SETUP_SECRET =
      process.env.ADMIN_SETUP_SECRET || "setup-admin-2024";

    if (secretKey !== ADMIN_SETUP_SECRET) {
      return NextResponse.json(
        { error: "Invalid secret key" },
        { status: 403 }
      );
    }

    // Update the user to admin using type assertion
    const updatedUser = await prisma.user.update({
      where: { email: adminEmail },
      data: { role: "admin" } as any,
    });

    return NextResponse.json({
      message: "User promoted to admin successfully",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        role: (updatedUser as any).role,
      },
    });
  } catch (error) {
    console.error("Error promoting user to admin:", error);
    return NextResponse.json(
      { error: "Failed to promote user to admin" },
      { status: 500 }
    );
  }
}
