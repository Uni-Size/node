import Link from "next/link";
import { ArrowLeft, ArrowRight, LockKeyhole } from "lucide-react";

export default function VisitPage() {
  return (
    <main className="mobile-shell">
      <header>
        <Link href="/" aria-label="뒤로">
          <ArrowLeft />
        </Link>
        <div className="brand small">
          <span>U</span> UNISIZE
        </div>
        <i />
      </header>
      <section className="form-card">
        <div className="progress">
          <span />
          <span />
          <span />
          <span />
        </div>
        <p className="step-label">1 / 4 · 본인 확인</p>
        <h1>
          학생의 휴대폰 번호를
          <br />
          입력해주세요.
        </h1>
        <p className="muted">등록된 학생 정보 확인을 위해 사용합니다.</p>
        <label>
          휴대폰 번호
          <input placeholder="010-0000-0000" inputMode="tel" />
        </label>
        <button className="primary-button full">
          인증번호 받기 <ArrowRight size={18} />
        </button>
        <div className="divider">
          <span>휴대폰이 없나요?</span>
        </div>
        <button className="secondary-button full">보호자 연락처로 진행</button>
        <p className="secure-note">
          <LockKeyhole size={14} /> 개인정보는 학생 확인 목적으로만 안전하게
          사용됩니다.
        </p>
      </section>
    </main>
  );
}
