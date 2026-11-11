"use client";
import Link from "next/link";
import { AlertTriangleIcon } from "@/components/icons/icons";
import { Button, buttonClass } from "@/components/ui/Button";

// 서버 컴포넌트 렌더 실패(DB 끊김 등) 시 보여주는 화면
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main role="alert" className="min-h-screen grid place-items-center bg-gray-050 px-5 text-center">
      <section className="w-full max-w-100">
        <AlertTriangleIcon className="mx-auto w-11 h-11 text-error" />
        <h1 className="mt-5 text-20 font-bold">일시적인 오류가 발생했습니다</h1>
        <p className="mt-2 text-14 text-gray-500">잠시 후 다시 시도해주세요. 문제가 계속되면 매장에 문의해주세요.</p>
        <div className="mt-7 flex flex-col gap-2">
          <Button size="large" onClick={reset}>다시 시도</Button>
          <Link href="/" className={buttonClass("outline", "large")}>처음으로</Link>
        </div>
      </section>
    </main>
  );
}
