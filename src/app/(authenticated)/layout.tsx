import type { Metadata } from "next";
import AuthenticatedHeader from "@/components/app/AuthenticatedHeader";
import Footer from "@/components/app/Footer";

export const metadata: Metadata = {
  title: "Painel - AD Belém - Setor 63",
  description: "Painel de administração e recepção.",
};

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen bg-background font-body text-foreground">
      <AuthenticatedHeader />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
