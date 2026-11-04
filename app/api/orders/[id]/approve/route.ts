import { approveOrder } from "@/lib/orders";
import { NextResponse } from "next/server";
export async function POST(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    return NextResponse.json(await approveOrder(id));
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "승인 실패" },
      { status: 400 },
    );
  }
}
