import { api } from "@/lib/api";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {
      await api("/auth/logout", {
        method: "POST",
        token,
      });
    }

    cookieStore.delete("token");
    cookieStore.delete("role");

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}
