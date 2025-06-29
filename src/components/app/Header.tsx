import { Cross } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <Cross className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-headline font-bold text-foreground">
            AD Belém - Setor 63
          </h1>
        </Link>
        <nav>{/* A navegação pode ser adicionada aqui */}</nav>
      </div>
    </header>
  );
}
