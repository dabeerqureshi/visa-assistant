import { NextResponse } from "next/server";
import { createUser, signToken } from "@/lib/auth";
import { registerSchema } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { email, password, name, country } = validation.data;
    const user = await createUser(email, password, name, country);
    const token = signToken({ userId: user.id, email: user.email });

    const response = NextResponse.json(
      { user, token },
      { status: 201 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    const message = error.message || "Registration failed";
    const status = message === "Email already registered" ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}