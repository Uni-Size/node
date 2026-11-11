"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { postJson } from "@/lib/api";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

export function AdminLoginForm({ defaults }: { defaults?: { email: string; password: string } }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setLoading(true);
    const data = new FormData(event.currentTarget);
    try { await postJson("/api/auth/login", { email: data.get("email"), password: data.get("password") }); }
    catch (e) { setLoading(false); return setError((e as Error).message); }
    router.replace("/admin"); router.refresh();
  }
  return <form onSubmit={submit} className="mt-7 flex flex-col gap-4"><label className="text-14 text-gray-700">이메일<input className="mt-2 w-full h-12 px-4 border border-gray-200 rounded-lg" name="email" type="email" defaultValue={defaults?.email} autoComplete="username" required/></label><label className="text-14 text-gray-700">비밀번호<input className="mt-2 w-full h-12 px-4 border border-gray-200 rounded-lg" name="password" type="password" defaultValue={defaults?.password} autoComplete="current-password" minLength={8} required/></label>{error&&<ErrorMessage>{error}</ErrorMessage>}<button className="h-12 rounded-lg bg-primary-900 text-white disabled:opacity-50" disabled={loading}>{loading?"로그인 중...":"로그인"}</button></form>;
}
