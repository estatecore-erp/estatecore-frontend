import { api } from "@/lib/api";
import { ApiResponse, User } from "@/types";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthenticated" },
        { status: 401 },
      );
    }

    const data = await api<ApiResponse<User>>("/auth/me", { token });

    return NextResponse.json({
      success: true,
      user: data.data,
    });
  } catch (error) {
    return NextResponse.json(error, { status: 401 });
  }
}
