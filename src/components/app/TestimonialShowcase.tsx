import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Quote, Heart } from "lucide-react";

const testimonials = [
  {
    quote: "Igreja maravilhosa, Pessoas abençoadas...",
    name: "Eliane Silva",
  },
  {
    quote: "Lugar de adoração ao senhor Jesus, onde todos são bem vindos.",
    name: "Ana Paula Souza",
  },
  {
    quote: "Um lugar abençoado pra adorar a Deus.",
    name: "Edson Pereira",
  },
  {
    quote: "Lugar de paz, onde sinto a presença de Deus.",
    name: "Lucinete Santos",
  },
];

export default function TestimonialShowcase() {
  return (
    <section className="mt-16 py-12">
      <div className="text-center mb-10">
        <Heart className="h-10 w-10 text-primary mx-auto mb-4" />
        <h2 className="text-4xl font-headline font-bold">
          Testemunhos da Nossa Igreja
        </h2>
        <p className="text-muted-foreground mt-2">
          Veja o que Deus tem feito na vida de nossos irmãos.
        </p>
      </div>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-5xl mx-auto"
      >
        <CarouselContent>
          {testimonials.map((testimonial, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1 h-full">
                <Card className="flex flex-col h-full justify-between shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="pt-6 relative">
                    <Quote className="absolute top-4 left-4 h-8 w-8 text-primary/20" />
                    <p className="pl-6 pt-6 italic text-foreground/80">
                      "{testimonial.quote}"
                    </p>
                  </CardContent>
                  <CardFooter>
                    <p className="font-bold font-headline text-primary">
                      - {testimonial.name}
                    </p>
                  </CardFooter>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:inline-flex" />
        <CarouselNext className="hidden sm:inline-flex" />
      </Carousel>
    </section>
  );
}
