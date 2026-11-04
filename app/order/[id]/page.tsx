import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Clock3, Package, Shirt } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { orderItemStatus, orderStatusLabel } from "@/lib/presentation";

export const dynamic = "force-dynamic";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const include = { student: true, items: { include: { sku: { include: { product: true } } } } } as const;
  const order = id === "demo"
    ? await prisma.order.findFirst({ orderBy: { createdAt: "desc" }, include })
    : await prisma.order.findFirst({ where: { OR: [{ id }, { orderNumber: id }] }, include });
  if (!order) notFound();

  const isApproved = order.status !== "DRAFT" && order.status !== "PENDING_APPROVAL" && order.status !== "CANCELLED";
  const isReady = order.status === "READY" || order.status === "PARTIALLY_RECEIVED" || order.status === "RECEIVED";
  const title = isReady ? "교복 수령이 가능해요" : isApproved ? "교복을 준비하고 있어요" : "주문 승인을 기다리고 있어요";
  const confirmedDate = order.approvedAt ?? order.createdAt;
  const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return <main className="mobile-shell order-page">
    <header><Link href="/"><ArrowLeft/></Link><strong>주문 현황</strong><i/></header>
    <section className="order-head"><p>{order.student.name} 학생 · {order.orderNumber}</p><h1>{title}</h1><span className="status-pill"><Clock3 size={15}/>{orderStatusLabel[order.status]}</span></section>
    <section className="timeline">
      <div className={isApproved ? "done" : "active"}><i><Check/></i><b>주문 확정</b><small>{confirmedDate.toLocaleDateString("ko-KR", { month: "long", day: "numeric" })}</small></div>
      <div className={isReady ? "done" : isApproved ? "active" : ""}><i><Package/></i><b>상품 준비</b><small>{isReady ? "완료" : isApproved ? "진행 중" : "준비 전"}</small></div>
      <div className={isReady ? "active" : ""}><i><Shirt/></i><b>수령 가능</b><small>{isReady ? "수령 가능" : "준비 전"}</small></div>
    </section>
    <section className="order-card"><div className="card-title"><h2>주문 품목</h2><span>{totalQuantity}개</span></div>
      {order.items.map((item) => { const status = orderItemStatus(item); return <div className="order-item" key={item.id}><div className="product-icon"><Shirt/></div><div><b>{item.sku.product.name}</b><p>사이즈 {item.sku.size} · {item.quantity}개</p></div><span className={status === "준비 완료" ? "ready" : ""}>{status}</span></div>; })}
    </section>
    <section className="notice"><b>{isReady ? "매장에서 주문번호를 보여주세요." : "모든 품목이 준비되면 알려드릴게요."}</b><p>{isReady ? "수령 처리 시 수령인 확인과 서명이 기록됩니다." : "준비 완료 문자를 받기 전에는 매장 방문을 잠시 기다려주세요."}</p></section>
  </main>;
}
