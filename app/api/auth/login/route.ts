import { NextResponse } from "next/server";
import { z } from "zod";
import { createSession, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({ email: z.string().email(), password: z.string().min(8).max(128) });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "이메일과 비밀번호를 확인해주세요." }, { status: 400 });
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user || (user.role !== "ADMIN" && user.role !== "STAFF") || !verifyPassword(parsed.data.password, user.passwordHash)) {
    return NextResponse.json({ message: "로그인 정보가 올바르지 않습니다." }, { status: 401 });
  }
  await createSession(user.id);
  await prisma.auditLog.create({ data: { userId: user.id, action: "SIGNED_IN", entityType: "User", entityId: user.id } });
  return NextResponse.json({ ok: true });
}
