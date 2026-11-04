import Link from "next/link";
import { BarChart3, Box, ClipboardList, PackageSearch, Settings, Shirt, Users } from "lucide-react";

export function Sidebar() { return <aside className="sidebar"><div className="brand inverse"><span>U</span> UNISIZE</div><p>매장 운영</p><nav>
  <Link className="active" href="/admin"><BarChart3/> 대시보드</Link><Link href="/admin/orders"><ClipboardList/> 주문 관리 <b>12</b></Link><Link href="/admin"><Users/> 학생 관리</Link><Link href="/admin"><Box/> 재고 관리</Link><Link href="/admin"><PackageSearch/> 발주·입고</Link><Link href="/admin"><Shirt/> 수선·명찰</Link>
  </nav><div className="sidebar-bottom"><Link href="/admin"><Settings/> 설정</Link><div className="profile"><span>관</span><div><b>관리자</b><small>최고 관리자</small></div></div></div></aside> }
