import { Sidebar } from "@/components/sidebar";
import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireStaff();
  if (!user) redirect("/staff-login");
  const pendingOrders = await prisma.order.count({ where: { status: "PENDING_APPROVAL" } });
  return (
    <div className="min-h-screen bg-gray-050">
      <Sidebar user={{ name: user.name, role: user.role }} pendingOrders={pendingOrders} />
      <div className="sm:ml-50 max-w-400 px-3.5 py-5 sm:px-10 sm:py-8">{children}</div>
    </div>
  );
}
