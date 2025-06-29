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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {events.map((event, index) => (
          <Card
            key={index}
            className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <CardHeader className="p-4">
              <CardTitle className="font-headline text-xl mb-1">
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
            <CardContent className="flex-grow space-y-2 p-4 pt-0 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{event.location}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
