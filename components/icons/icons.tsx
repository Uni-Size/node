import type { SVGProps } from 'react';

// 모든 아이콘은 currentColor를 쓴다. 색은 `text-*` 토큰 클래스로, 크기는 `w-* h-*` 또는 width/height로 지정한다.
// 장식용이 기본이라 aria-hidden이 켜져 있다. 의미가 있는 아이콘이면 aria-hidden={false}와 aria-label을 넘긴다.
type IconProps = SVGProps<SVGSVGElement>;

const base = { xmlns: 'http://www.w3.org/2000/svg', 'aria-hidden': true } as const;

/** 뒤로가기 (등록 화면 헤더) */
export const ArrowLeftIcon = (props: IconProps) => (
  <svg {...base} viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path
      fillRule="evenodd"
      d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
      clipRule="evenodd"
    />
  </svg>
);

/** 바로가기 (관리자 카드) */
export const ArrowUpRightIcon = (props: IconProps) => (
  <svg {...base} width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** 셀렉트 드롭다운 삼각형 */
export const CaretDownIcon = (props: IconProps) => (
  <svg {...base} width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M7 10L12 15L17 10H7Z" fill="currentColor" />
  </svg>
);

/** 접기/펼치기 */
export const ChevronDownIcon = (props: IconProps) => (
  <svg {...base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

/** 닫기 / 제거 */
export const CloseIcon = (props: IconProps) => (
  <svg {...base} width="12" height="12" viewBox="0 0 12 12" fill="none" {...props}>
    <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/** 수정 */
export const PencilIcon = (props: IconProps) => (
  <svg {...base} width="16" height="16" viewBox="0 0 16 16" fill="none" {...props}>
    <path
      d="M11.333 2a1.885 1.885 0 0 1 2.667 2.667L4.833 13.833 2 14l.167-2.833L11.333 2z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 경고 (인라인 안내) */
export const WarningIcon = (props: IconProps) => (
  <svg {...base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
    />
  </svg>
);

/** 정보 */
export const InfoCircleIcon = (props: IconProps) => (
  <svg {...base} viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path
      fillRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
      clipRule="evenodd"
    />
  </svg>
);

/** 보안 (관리자 로그인 안내, 44 그리드) */
export const ShieldIcon = (props: IconProps) => (
  <svg {...base} width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M22 4L4 12V20C4 31.1 11.88 41.38 22 44C32.12 41.38 40 31.1 40 20V12L22 4Z" />
    <path d="M22 4L4 12V20C4 31.1 11.88 41.38 22 44" />
    <line x1="22" y1="14" x2="22" y2="26" />
    <circle cx="22" cy="32" r="2" fill="currentColor" stroke="none" />
  </svg>
);

/** 주의 다이아몬드 (관리자 로그인 안내, 44 그리드) */
export const DiamondAlertIcon = (props: IconProps) => (
  <svg {...base} width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M22 6L6 22L22 38L38 22L22 6Z" />
    <path d="M22 12L12 22L22 32L32 22L22 12Z" />
    <line x1="22" y1="16" x2="22" y2="28" />
  </svg>
);

/** 촬영 금지 (스태프 로그인 안내, 44 그리드) */
export const CameraOffIcon = (props: IconProps) => (
  <svg {...base} viewBox="0 0 44 44" fill="none" {...props}>
    <path
      d="M40.3333 35.0625L36.6667 31.3959V12.8334H29.2417L25.8958 9.1667H18.1042L16.3625 11.0917L13.75 8.4792L16.5 5.50003H27.5L30.8917 9.1667H36.6667C37.675 9.1667 38.5382 9.52573 39.2562 10.2438C39.9743 10.9618 40.3333 11.825 40.3333 12.8334V35.0625ZM7.33332 38.5C6.32499 38.5 5.46179 38.141 4.74374 37.423C4.02568 36.7049 3.66665 35.8417 3.66665 34.8334V12.8334C3.66665 11.825 4.02568 10.9618 4.74374 10.2438C5.46179 9.52573 6.32499 9.1667 7.33332 9.1667H9.21249L12.8792 12.8334H7.33332V34.8334H34.8792L38.5458 38.5H7.33332ZM28.6917 28.6459C27.9278 29.6848 26.9729 30.5174 25.8271 31.1438C24.6812 31.7702 23.4055 32.0834 22 32.0834C19.7083 32.0834 17.7604 31.2813 16.1562 29.6771C14.5521 28.073 13.75 26.125 13.75 23.8334C13.75 22.4278 14.0632 21.1521 14.6896 20.0063C15.316 18.8604 16.1486 17.9056 17.1875 17.1417L19.8458 19.8C19.1125 20.1973 18.5243 20.7473 18.0812 21.45C17.6382 22.1528 17.4167 22.9473 17.4167 23.8334C17.4167 25.1167 17.8597 26.2014 18.7458 27.0875C19.6319 27.9736 20.7167 28.4167 22 28.4167C22.8861 28.4167 23.6805 28.1952 24.3833 27.7521C25.0861 27.3091 25.6361 26.7209 26.0333 25.9875L28.6917 28.6459ZM27.8667 17.9667C28.6305 18.7 29.2187 19.5709 29.6312 20.5792C30.0437 21.5875 30.25 22.6723 30.25 23.8334V24.3834C30.25 24.5667 30.2347 24.75 30.2042 24.9334L20.9 15.6292C21.0833 15.5986 21.2667 15.5834 21.45 15.5834H22C23.1611 15.5834 24.2458 15.7896 25.2542 16.2021C26.2625 16.6146 27.1333 17.2028 27.8667 17.9667ZM37.5375 42.7167L1.23749 6.4167L3.84999 3.8042L40.15 40.1042L37.5375 42.7167Z"
      fill="currentColor"
    />
  </svg>
);

/** 경고 삼각형 (스태프 로그인 안내, 44 그리드) */
export const AlertTriangleIcon = (props: IconProps) => (
  <svg {...base} viewBox="0 0 44 44" fill="none" {...props}>
    <path
      d="M1.83337 38.4998L22 3.6665L42.1667 38.4998H1.83337ZM8.15837 34.8332H35.8417L22 10.9998L8.15837 34.8332ZM22 32.9998C22.5195 32.9998 22.9549 32.8241 23.3063 32.4728C23.6577 32.1214 23.8334 31.6859 23.8334 31.1665C23.8334 30.6471 23.6577 30.2116 23.3063 29.8603C22.9549 29.5089 22.5195 29.3332 22 29.3332C21.4806 29.3332 21.0452 29.5089 20.6938 29.8603C20.3424 30.2116 20.1667 30.6471 20.1667 31.1665C20.1667 31.6859 20.3424 32.1214 20.6938 32.4728C21.0452 32.8241 21.4806 32.9998 22 32.9998ZM20.1667 27.4998H23.8334V18.3332H20.1667V27.4998Z"
      fill="currentColor"
    />
  </svg>
);
