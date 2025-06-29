"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { LogOut, Users, BarChart3, UserCog, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/visitors", label: "Visitantes", icon: Users },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/users", label: "Usuários", icon: UserCog },
];

export default function AdminHeader() {
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname.startsWith("/dashboard")) return "Dashboard Geral";
    if (pathname.startsWith("/visitors")) return "Gerenciar Visitantes";
    if (pathname.startsWith("/users")) return "Gerenciar Usuários";
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
            className="h-10 w-10 dark:bg-white/90 dark:rounded-md p-0.5"
          />
          <div className="flex flex-col">
            <h1 className="text-lg md:text-xl font-headline font-bold text-foreground leading-tight">
              AD Belém - City Conceição - Setor 63
            </h1>
            <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">
              {getTitle()}
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Button
              key={link.href}
              variant={pathname.startsWith(link.href) ? "secondary" : "ghost"}
              size="sm"
              asChild
            >
              <Link href={link.href}>
                <link.icon className="mr-2 h-4 w-4" />
                {link.label}
              </Link>
            </Button>
          ))}
          <Button variant="outline" size="sm" asChild>
            <Link href="/login">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Link>
          </Button>
          <ThemeToggle />
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 p-4 border-b">
                   <Image
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Logo_Belem.png/500px-Logo_Belem.png"
                      alt="Logo AD Belém"
                      width={32}
                      height={32}
                      className="h-8 w-8 dark:bg-white/90 dark:rounded-md p-0.5"
                    />
                    <h2 className="font-headline font-bold text-lg">Menu</h2>
                </div>
                <nav className="flex flex-col gap-2 p-4">
                  {navLinks.map((link) => (
                    <SheetClose key={link.href} asChild>
                       <Link
                          href={link.href}
                          className={cn(
                              "flex items-center gap-3 rounded-md p-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                              pathname.startsWith(link.href) ? "bg-accent text-accent-foreground" : ""
                          )}
                        >
                          <link.icon className="h-5 w-5" />
                          {link.label}
                       </Link>
                    </SheetClose>
                  ))}
                  <SheetClose asChild>
                      <Link
                          href="/login"
                          className="flex items-center gap-3 rounded-md p-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                        >
                          <LogOut className="h-5 w-5" />
                          Sair
                       </Link>
                  </SheetClose>
                </nav>
                <div className="mt-auto p-4 border-t">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Mudar Tema</span>
                        <ThemeToggle />
                    </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
