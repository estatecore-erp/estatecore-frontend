import { api } from "@/lib/api";
import { ApiResponse, Sale, StoreSaleRequest } from "@/types";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const data = await api<ApiResponse<Sale[]>>("/sales", {
      method: "GET",
      token,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const body: StoreSaleRequest = await req.json();

    const data = await api<ApiResponse<Sale>>("/sales", {
      method: "POST",
      token,
      body,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}
