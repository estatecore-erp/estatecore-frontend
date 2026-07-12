import { api } from "@/lib/api";
import { ApiResponse, Property } from "@/types";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const data = await api<ApiResponse<Property>>(`/properties/${id}`, {
      method: "GET",
      token,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const formData = await req.formData();

    const data = await api<ApiResponse<Property>>(`/properties/${id}`, {
      method: "PUT",
      token,
      body: formData,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const data = await api<ApiResponse<Property>>(`/properties/${id}`, {
      method: "DELETE",
      token,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}
