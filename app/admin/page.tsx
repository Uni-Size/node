import Link from "next/link";
import { Bell, CheckCircle2, Clock3, Package, ShoppingBag, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { orderStatusLabel, statusVariant } from "@/lib/presentation";
import { WarningIcon } from "@/components/icons/icons";
import { Badge } from "@/components/ui/Badge";
import { Table, type Column } from "@/components/ui/Table";

export const dynamic = "force-dynamic";

// 지표 아이콘 색: 상태색 050 배경 + 600 아이콘 (unisize Status 규칙)
const tone = {
  blue: "bg-blue-050 text-blue-600",
  primary: "bg-primary-050 text-primary-500",
  green: "bg-green-050 text-green-600",
  yellow: "bg-yellow-050 text-yellow-600",
};

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

  const metrics = [
    { label: "오늘 등록 학생", value: todayStudents, unit: "명", note: "오늘 생성된 학생 기준", Icon: Users, tone: tone.blue },
    { label: "승인 대기 주문", value: pendingApproval, unit: "건", note: "확인이 필요해요", warn: true, Icon: ShoppingBag, tone: tone.primary },
    { label: "오늘 준비 완료", value: todayReady, unit: "건", note: `문자 발송 ${sentMessages}건`, Icon: CheckCircle2, tone: tone.green },
    { label: "가용재고 없는 품목", value: lowStock, unit: "SKU", note: "재고 확인 필요", warn: true, Icon: Package, tone: tone.yellow },
  ];

  const attention = [
    { label: "승인 대기 주문", desc: "승인을 기다리는 주문입니다.", value: pendingApproval, Icon: WarningIcon, tone: tone.yellow },
    { label: "진행 중인 작업", desc: "수선 또는 명찰 작업 중입니다.", value: activeWork, Icon: Clock3, tone: tone.primary },
    { label: "미입고 발주", desc: "입고가 완료되지 않은 발주입니다.", value: openPurchaseOrders, Icon: Package, tone: tone.blue },
  ];

  const columns: Column<(typeof recentOrders)[number]>[] = [
    { key: "orderNumber", header: "주문번호", render: (o) => <b className="font-semibold">{o.orderNumber}</b> },
    { key: "student", header: "학생", render: (o) => o.student.name },
    { key: "school", header: "학교", render: (o) => o.student.school.name },
    { key: "qty", header: "수량", align: "right", render: (o) => `${o.items.reduce((sum, item) => sum + item.quantity, 0)}개` },
    { key: "status", header: "상태", render: (o) => <Badge size="small" variant={statusVariant(o.status)}>{orderStatusLabel[o.status]}</Badge> },
  ];

  return (
    <>
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-20 sm:text-24 font-bold text-gray-900">매장 운영 현황</h1>
          <p className="mt-1 text-13 text-gray-500">데이터베이스에 기록된 실시간 현황입니다.</p>
        </div>
        <button type="button" aria-label="알림" className="relative grid place-items-center w-10.5 h-10.5 rounded-lg bg-white border border-gray-200 text-gray-700">
          <Bell className="w-4.5 h-4.5" />
          <span aria-hidden className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-7">
        {metrics.map(({ label, value, unit, note, warn, Icon, tone }) => (
          <article key={label} className="relative p-5 bg-white border border-gray-200 rounded-xl">
            <span className={`absolute top-4.5 right-4.5 grid place-items-center w-9.5 h-9.5 rounded-lg ${tone}`}><Icon className="w-4.5 h-4.5" /></span>
            <p className="text-13 text-gray-500">{label}</p>
            <h2 className="mt-3.5 mb-2 text-32 font-bold text-gray-900">{value} <small className="text-12 font-medium text-gray-500">{unit}</small></h2>
            <span className={`text-12 ${warn ? "text-yellow-700" : "text-green-700"}`}>{note}</span>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div>
          <div className="flex items-end justify-between mb-3">
            <div>
              <h2 className="text-16 font-semibold text-gray-900">최근 주문</h2>
              <p className="mt-1 text-12 text-gray-500">최신 주문과 처리 상태입니다.</p>
            </div>
            <Link href="/admin/orders" className="text-13 font-semibold text-primary-600">전체 보기</Link>
          </div>
          <Table columns={columns} data={recentOrders} getRowKey={(o) => o.id} emptyMessage="등록된 주문이 없습니다." />
        </div>

        <div className="bg-white border border-gray-200 rounded-xl self-start">
          <div className="px-5 py-5 border-b border-gray-200">
            <h2 className="text-16 font-semibold text-gray-900">처리가 필요해요</h2>
            <p className="mt-1 text-12 text-gray-500">DB에 기록된 운영 항목</p>
          </div>
          {attention.map(({ label, desc, value, Icon, tone }) => (
            <div key={label} className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 last:border-b-0">
              <span className={`grid place-items-center w-9 h-9 rounded-lg ${tone}`}><Icon className="w-4.5 h-4.5" /></span>
              <p className="flex-1">
                <b className="block text-13 font-semibold text-gray-900">{label}</b>
                <small className="block mt-0.5 text-11 text-gray-500">{desc}</small>
              </p>
              <strong className="text-18 font-bold text-gray-900">{value}</strong>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
