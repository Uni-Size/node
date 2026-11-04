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

export function statusClass(status: OrderStatus) {
  if (status === "READY" || status === "RECEIVED") return "s2";
  if (status === "PENDING_APPROVAL") return "s1";
  if (status === "APPROVED") return "s3";
  return "s0";
}
