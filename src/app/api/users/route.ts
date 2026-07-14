import { api } from "@/lib/api";
import { ApiResponse } from "@/types";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthenticated" },
        { status: 401 },
      );
    }

    const type = req.nextUrl.searchParams.get("type");
    const query = type ? `?type=${type}` : "";

    const result = await api<ApiResponse<unknown>>(`/users${query}`, {
      method: "GET",
      token,
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch users" },
      { status: 400 },
    );
  }
}
