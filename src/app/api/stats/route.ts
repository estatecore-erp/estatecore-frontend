import { api } from "@/lib/api";
import { ApiResponse, DashboardStats } from "@/types";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const data = await api<ApiResponse<DashboardStats>>("/dashboard/stats", {
      method: "GET",
      token,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}
