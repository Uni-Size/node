import { LockKeyhole } from "lucide-react";
import { Brand } from "@/components/brand";
import { MobileShell } from "@/components/mobile-shell";
import { StudentRegistrationForm } from "@/components/student-registration-form";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function VisitPage() {
  const schools = await prisma.school.findMany({ orderBy: [{ year: "desc" }, { name: "asc" }], select: { id:true,name:true,year:true } });
  return <MobileShell backHref="/" title={<Brand small/>}><section className="px-7 py-8"><p className="text-12 font-bold text-primary-500">학생 등록</p><h1 className="mt-3 text-24 font-bold text-gray-900">측정할 학생 정보를<br/>입력해주세요.</h1><p className="mt-2 text-14 text-gray-500">필수 정보는 주문과 수령 확인에 사용됩니다.</p><StudentRegistrationForm schools={schools}/><p className="flex items-center justify-center gap-1.5 mt-8 text-11 text-gray-500"><LockKeyhole className="w-3.5 h-3.5"/> 개인정보는 주문 처리 목적으로만 사용됩니다.</p></section></MobileShell>;
}
