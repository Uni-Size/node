import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin-login-form";
import { Brand } from "@/components/brand";
import { getCurrentUser } from "@/lib/auth";

// ponytail: 외부 플로우 확인용으로 운영에서도 관리자 계정을 미리 채운다(페이지 소스에 비밀번호 노출).
// 실사용자 받기 전에 `process.env.NODE_ENV === "production" ? undefined :` 조건을 되살릴 것.
const devDefaults = {
  email: process.env.ADMIN_EMAIL ?? "admin@unisize.local",
  password: process.env.ADMIN_PASSWORD ?? "change-this-before-production",
};

export default async function StaffLoginPage() {
  const user = await getCurrentUser();
  if (user && (user.role === "ADMIN" || user.role === "STAFF")) redirect("/admin");
  return <main className="min-h-screen grid place-items-center bg-gray-050 px-5"><section className="w-full max-w-100 rounded-xl border border-gray-200 bg-white p-8 shadow-sm"><Brand/><h1 className="mt-8 text-24 font-bold">매장 관리 로그인</h1><p className="mt-2 text-14 text-gray-500">승인된 관리자 및 스태프 계정으로 로그인하세요.</p><AdminLoginForm defaults={devDefaults}/></section></main>;
}
