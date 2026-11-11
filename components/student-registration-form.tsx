"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { postJson } from "@/lib/api";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function StudentRegistrationForm({ schools }: { schools: { id:string;name:string;year:number }[] }) {
  const router=useRouter(); const [error,setError]=useState(""); const [loading,setLoading]=useState(false);
  async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setLoading(true);setError("");const body=Object.fromEntries(new FormData(e.currentTarget).entries());let j:{studentId:string};try{j=await postJson("/api/students",body);}catch(err){setLoading(false);return setError((err as Error).message);}router.push(`/order/new?studentId=${j.studentId}`);}
  return <form onSubmit={submit} className="mt-7 flex flex-col gap-4"><Input name="name" label="학생 이름" required fullWidth/><Input name="birthDate" label="생년월일" type="date" required fullWidth/><label className="text-15 text-gray-700">성별<select name="gender" required className="mt-2 w-full h-12.5 px-4 border border-gray-200 rounded-lg"><option value="">선택</option><option>남</option><option>여</option><option>기타</option></select></label><label className="text-15 text-gray-700">입학 학교<select name="schoolId" required className="mt-2 w-full h-12.5 px-4 border border-gray-200 rounded-lg"><option value="">선택</option>{schools.map(s=><option key={s.id} value={s.id}>{s.name} ({s.year})</option>)}</select></label><div className="grid grid-cols-2 gap-3"><Input name="admissionYear" label="입학 연도" type="number" defaultValue={new Date().getFullYear()+1} required fullWidth/><Input name="admissionGrade" label="입학 학년" type="number" defaultValue={1} min={1} max={3} required fullWidth/></div><Input name="phone" label="학생 휴대폰" placeholder="010-0000-0000" fullWidth/><Input name="guardianPhone" label="보호자 연락처" placeholder="010-0000-0000" required fullWidth/><Input name="previousSchool" label="출신 학교" fullWidth/><div className="grid grid-cols-2 gap-3"><Input name="heightCm" label="키(cm)" type="number" min={80} max={220} fullWidth/><Input name="weightKg" label="몸무게(kg)" type="number" min={15} max={200} fullWidth/></div>{error&&<ErrorMessage>{error}</ErrorMessage>}<Button type="submit" size="large" disabled={loading}>{loading?"저장 중...":"학생 등록 후 사이즈 선택"}</Button></form>;
}
