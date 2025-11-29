import { Calendar, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Event } from "@/types/event";

interface EventCardProps {
  event: Event;
  onViewDetails: (event: Event) => void;
}

export const EventCard = ({ event, onViewDetails }: EventCardProps) => {
  const isSoldOut = event.capacity === 0;

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-[var(--card-hover-shadow)] hover:-translate-y-1">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={event.file?.file_url}
          alt={event.title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
        />
        {isSoldOut && (
          <Badge className="absolute top-4 right-4 bg-destructive text-destructive-foreground font-semibold">
            Esgotado
          </Badge>
        )}
      </div>

      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-display font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{new Date(event.date).toLocaleDateString('pt-BR', { 
                day: '2-digit', 
                month: 'long', 
                year: 'numeric' 
              })}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>{event.time}</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-muted-foreground">A partir de</span>
            <span className="text-2xl font-display font-bold text-foreground">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(event.price)}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          onClick={() => onViewDetails(event)}
        >
          Ver Detalhes
        </Button>
      </CardFooter>
    </Card>
  );
};
