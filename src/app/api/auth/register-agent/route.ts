import { api } from "@/lib/api";
import { ApiResponse, RegisterAgentRequest, User } from "@/types";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthenticated" },
        { status: 401 },
      );
    }

    const body: RegisterAgentRequest = await req.json();

    const data = await api<ApiResponse<User>>("/auth/register-agent", {
      method: "POST",
      body,
      token,
    });

    return NextResponse.json({
      success: true,
      user: data.data,
    });
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}
