import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { orderStatusLabel, statusVariant } from "@/lib/presentation";
import { buttonClass, Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Table, type Column } from "@/components/ui/Table";
import { OrderActions } from "@/components/order-actions";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const [orders, total, pending, preparing, ready] = await Promise.all([
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, include: { student: { include: { school: true } }, items: true } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING_APPROVAL" } }),
    prisma.order.count({ where: { status: { in: ["APPROVED", "ALLOCATED", "PREPARING"] } } }),
    prisma.order.count({ where: { status: "READY" } }),
  ]);

  const tabs = [["전체", total], ["승인 대기", pending], ["준비 중", preparing], ["수령 가능", ready]] as const;

  const columns: Column<(typeof orders)[number]>[] = [
    { key: "orderNumber", header: "주문번호", render: (o) => <Link href={`/order/${o.id}`} className="font-semibold text-primary-600 hover:underline">{o.orderNumber}</Link> },
    { key: "student", header: "학생", render: (o) => o.student.name },
    { key: "school", header: "학교", render: (o) => o.student.school.name },
    { key: "qty", header: "품목", align: "right", render: (o) => `${o.items.reduce((sum, item) => sum + item.quantity, 0)}개` },
    { key: "amount", header: "금액", align: "right", render: (o) => `${o.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0).toLocaleString("ko-KR")}원` },
    { key: "status", header: "상태", render: (o) => <Badge size="small" variant={statusVariant(o.status)}>{orderStatusLabel[o.status]}</Badge> },
    { key: "action", header: "처리", render: (o) => <OrderActions id={o.id} status={o.status} /> },
  ];

  return (
    <>
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-20 sm:text-24 font-bold text-gray-900">주문 관리</h1>
          <p className="mt-1 text-13 text-gray-500">데이터베이스에 등록된 주문을 관리합니다.</p>
        </div>
        <Link href="/admin" className={buttonClass("outline", "small")}>대시보드</Link>
      </header>

      <section className="mt-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="w-full sm:w-80"><Input size="sm" fullWidth placeholder="주문번호, 학생 이름 검색" disabled aria-label="주문 검색" /></div>
          <Button variant="outline" size="small" disabled className="h-9!">
            <SlidersHorizontal className="w-4 h-4" /> 필터
          </Button>
        </div>
        <nav className="flex gap-6 mt-4 mb-3 border-b border-gray-200 text-13 overflow-x-auto" aria-label="주문 상태">
          {tabs.map(([label, count], i) => (
            <span key={label} className={`flex items-center gap-1.5 pb-2.5 whitespace-nowrap ${i === 0 ? "-mb-px border-b-2 border-primary-900 font-semibold text-primary-900" : "text-gray-500"}`}>
              {label} <span className="px-1.5 rounded-full bg-gray-100 text-11 text-gray-600">{count}</span>
            </span>
          ))}
        </nav>
        <Table columns={columns} data={orders} getRowKey={(o) => o.id} emptyMessage="등록된 주문이 없습니다." />
      </section>
    </>
  );
}
