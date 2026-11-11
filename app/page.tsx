import Link from "next/link";
import { ArrowRight, CheckCircle2, PackageCheck, Ruler, ShieldCheck } from "lucide-react";
import { Brand } from "@/components/brand";
import { buttonClass } from "@/components/ui/Button";

const steps = [
  ["01", "학생 확인", "휴대폰 번호와 학생 정보로 간편하게 확인해요."],
  ["02", "측정과 주문", "매장에서 입어본 사이즈를 바로 저장하고 확정해요."],
  ["03", "준비 알림", "모든 품목이 준비되면 알림을 받고 방문해요."],
];

export default function Home() {
  return (
    <main className="min-h-screen bg-primary-050">
      <nav className="max-w-295 mx-auto h-20 flex items-center justify-between px-5 sm:px-7">
        <Brand />
        <Link href="/admin" className={buttonClass("outline", "small")}>매장 관리</Link>
      </nav>

      <section className="max-w-295 mx-auto px-5 sm:px-7 pt-12 pb-16 sm:pt-20 sm:pb-24 grid gap-10 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-13 font-bold tracking-widest text-primary-500">2027 신입생 교복 측정</p>
          <h1 className="mt-5 text-32 sm:text-48 font-bold tracking-tight text-gray-900 break-keep">
            딱 맞는 교복,
            <br />
            <span className="text-primary-500">안심되는 준비.</span>
          </h1>
          <p className="mt-6 max-w-130 text-17 leading-relaxed text-gray-500 break-keep">
            측정한 사이즈를 확인하고 주문부터 수령까지 한곳에서 관리하세요.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link href="/visit" className={buttonClass("primary", "medium", "w-auto! px-6!")}>
              측정 시작하기 <ArrowRight className="w-4.5 h-4.5" />
            </Link>
            <Link href="/visit" className="text-15 font-semibold text-gray-900 border-b border-gray-900">학생 등록·주문</Link>
          </div>
          <ul className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-7 text-13 text-gray-600">
            <li className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-primary-500" /> 안전한 본인 확인</li>
            <li className="flex items-center gap-1.5"><Ruler className="w-4 h-4 text-primary-500" /> 간편한 사이즈 기록</li>
            <li className="flex items-center gap-1.5"><PackageCheck className="w-4 h-4 text-primary-500" /> 실시간 준비 현황</li>
          </ul>
        </div>
        {/* 마스코트 공룡 (unisize Brand 가이드) */}
        <img src="/student/onboarding.svg" alt="" className="hidden md:block w-60 lg:w-72" />
      </section>

      <section className="max-w-295 mx-auto px-5 sm:px-7 pt-12 pb-16 border-t border-primary-100 grid gap-8 md:grid-cols-3 md:gap-15">
        {steps.map(([no, title, desc]) => (
          <article key={no}>
            <b className="text-12 font-bold text-primary-500">{no}</b>
            <h3 className="mt-2 text-18 font-semibold text-gray-900">{title}</h3>
            <p className="mt-2 text-14 leading-relaxed text-gray-500 break-keep">{desc}</p>
          </article>
        ))}
      </section>

      <footer className="flex items-center justify-center gap-2 px-5 py-6 bg-primary-900 text-primary-100 text-13 text-center break-keep">
        <CheckCircle2 className="w-4 h-4 shrink-0" /> 매장에서 받은 공통 QR로 언제든 시작할 수 있어요.
      </footer>
    </main>
  );
}
