import Header from "@/components/app/Header";
import EventsCalendar from "@/components/app/EventsCalendar";
import TestimonialShowcase from "@/components/app/TestimonialShowcase";
import Footer from "@/components/app/Footer";
import PrayerRequestForm from "@/components/app/PrayerRequestForm";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-body text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <section className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold font-headline text-primary tracking-tight">
            Bem-vindo à Casa do Senhor
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            Um lugar de fé, comunhão e adoração. Estamos felizes com a sua visita.
          </p>
        </section>

        <EventsCalendar />
        <TestimonialShowcase />
        <div className="mt-16 max-w-3xl mx-auto">
          <PrayerRequestForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
