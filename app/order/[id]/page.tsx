import { notFound, redirect } from "next/navigation";
import { Check, Clock3, Package, Shirt } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { orderItemStatus, orderStatusLabel, statusVariant } from "@/lib/presentation";
import { MobileShell } from "@/components/mobile-shell";
import { Badge } from "@/components/ui/Badge";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

type StepState = "done" | "active" | "todo";
const stepCircle: Record<StepState, string> = {
  done: "bg-primary-500 text-white",
  active: "bg-primary-500 text-white ring-4 ring-primary-100",
  todo: "bg-gray-100 text-gray-400",
};

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/visit");
  const include = { student: true, items: { include: { sku: { include: { product: true } } } } } as const;
  const order = await prisma.order.findFirst({ where: { OR: [{ id }, { orderNumber: id }] }, include });
  if (!order) notFound();
  const isStaff = user.role === "ADMIN" || user.role === "STAFF";
  if (!isStaff && order.student.userId !== user.id) notFound();

  const isApproved = order.status !== "DRAFT" && order.status !== "PENDING_APPROVAL" && order.status !== "CANCELLED";
  const isReady = order.status === "READY" || order.status === "PARTIALLY_RECEIVED" || order.status === "RECEIVED";
  const title = isReady ? "교복 수령이 가능해요" : isApproved ? "교복을 준비하고 있어요" : "주문 승인을 기다리고 있어요";
  const confirmedDate = order.approvedAt ?? order.createdAt;
  const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);

  const steps: { label: string; sub: string; state: StepState; Icon: typeof Check }[] = [
    { label: "주문 확정", sub: confirmedDate.toLocaleDateString("ko-KR", { month: "long", day: "numeric" }), state: isApproved ? "done" : "active", Icon: Check },
    { label: "상품 준비", sub: isReady ? "완료" : isApproved ? "진행 중" : "준비 전", state: isReady ? "done" : isApproved ? "active" : "todo", Icon: Package },
    { label: "수령 가능", sub: isReady ? "수령 가능" : "준비 전", state: isReady ? "active" : "todo", Icon: Shirt },
  ];

  return (
    <MobileShell backHref="/" title={<strong className="text-16 font-semibold text-gray-900">주문 현황</strong>} className="bg-gray-050">
      <section className="bg-white px-6 pt-8 pb-7">
        <p className="text-13 text-gray-500">{order.student.name} 학생 · {order.orderNumber}</p>
        <h1 className="mt-2 mb-4 text-24 font-bold text-gray-900 break-keep">{title}</h1>
        <Badge variant={statusVariant(order.status)}>
          <Clock3 className="w-3.5 h-3.5 mr-1" />
          {orderStatusLabel[order.status]}
        </Badge>
      </section>

      <ol className="flex bg-white px-5 pb-8">
        {steps.map(({ label, sub, state, Icon }, i) => (
          <li key={label} className="relative flex-1 text-center">
            {i < steps.length - 1 && <span aria-hidden className="absolute top-4 left-[69%] w-[62%] h-0.5 bg-gray-100" />}
            <span className={`relative z-10 grid place-items-center w-8.5 h-8.5 mx-auto rounded-full ${stepCircle[state]}`}><Icon className="w-4 h-4" /></span>
            <b className="block mt-2 text-12 font-semibold text-gray-900">{label}</b>
            <small className="block mt-0.5 text-11 text-gray-500">{sub}</small>
          </li>
        ))}
      </ol>

      <section className="mt-2.5 bg-white p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-17 font-semibold text-gray-900">주문 품목</h2>
          <span className="text-12 text-gray-500">{totalQuantity}개</span>
        </div>
        {order.items.map((item) => {
          const status = orderItemStatus(item);
          return (
            <div key={item.id} className="flex items-center gap-3 py-4 border-t border-gray-100">
              <span className="grid place-items-center w-11 h-11 rounded-lg bg-primary-050 text-primary-500"><Shirt className="w-5 h-5" /></span>
              <div className="flex-1">
                <b className="text-14 font-semibold text-gray-900">{item.sku.product.name}</b>
                <p className="mt-1 text-12 text-gray-500">사이즈 {item.sku.size} · {item.quantity}개</p>
              </div>
              <Badge size="small" variant={status === "준비 완료" ? "success" : "warning"}>{status}</Badge>
            </div>
          );
        })}
      </section>

      <section className="mt-2.5 bg-white p-6">
        <b className="text-14 font-semibold text-gray-900">{isReady ? "매장에서 주문번호를 보여주세요." : "모든 품목이 준비되면 알려드릴게요."}</b>
        <p className="mt-2 text-13 leading-relaxed text-gray-500 break-keep">{isReady ? "수령 처리 시 수령인 확인과 서명이 기록됩니다." : "준비 완료 문자를 받기 전에는 매장 방문을 잠시 기다려주세요."}</p>
      </section>
    </MobileShell>
  );
}
