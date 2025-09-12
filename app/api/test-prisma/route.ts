import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

interface ModelInfo {
  name: string;
  count: number;
}

export async function GET() {
  try {
    // First, check Prisma connection
    await prisma.$connect();
    
    // Get database metadata
    const databaseInfo: {
      connectionEstablished: boolean;
      provider: string;
      usersTableExists: boolean;
      models: ModelInfo[];
    } = {
      connectionEstablished: true,
      provider: process.env.DATABASE_URL?.split(':')[0] || 'unknown',
      usersTableExists: false,
      models: [],
    };
    
    // Check if the User model exists by trying to count it
    try {
      const userCount = await prisma.user.count();
      databaseInfo.usersTableExists = true;
      databaseInfo.models.push({
        name: 'User',
        count: userCount,
      });
    } catch (error) {
      console.error('Error accessing User model:', error);
    }
    
    // Try checking the database connection directly
    try {
      const result = await prisma.$queryRaw`SELECT 1 as connected`;
      console.log('Raw query result:', result);
    } catch (error) {
      console.error('Raw query error:', error);
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection test',
      databaseInfo,
      env: {
        nodeEnv: process.env.NODE_ENV,
        databaseProvider: process.env.DATABASE_URL?.split(':')[0] || 'unknown',
      }
    });
  } catch (error) {
    console.error('Database connection test failed:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Database connection test failed',
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}