import Link from "next/link";
import { ArrowLeftIcon } from "@/components/icons/icons";

// 고객용 모바일 화면 틀: 최대 480px, 상단에 뒤로가기 + 가운데 제목
export function MobileShell({ backHref, title, children, className = "bg-white" }: { backHref: string; title: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <main className={`max-w-120 min-h-screen mx-auto sm:border-x sm:border-gray-100 ${className}`}>
      <header className="h-17 flex items-center justify-between px-5 bg-white border-b border-gray-100">
        <Link href={backHref} aria-label="뒤로" className="text-gray-700"><ArrowLeftIcon className="w-5 h-5" /></Link>
        {title}
        <span className="w-5" aria-hidden />
      </header>
      {children}
    </main>
  );
}
