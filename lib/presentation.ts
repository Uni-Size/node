import type { BadgeProps } from "@/components/ui/Badge";
import { AllocationStatus, OrderStatus, WorkStatus } from "@prisma/client";

export const orderStatusLabel: Record<OrderStatus, string> = {
  DRAFT: "작성 중", PENDING_APPROVAL: "승인 대기", APPROVED: "승인 완료",
  ALLOCATED: "재고 배정", PREPARING: "준비 중", READY: "수령 가능",
  PARTIALLY_RECEIVED: "일부 수령", RECEIVED: "수령 완료", CANCELLED: "취소",
};

export function orderItemStatus(item: { preparedQty: number; quantity: number; alteration: WorkStatus; nameTag: WorkStatus; allocation: AllocationStatus }) {
  if (item.preparedQty >= item.quantity) return "준비 완료";
  if (item.alteration === "PENDING" || item.alteration === "IN_PROGRESS") return "수선 중";
  if (item.nameTag === "PENDING" || item.nameTag === "IN_PROGRESS") return "명찰 작업 중";
  if (item.allocation === "BACKORDERED") return "발주 대기";
  if (item.allocation === "ALLOCATED") return "준비 중";
  return "승인 대기";
}

/** 주문 상태 → Badge variant. 승인 대기만 주의(warning), 진행 중은 info, 수령 단계는 success. */
export function statusVariant(status: OrderStatus): BadgeProps["variant"] {
  switch (status) {
    case "PENDING_APPROVAL": return "warning";
    case "APPROVED": case "ALLOCATED": case "PREPARING": return "info";
    case "READY": case "PARTIALLY_RECEIVED": case "RECEIVED": return "success";
    case "CANCELLED": return "error";
    default: return "default";
  }
}
