import VisitorCheckinForm from "@/components/app/VisitorCheckinForm";

export default function ReceptionDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <section className="text-center mb-12 md:mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold font-headline text-primary tracking-tight">
          Painel da Recepção
        </h2>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          Use o formulário abaixo para registrar novos visitantes.
        </p>
      </section>

      <div className="max-w-3xl mx-auto">
        <VisitorCheckinForm />
      </div>
    </div>
  );
}
