import { Prisma } from "@prisma/client";
import { approveOrder } from "@/lib/orders";
import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
export async function POST(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireStaff();
    if (!user) return NextResponse.json({ message: "권한이 없습니다." }, { status: 401 });
    const { id } = await params;
    return NextResponse.json(await approveOrder(id, user.id));
  } catch (error) {
    // DB 내부 메시지는 화면에 노출하지 않는다. P2034 = 동시 승인으로 인한 트랜잭션 충돌
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034")
      return NextResponse.json({ message: "다른 승인과 겹쳤습니다. 다시 시도해주세요." }, { status: 409 });
    if (error instanceof Error && !(error.constructor.name.startsWith("PrismaClient")))
      return NextResponse.json({ message: error.message }, { status: 400 });
    console.error(error);
    return NextResponse.json({ message: "승인 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}
