import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    console.log("Testing database connection...");
    
    // Test basic connection
    await prisma.$connect();
    console.log("Prisma connected successfully");
    
    // Test user table access
    const userCount = await prisma.user.count();
    console.log("User count:", userCount);
    
    // Test user creation (dry run)
    const testUser = await prisma.user.findFirst({
      where: { email: "test@example.com" }
    });
    
    return NextResponse.json({
      status: "success",
      userCount,
      databaseConnected: true,
      testUserExists: !!testUser,
      prismaVersion: "Connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Database test error:", error);
    
    return NextResponse.json({
      status: "error",
      databaseConnected: false,
      error: error instanceof Error ? error.message : "Unknown error",
      errorName: error instanceof Error ? error.name : "Unknown",
      stack: error instanceof Error ? error.stack : "No stack",
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}