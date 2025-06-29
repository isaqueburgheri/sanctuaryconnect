import VisitorCheckinForm from "@/components/app/VisitorCheckinForm";
import PrayerRequestForm from "@/components/app/PrayerRequestForm";

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <section className="text-center mb-12 md:mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold font-headline text-primary tracking-tight">
          Bem-vindo(a) à Recepção
        </h2>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          Use os formulários abaixo para registrar novos visitantes e anotar
          pedidos de oração.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3 space-y-12">
          <VisitorCheckinForm />
        </div>
        <div className="lg:col-span-2 space-y-12">
          <PrayerRequestForm />
        </div>
      </div>
    </div>
  );
}
