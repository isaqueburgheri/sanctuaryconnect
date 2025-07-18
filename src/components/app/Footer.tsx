import { Facebook, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground border-t mt-12">
      <div className="container mx-auto py-8 px-4 text-center">
        <div className="flex justify-center items-center gap-3 mb-4">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Logo_Belem.png/500px-Logo_Belem.png"
            alt="Logo AD Belém"
            width={24}
            height={24}
            className="h-6 w-6"
          />
          <p className="font-headline font-bold text-lg">
            AD Belém - City Conceição - Setor 63
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mb-4 text-sm">
          <Link
            href="https://maps.app.goo.gl/mh2WGv8zKaZPib2s8"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <MapPin className="h-4 w-4" />
            <span>
              R. Wilson Fernando São Carvalho, 40
            </span>
          </Link>
          <Link
            href="https://www.facebook.com/adbelemcidadetiradentes63/?locale=pt_BR"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <Facebook className="h-4 w-4" />
            <span>Nossa Página no Facebook</span>
          </Link>
        </div>
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} AD Belém - City Conceição - Setor 63. Todos os Direitos
          Reservados.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Desenvolvido por{" "}
          <Link
            href="https://www.linkedin.com/in/isaque-s-burgheri-07539a9a/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors underline"
          >
            Isaque S. Burgheri
          </Link>
        </p>
      </div>
    </footer>
  );
}
