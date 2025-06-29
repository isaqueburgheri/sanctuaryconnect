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
    title: "Culto de Domingo de Manhã",
    date: "Todo Domingo",
    time: "10:00 - 11:30",
    location: "Santuário Principal",
    category: "Adoração",
  },
  {
    title: "Encontro do Grupo de Jovens",
    date: "Sexta-feira, 27 de Outubro",
    time: "19:00 - 21:00",
    location: "Salão de Confraternização",
    category: "Jovens",
  },
  {
    title: "Ação Comunitária",
    date: "Sábado, 4 de Novembro",
    time: "09:00 - 12:00",
    location: "Parque Local",
    category: "Serviço",
  },
  {
    title: "Estudo Bíblico Feminino",
    date: "Toda Quarta-feira",
    time: "18:30 - 20:00",
    location: "Sala 101",
    category: "Estudo",
  },
];

export default function EventsCalendar() {
  return (
    <section>
      <h2 className="text-4xl font-headline font-bold mb-6 text-center lg:text-left">
        Próximos Eventos
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
