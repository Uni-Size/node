import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "유니사이즈", description: "교복 주문·재고 운영 관리" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
