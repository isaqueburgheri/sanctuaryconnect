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
    quote:
      "Finding this church felt like coming home. The community is so welcoming and I've grown so much in my faith here.",
    name: "Maria S.",
  },
  {
    quote:
      "The sermons are always so insightful and relevant to my life. I leave feeling inspired every single week.",
    name: "David L.",
  },
  {
    quote:
      "My kids love the youth program! It's a safe, fun, and faith-filled environment. We are so grateful.",
    name: "The Johnson Family",
  },
  {
    quote:
      "Through a difficult season, this church was my rock. The prayer support and genuine care I received was a true blessing.",
    name: "Eleanor P.",
  },
];

export default function TestimonialShowcase() {
  return (
    <section className="mt-16 py-12">
      <div className="text-center mb-10">
        <Heart className="h-10 w-10 text-primary mx-auto mb-4" />
        <h2 className="text-4xl font-headline font-bold">
          Words from Our Community
        </h2>
        <p className="text-muted-foreground mt-2">
          See what God is doing in the lives of our members.
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
                      {testimonial.quote}
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
