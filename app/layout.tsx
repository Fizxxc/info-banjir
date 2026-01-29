import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Info Banjir Bekasi",
  description: "Pelaporan banjir realtime untuk wilayah Bekasi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
