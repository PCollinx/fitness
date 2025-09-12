import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET(request: Request) {
  try {
    // Try to connect to the database and get the user count
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      message: "Database connection successful",
      userCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Database connection error:", error);
    
    return NextResponse.json({
      message: "Database connection failed",
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}