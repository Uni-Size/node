import { NextResponse } from "next/server";
import { z } from "zod";
import { createSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().trim().min(2).max(30), birthDate: z.coerce.date().refine((d) => d < new Date()),
  gender: z.enum(["남", "여", "기타"]), schoolId: z.string().cuid(),
  admissionYear: z.coerce.number().int().min(2020).max(2100), admissionGrade: z.coerce.number().int().min(1).max(3),
  phone: z.string().trim().regex(/^01[016789]-?\d{3,4}-?\d{4}$/).optional().or(z.literal("")),
  guardianPhone: z.string().trim().regex(/^01[016789]-?\d{3,4}-?\d{4}$/), previousSchool: z.string().trim().max(50).optional(),
  heightCm: z.preprocess((v) => v === "" ? undefined : v, z.coerce.number().int().min(80).max(220).optional()),
  weightKg: z.preprocess((v) => v === "" ? undefined : v, z.coerce.number().int().min(15).max(200).optional()),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." }, { status: 400 });
  const data = parsed.data;
  if (!await prisma.school.findUnique({ where: { id: data.schoolId } })) return NextResponse.json({ message: "학교를 찾을 수 없습니다." }, { status: 404 });
  const result = await prisma.$transaction(async (tx) => {
    const existing = await tx.student.findFirst({ where: { name: data.name, birthDate: data.birthDate, schoolId: data.schoolId } });
    if (existing) throw new Error("ALREADY_REGISTERED");
    const user = await tx.user.create({ data: { name: data.name, role: "CUSTOMER" } });
    const student = await tx.student.create({ data: { name:data.name,birthDate:data.birthDate,gender:data.gender,schoolId:data.schoolId,admissionYear:data.admissionYear,admissionGrade:data.admissionGrade,phone:data.phone?.replaceAll("-","")||null,guardianPhone:data.guardianPhone.replaceAll("-",""),previousSchool:data.previousSchool||null,heightCm:data.heightCm,weightKg:data.weightKg,userId:user.id } });
    await tx.auditLog.create({ data: { userId:user.id,action:"STUDENT_REGISTERED",entityType:"Student",entityId:student.id } });
    return { user, student };
  }).catch((error) => { if (error instanceof Error && error.message === "ALREADY_REGISTERED") return null; throw error; });
  if (!result) return NextResponse.json({ message: "이미 등록된 학생입니다. 매장 스태프에게 조회를 요청해주세요." }, { status: 409 });
  await createSession(result.user.id);
  return NextResponse.json({ studentId: result.student.id }, { status: 201 });
}
