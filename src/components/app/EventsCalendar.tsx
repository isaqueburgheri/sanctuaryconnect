import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const events = [
  {
    title: "Escola Bíblica Dominical",
    date: "Todo Domingo",
    time: "09:00 - 10:30",
    location: "Templo",
    category: "Ensino",
  },
  {
    title: "Culto da Família",
    date: "Todo Domingo",
    time: "18:00 - 20:00",
    location: "Templo",
    category: "Adoração",
  },
  {
    title: "Culto de Doutrina",
    date: "Toda Terça-feira",
    time: "19:30 - 21:00",
    location: "Templo",
    category: "Ensino",
  },
  {
    title: "Culto de Oração",
    date: "Toda Quinta-feira",
    time: "19:30 - 21:00",
    location: "Templo",
    category: "Oração",
  },
];

export default function EventsCalendar() {
  return (
    <section>
      <h2 className="text-4xl font-headline font-bold mb-6 text-center lg:text-left">
        Nossos Cultos
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event, index) => (
          <Card
            key={index}
            className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <CardHeader>
              <CardTitle className="font-headline text-2xl">
                {event.title}
              </CardTitle>
              <Badge
                variant="secondary"
                className="w-fit"
                style={{
                  backgroundColor: "hsl(var(--accent))",
                  color: "hsl(var(--accent-foreground))",
                }}
              >
                {event.category}
              </Badge>
            </CardHeader>
            <CardContent className="flex-grow space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="h-5 w-5 text-primary" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Clock className="h-5 w-5 text-primary" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary" />
                <span>{event.location}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
