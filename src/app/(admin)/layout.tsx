import type { Metadata } from "next";
import AdminHeader from "@/components/app/AdminHeader";
import Footer from "@/components/app/Footer";

export const metadata: Metadata = {
  title: "Administração - AD Belém - Setor 63",
  description: "Painel administrativo.",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen bg-background font-body text-foreground">
      <AdminHeader />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
