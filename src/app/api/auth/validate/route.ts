import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { validateCredentials } from "../validateCredentials";

interface LoginRequest {
  email: string;
  password: string;
}

/**
 * POST /api/auth/validate
 *
 * Simple credential validation endpoint
 * Used for testing/debugging authentication without signing in
 *
 * In production, implement proper credential validation against your database
 * For registered users in localStorage, validation should happen client-side
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = (await request.json()) as LoginRequest;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 },
      );
    }

    // Use shared validation logic
    const user = validateCredentials(email, password);

    if (user) {
      return NextResponse.json(user);
    }

    // Not found or invalid credentials
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch (error) {
    console.error("Auth validation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
