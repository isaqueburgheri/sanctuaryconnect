import { Cross, Facebook, MapPin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground border-t mt-12">
      <div className="container mx-auto py-8 px-4 text-center">
        <div className="flex justify-center items-center gap-3 mb-4">
          <Cross className="h-6 w-6 text-primary" />
          <p className="font-headline font-bold text-lg">
            AD Belém - Setor 63 (Sítio Conceição)
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>R. Sítio Conceição, 201 - Cidade Tiradentes, São Paulo</span>
          </div>
          <Link
            href="https://www.facebook.com/adbelemcidadetiradentes63"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <Facebook className="h-4 w-4" />
            <span>Nossa Página no Facebook</span>
          </Link>
        </div>
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} AD Belém - Setor 63. Todos os Direitos
          Reservados.
        </p>
      </div>
    </footer>
  );
}
