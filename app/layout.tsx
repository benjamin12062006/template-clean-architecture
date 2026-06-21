import type { Metadata } from "next";
import { AppLayout } from "@ui/components/layout/app-layout.component";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hexagonal UI Template",
  description: "Base frontend hexagonal para UI profesional en Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppLayout>{children}</AppLayout>;
}
