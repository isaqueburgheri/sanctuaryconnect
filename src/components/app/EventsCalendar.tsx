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
    title: "Sunday Morning Service",
    date: "Every Sunday",
    time: "10:00 AM - 11:30 AM",
    location: "Main Sanctuary",
    category: "Worship",
  },
  {
    title: "Youth Group Hangout",
    date: "Friday, October 27th",
    time: "7:00 PM - 9:00 PM",
    location: "Fellowship Hall",
    category: "Youth",
  },
  {
    title: "Community Outreach",
    date: "Saturday, November 4th",
    time: "9:00 AM - 12:00 PM",
    location: "Local Park",
    category: "Service",
  },
  {
    title: "Women's Bible Study",
    date: "Every Wednesday",
    time: "6:30 PM - 8:00 PM",
    location: "Room 101",
    category: "Study",
  },
];

export default function EventsCalendar() {
  return (
    <section>
      <h2 className="text-4xl font-headline font-bold mb-6 text-center lg:text-left">
        Upcoming Events
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
