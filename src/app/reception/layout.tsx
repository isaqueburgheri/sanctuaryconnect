import type { Metadata } from "next";
import ReceptionHeader from "@/components/app/ReceptionHeader";
import Footer from "@/components/app/Footer";

export const metadata: Metadata = {
  title: "Painel da Recepção - AD Belém - Setor 63",
  description: "Painel de recepção de visitantes.",
};

export default function ReceptionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen bg-background font-body text-foreground">
      <ReceptionHeader />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
