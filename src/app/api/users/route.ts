import { api } from "@/lib/api";
import { ApiResponse } from "@/types";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const [employees, clients] = await Promise.all([
      api<ApiResponse<unknown>>("/employees", { method: "GET", token }),
      api<ApiResponse<unknown>>("/clients", { method: "GET", token }),
    ]);

    return NextResponse.json({ employees, clients });
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}
