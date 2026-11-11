// 마스코트 공룡 얼굴(app/icon.svg와 같은 파일)을 로고 마크로 쓴다.
export function Brand({ small = false }: { small?: boolean }) {
  const size = small ? 'w-7 h-7' : 'w-9 h-9';
  return (
    <span className={`inline-flex items-center gap-2.5 font-bold tracking-widest text-gray-900 ${small ? 'text-14' : 'text-17'}`}>
      <img src="/icon.svg" alt="" className={size} />
      UNISIZE
    </span>
  );
}
