import { WarningIcon } from "@/components/icons/icons";

// 폼·액션 실패 안내. role="alert"라 스크린리더가 바로 읽는다.
export const ErrorMessage = ({ children, compact = false }: { children: React.ReactNode; compact?: boolean }) =>
  compact ? (
    <p role="alert" className="mt-1 flex items-start gap-1 text-11 text-error max-w-40"><WarningIcon className="w-3 h-3 mt-px shrink-0" />{children}</p>
  ) : (
    <p role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-050 px-3 py-2.5 text-13 text-error"><WarningIcon className="w-4 h-4 mt-px shrink-0" />{children}</p>
  );
