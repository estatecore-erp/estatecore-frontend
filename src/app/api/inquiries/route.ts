import { api } from "@/lib/api";
import { ApiResponse, Inquiry, StoreInquiryRequest } from "@/types";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const data = await api<ApiResponse<Inquiry[]>>("/inquiries", {
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

    const body: StoreInquiryRequest = await req.json();

    const data = await api<ApiResponse<Inquiry>>("/inquiries", {
      method: "POST",
      token,
      body,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}
