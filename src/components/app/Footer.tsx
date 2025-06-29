import { Church, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground border-t mt-12">
      <div className="container mx-auto py-8 px-4 text-center">
        <div className="flex justify-center items-center gap-2 mb-4">
          <Church className="h-6 w-6 text-primary" />
          <p className="font-headline font-bold text-lg">
            Igreja Conexão Santuário
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>contact@sanctuaryconnect.org</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>(555) 123-4567</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Conexão Santuário. Todos os Direitos
          Reservados.
        </p>
      </div>
    </footer>
  );
}
