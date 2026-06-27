import { api } from "@/lib/api";
import { ApiResponse, AuthResponse, LoginRequest } from "@/types";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: LoginRequest = await req.json();

    const data = await api<ApiResponse<AuthResponse>>("/auth/login", {
      method: "POST",
      body,
    });

    const cookieStore = await cookies();
    cookieStore.set("token", data.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    cookieStore.set("role", data.data.user.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return NextResponse.json({
      success: true,
      user: data.data.user,
    });
  } catch (error) {
    return NextResponse.json(error, { status: 401 });
  }
}
