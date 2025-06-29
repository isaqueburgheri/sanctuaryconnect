import VisitorList from "@/components/app/VisitorList";

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <section className="text-center mb-12 md:mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold font-headline text-primary tracking-tight">
          Painel Administrativo
        </h2>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          Visualize os visitantes registrados para o anúncio.
        </p>
      </section>
      <VisitorList />
    </div>
  );
}
