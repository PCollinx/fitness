import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  console.log("GET method called");
  return NextResponse.json({ message: "GET works" });
}

export async function POST(request: Request) {
  console.log("POST method called");
  
  try {
    const body = await request.json();
    console.log("POST body received:", body);
    
    return NextResponse.json({
      success: true,
      message: "POST method works perfectly",
      data: body
    });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { error: "POST failed" },
      { status: 500 }
    );
  }
}