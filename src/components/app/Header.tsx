import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { LogIn } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Logo_Belem.png/500px-Logo_Belem.png"
            alt="Logo AD Belém"
            width={40}
            height={40}
            className="h-10 w-10"
          />
          <h1 className="text-xl md:text-3xl font-headline font-bold text-foreground">
            AD Belém - Setor 63
          </h1>
        </Link>
        <nav>
          <Button asChild>
            <Link href="/login">
              <LogIn />
              Acesso Restrito
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
