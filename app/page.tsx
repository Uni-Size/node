import Link from "next/link";
import { ArrowRight, CheckCircle2, PackageCheck, Ruler, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <main className="landing">
      <nav className="landing-nav"><div className="brand"><span>U</span> UNISIZE</div><Link href="/admin" className="ghost-button">매장 관리</Link></nav>
      <section className="hero">
        <div className="eyebrow">2027 신입생 교복 측정</div>
        <h1>딱 맞는 교복,<br/><em>안심되는 준비.</em></h1>
        <p>측정한 사이즈를 확인하고 주문부터 수령까지 한곳에서 관리하세요.</p>
        <div className="hero-actions"><Link href="/visit" className="primary-button">측정 시작하기 <ArrowRight size={18}/></Link><Link href="/order/demo" className="text-link">내 주문 확인</Link></div>
        <div className="trust-row"><span><ShieldCheck/> 안전한 본인 확인</span><span><Ruler/> 간편한 사이즈 기록</span><span><PackageCheck/> 실시간 준비 현황</span></div>
      </section>
      <section className="steps">
        <article><b>01</b><h3>학생 확인</h3><p>휴대폰 번호와 학생 정보로 간편하게 확인해요.</p></article>
        <article><b>02</b><h3>측정과 주문</h3><p>매장에서 입어본 사이즈를 바로 저장하고 확정해요.</p></article>
        <article><b>03</b><h3>준비 알림</h3><p>모든 품목이 준비되면 알림을 받고 방문해요.</p></article>
      </section>
      <footer><CheckCircle2 size={17}/> 매장에서 받은 공통 QR로 언제든 시작할 수 있어요.</footer>
    </main>
  );
}
