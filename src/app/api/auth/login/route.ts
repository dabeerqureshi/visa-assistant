import { NextResponse } from "next/server";
import { authenticateUser } from "@/lib/auth";
import { loginSchema } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;
    const { token, user } = await authenticateUser(email, password);

    const response = NextResponse.json({ user, token });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    const message = error.message || "Login failed";
    const status = message === "Invalid email or password" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}