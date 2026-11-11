'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Box, ClipboardList, PackageSearch, Settings, Shirt, Users } from "lucide-react";
import { Brand } from "@/components/brand";
import { Badge } from "@/components/ui/Badge";

// 아직 화면이 없는 메뉴는 원본처럼 /admin으로 보내고, 활성 표시는 하지 않는다(soon).
const menu = [
  { href: "/admin", label: "대시보드", Icon: BarChart3 },
  { href: "/admin/orders", label: "주문 관리", Icon: ClipboardList },
  { href: "/admin", label: "학생 관리", Icon: Users, soon: true },
  { href: "/admin", label: "재고 관리", Icon: Box, soon: true },
  { href: "/admin", label: "발주·입고", Icon: PackageSearch, soon: true },
  { href: "/admin", label: "수선·명찰", Icon: Shirt, soon: true },
];

// unisize-front AdminSidebar와 같은 모양: 연한 primary 패널, 활성 메뉴 gray-900 / 비활성 gray-300
const item = (active: boolean) =>
  `flex items-center gap-2.5 h-10 px-2.5 text-15 font-medium transition-colors duration-200 hover:text-gray-900 ${active ? "text-gray-900" : "text-gray-300"}`;

export function Sidebar({ user, pendingOrders }: { user: { name: string; role: "ADMIN" | "STAFF" | "CUSTOMER" }; pendingOrders: number }) {
  const pathname = usePathname();
  return (
    <aside className="fixed top-2 bottom-2 left-0 w-50 hidden sm:flex flex-col gap-6 pl-3 pr-2 py-5 bg-primary-050 border border-primary-100 rounded-r-lg shadow-sm">
      <Link href="/admin" className="px-2.5"><Brand small /></Link>
      <nav className="flex flex-col flex-1">
        {menu.map(({ href, label, Icon, soon }) => (
          <Link key={label} href={href} className={item(!soon && pathname === href)}>
            <Icon className="w-4.5 h-4.5 shrink-0" />
            {label}
            {label === "주문 관리" && pendingOrders > 0 && <span className="ml-auto"><Badge variant="warning" size="small">{pendingOrders}</Badge></span>}
          </Link>
        ))}
      </nav>
      <div className="border-t border-primary-100 pt-2">
        <Link href="/admin" className={item(false)}>
          <Settings className="w-4.5 h-4.5 shrink-0" /> 설정
        </Link>
        <form action="/api/auth/logout" method="post"><button className="w-full text-left px-2.5 h-9 text-12 text-gray-500 hover:text-gray-900">로그아웃</button></form>
        <div className="flex items-center gap-2.5 px-2.5 pt-3">
          <span className="grid place-items-center w-8 h-8 rounded-full bg-primary-100 text-primary-900 text-13 font-bold">{user.name.slice(0, 1)}</span>
          <div>
            <b className="block text-12 font-semibold text-gray-900">{user.name}</b>
            <small className="block text-11 text-gray-500">{user.role === "ADMIN" ? "최고 관리자" : "스태프"}</small>
          </div>
        </div>
      </div>
    </aside>
  );
}
