"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, Users, BarChart3 } from "lucide-react";
import { usePathname } from "next/navigation";

export default function AdminHeader() {
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname.startsWith("/dashboard")) return "Dashboard Geral";
    if (pathname.startsWith("/visitors")) return "Gerenciar Visitantes";
    return "Painel Administrativo";
  };

  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Logo_Belem.png/500px-Logo_Belem.png"
            alt="Logo AD Belém"
            width={40}
            height={40}
            className="h-10 w-10"
          />
          <div className="flex flex-col">
            <h1 className="text-lg md:text-xl font-headline font-bold text-foreground leading-tight">
              AD Belém - Setor 63
            </h1>
            <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">
              {getTitle()}
            </p>
          </div>
        </div>
        <nav className="flex items-center gap-2">
          <Button
            variant={pathname.startsWith("/dashboard") ? "secondary" : "ghost"}
            size="sm" asChild
          >
            <Link href="/dashboard">
              <BarChart3 />
              Dashboard
            </Link>
          </Button>
          <Button
            variant={pathname.startsWith("/visitors") ? "secondary" : "ghost"}
            size="sm" asChild
          >
            <Link href="/visitors">
              <Users />
              Visitantes
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/login">
              <LogOut />
              Sair
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
