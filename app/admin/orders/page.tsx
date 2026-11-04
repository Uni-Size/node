import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { orderStatusLabel, statusClass } from "@/lib/presentation";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const [orders, total, pending, preparing, ready] = await Promise.all([
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, include: { student: { include: { school: true } }, items: true } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING_APPROVAL" } }),
    prisma.order.count({ where: { status: { in: ["APPROVED", "ALLOCATED", "PREPARING"] } } }),
    prisma.order.count({ where: { status: "READY" } }),
  ]);
  return <>
    <header className="admin-top"><div><h1>주문 관리</h1><p>데이터베이스에 등록된 주문을 관리합니다.</p></div><Link href="/admin" className="ghost-button">대시보드</Link></header>
    <section className="panel orders-list"><div className="orders-toolbar"><div className="search-box"><Search/><input placeholder="주문번호, 학생 이름 검색" disabled/></div><button className="secondary-button" disabled><SlidersHorizontal/> 필터</button></div>
      <div className="tabs"><b>전체 <span>{total}</span></b><span>승인 대기 {pending}</span><span>준비 중 {preparing}</span><span>수령 가능 {ready}</span></div>
      <table><thead><tr><th>주문번호</th><th>학생</th><th>학교</th><th>품목</th><th>금액</th><th>상태</th></tr></thead><tbody>{orders.map((order)=><tr key={order.id}><td><Link href={`/order/${order.id}`}><b>{order.orderNumber}</b></Link></td><td>{order.student.name}</td><td>{order.student.school.name}</td><td>{order.items.reduce((sum,item)=>sum+item.quantity,0)}개</td><td>{order.items.reduce((sum,item)=>sum+item.quantity*item.unitPrice,0).toLocaleString("ko-KR")}원</td><td><span className={`table-status ${statusClass(order.status)}`}>{orderStatusLabel[order.status]}</span></td></tr>)}</tbody></table>
      {orders.length===0&&<p className="empty-state">등록된 주문이 없습니다.</p>}
    </section>
  </>;
}
