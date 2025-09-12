import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { Prisma } from "@prisma/client";

interface ModelInfo {
  name: string;
  count: number;
  exists: boolean;
}

export async function GET() {
  // Get database metadata with safe defaults
  const databaseInfo: {
    connectionEstablished: boolean;
    provider: string;
    rawQuerySucceeded: boolean;
    buildEnvironment: string;
    databaseUrl: string;
    models: ModelInfo[];
  } = {
    connectionEstablished: false,
    provider: process.env.DATABASE_URL?.split(':')[0] || 'unknown',
    rawQuerySucceeded: false,
    buildEnvironment: process.env.NODE_ENV || 'unknown',
    databaseUrl: process.env.DATABASE_URL ? 
      `${process.env.DATABASE_URL.split(':')[0]}:***` : 'not configured',
    models: [],
  };
  
  try {
    // First, try a basic raw query that doesn't need tables to exist
    try {
      const result = await prisma.$queryRaw`SELECT 1 as connected`;
      databaseInfo.rawQuerySucceeded = true;
      databaseInfo.connectionEstablished = true;
      console.log('Raw query succeeded:', result);
    } catch (rawError) {
      console.error('Raw query error:', rawError);
      // If even this fails, we have connection issues
      return NextResponse.json({
        status: 'error',
        message: 'Database connection failed at raw query level',
        databaseInfo,
        error: rawError instanceof Error ? rawError.message : String(rawError),
      }, { status: 500 });
    }
    
    // Now try checking different models
    const modelsToCheck = ['user', 'account', 'session', 'workout'];
    
    for (const modelName of modelsToCheck) {
      try {
        // Dynamically access the model (all lowercase in Prisma Client)
        // @ts-ignore - we're accessing dynamic properties
        const count = await prisma[modelName].count();
        databaseInfo.models.push({
          name: modelName.charAt(0).toUpperCase() + modelName.slice(1),
          count,
          exists: true
        });
      } catch (modelError) {
        // Check if it's a "relation doesn't exist" error
        const isTableMissing = 
          modelError instanceof Prisma.PrismaClientKnownRequestError && 
          (modelError.code === 'P2021' || modelError.message.includes('does not exist'));
        
        databaseInfo.models.push({
          name: modelName.charAt(0).toUpperCase() + modelName.slice(1),
          count: 0,
          exists: !isTableMissing
        });
        
        console.log(`Info for ${modelName} model:`, isTableMissing ? 
          'Table does not exist yet' : 'Error accessing table');
      }
    }
    
    return NextResponse.json({
      status: 'success',
      message: databaseInfo.connectionEstablished ? 
        'Database connection established' : 'Database connection issues',
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
      stack: process.env.NODE_ENV === 'development' ? 
        (error instanceof Error ? error.stack : undefined) : undefined,
    }, { status: 500 });
  }
}