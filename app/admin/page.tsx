import Link from "next/link";
import { AlertTriangle, Bell, CheckCircle2, Clock3, Package, ShoppingBag, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { orderStatusLabel, statusClass } from "@/lib/presentation";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const [todayStudents, pendingApproval, todayReady, sentMessages, inventory, recentOrders, activeWork, openPurchaseOrders] = await Promise.all([
    prisma.student.count({ where: { createdAt: { gte: startOfDay } } }),
    prisma.order.count({ where: { status: "PENDING_APPROVAL" } }),
    prisma.order.count({ where: { readyAt: { gte: startOfDay } } }),
    prisma.messageLog.count({ where: { createdAt: { gte: startOfDay }, status: "SENT" } }),
    prisma.inventory.findMany({ select: { onHand: true, reserved: true } }),
    prisma.order.findMany({ take: 5, orderBy: { createdAt: "desc" }, include: { student: { include: { school: true } }, items: { select: { quantity: true } } } }),
    prisma.orderItem.count({ where: { OR: [{ alteration: "IN_PROGRESS" }, { nameTag: "IN_PROGRESS" }] } }),
    prisma.purchaseOrder.count({ where: { receivedAt: null, status: { not: "DRAFT" } } }),
  ]);
  const lowStock = inventory.filter((item) => item.onHand - item.reserved <= 0).length;

  return <>
    <header className="admin-top"><div><h1>매장 운영 현황</h1><p>데이터베이스에 기록된 실시간 현황입니다.</p></div><button className="icon-button" aria-label="알림"><Bell/><i/></button></header>
    <section className="metric-grid">
      <article><div className="metric-icon blue"><Users/></div><p>오늘 등록 학생</p><h2>{todayStudents} <small>명</small></h2><span>오늘 생성된 학생 기준</span></article>
      <article><div className="metric-icon purple"><ShoppingBag/></div><p>승인 대기 주문</p><h2>{pendingApproval} <small>건</small></h2><span className="warn">확인이 필요해요</span></article>
      <article><div className="metric-icon green"><CheckCircle2/></div><p>오늘 준비 완료</p><h2>{todayReady} <small>건</small></h2><span>문자 발송 {sentMessages}건</span></article>
      <article><div className="metric-icon orange"><Package/></div><p>가용재고 없는 품목</p><h2>{lowStock} <small>SKU</small></h2><span className="warn">재고 확인 필요</span></article>
    </section>
    <section className="admin-grid"><div className="panel orders-panel"><div className="panel-head"><div><h2>최근 주문</h2><p>최신 주문과 처리 상태입니다.</p></div><Link href="/admin/orders">전체 보기</Link></div><table><thead><tr><th>주문번호</th><th>학생</th><th>학교</th><th>수량</th><th>상태</th></tr></thead><tbody>{recentOrders.map((order)=><tr key={order.id}><td><b>{order.orderNumber}</b></td><td>{order.student.name}</td><td>{order.student.school.name}</td><td>{order.items.reduce((sum,item)=>sum+item.quantity,0)}개</td><td><span className={`table-status ${statusClass(order.status)}`}>{orderStatusLabel[order.status]}</span></td></tr>)}</tbody></table>{recentOrders.length===0&&<p className="empty-state">등록된 주문이 없습니다.</p>}</div>
      <div className="panel attention"><div className="panel-head"><div><h2>처리가 필요해요</h2><p>DB에 기록된 운영 항목</p></div></div><div><span className="alert-icon"><AlertTriangle/></span><p><b>승인 대기 주문</b><small>승인을 기다리는 주문입니다.</small></p><strong>{pendingApproval}</strong></div><div><span className="clock-icon"><Clock3/></span><p><b>진행 중인 작업</b><small>수선 또는 명찰 작업 중입니다.</small></p><strong>{activeWork}</strong></div><div><span className="box-icon"><Package/></span><p><b>미입고 발주</b><small>입고가 완료되지 않은 발주입니다.</small></p><strong>{openPurchaseOrders}</strong></div></div></section>
  </>;
}
