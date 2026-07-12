import { api } from "@/lib/api";
import { ApiResponse, Property } from "@/types";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.toString();

    const data = await api<ApiResponse<Property[]>>(
      `/properties${query ? `?${query}` : ""}`,
      { method: "GET", token },
    );

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

    const formData = await req.formData();

    const res = await fetch(`${BASE_URL}/properties`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: formData,
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}
