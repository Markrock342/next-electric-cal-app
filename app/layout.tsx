import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Electric Calculator",
  description: "คำนวณค่าไฟฟ้ารายเดือน",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
