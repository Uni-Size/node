import Link from "next/link";
import { InfoCircleIcon } from "@/components/icons/icons";
import { buttonClass } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="min-h-screen grid place-items-center bg-gray-050 px-5 text-center">
      <section className="w-full max-w-100">
        <InfoCircleIcon className="mx-auto w-11 h-11 text-gray-400" />
        <h1 className="mt-5 text-20 font-bold">페이지를 찾을 수 없습니다</h1>
        <p className="mt-2 text-14 text-gray-500">주소가 잘못되었거나 볼 수 있는 권한이 없는 페이지입니다.</p>
        <Link href="/" className={`mt-7 ${buttonClass("primary", "large")}`}>처음으로</Link>
      </section>
    </main>
  );
}
