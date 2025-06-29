import PrayerRequestList from "@/components/app/PrayerRequestList";

export default function PrayerRequestPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <section className="text-center mb-12 md:mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold font-headline text-primary tracking-tight">
          Pedidos de Oração
        </h2>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          Visualize os pedidos de oração enviados pelos visitantes do site.
        </p>
      </section>
      <PrayerRequestList />
    </div>
  );
}
