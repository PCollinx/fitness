import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    let databaseStatus = {
      connected: false,
      tablesExist: false,
      userCount: 0,
      message: "",
      timestamp: new Date().toISOString()
    };
    
    // First check basic connection with a raw query that doesn't depend on tables existing
    try {
      await prisma.$queryRaw`SELECT 1 as connected`;
      databaseStatus.connected = true;
      databaseStatus.message = "Database connection successful";
    } catch (connectionError) {
      console.error("Database connection error:", connectionError);
      return NextResponse.json({
        ...databaseStatus,
        message: "Database connection failed",
        error: connectionError instanceof Error ? connectionError.message : String(connectionError)
      }, { status: 500 });
    }
    
    // If connected, try to access user table (which might not exist yet)
    try {
      const userCount = await prisma.user.count();
      databaseStatus.tablesExist = true;
      databaseStatus.userCount = userCount;
    } catch (tableError) {
      // Check if it's a table doesn't exist error
      if (
        tableError instanceof Prisma.PrismaClientKnownRequestError && 
        (tableError.code === 'P2021' || // Table does not exist
         tableError.message.includes('does not exist'))
      ) {
        databaseStatus.message = "Connected to database, but tables don't exist yet";
      } else {
        console.error("Error accessing User table:", tableError);
        databaseStatus.message = "Connected to database, but error accessing tables";
      }
    }
    
    return NextResponse.json(databaseStatus);
  } catch (error) {
    console.error("Unexpected error:", error);
    
    return NextResponse.json({
      message: "Database test failed with unexpected error",
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}