import { Prisma, OrderStatus } from "@prisma/client";
import { prisma } from "./prisma";

export async function approveOrder(orderId: string, actorId?: string) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id: orderId }, include: { items: true } });
    if (!order) throw new Error("주문을 찾을 수 없습니다.");
    if (order.status !== OrderStatus.PENDING_APPROVAL) throw new Error("승인 대기 주문만 승인할 수 있습니다.");

    let fullyAllocated = true;
    for (const item of order.items) {
      const updated = await tx.$executeRaw`
        UPDATE "Inventory"
        SET "reserved" = "reserved" + ${item.quantity}, "version" = "version" + 1, "updatedAt" = NOW()
        WHERE "skuId" = ${item.skuId} AND ("onHand" - "reserved") >= ${item.quantity}
      `;
      if (updated === 1) {
        await tx.orderItem.update({ where: { id: item.id }, data: { allocation: "ALLOCATED" } });
      } else {
        fullyAllocated = false;
        await tx.orderItem.update({ where: { id: item.id }, data: { allocation: "BACKORDERED" } });
      }
    }

    const result = await tx.order.update({
      where: { id: orderId },
      data: { status: fullyAllocated ? "ALLOCATED" : "APPROVED", approvedAt: new Date() },
    });
    await tx.auditLog.create({ data: { userId: actorId, action: "ORDER_APPROVED", entityType: "Order", entityId: orderId } });
    return result;
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
}

export function suggestedPurchaseQuantity(demand: number, available: number, inbound: number) {
  return Math.max(0, demand - available - inbound);
}
