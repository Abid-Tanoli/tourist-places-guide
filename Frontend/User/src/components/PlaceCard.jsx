import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, ChevronRight } from "lucide-react";

const PlaceCard = ({ place }) => {
  const placeId = place._id || place.id;

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div className="relative h-52 overflow-hidden">
        <img
          src={place.image}
          alt={place.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {place.rating > 0 && (
          <Badge className="absolute top-3 right-3 bg-white/90 text-foreground border-0 backdrop-blur-sm">
            <Star className="size-3 mr-1 fill-terracotta-500 text-terracotta-500" />
            {place.rating}
          </Badge>
        )}
      </div>
      <CardContent className="p-5">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
          <MapPin className="size-3.5" />
          <span>{place.region || "Pakistan"}</span>
        </div>
        <h2 className="font-semibold text-lg text-foreground mb-1">{place.name}</h2>
        {place.category && (
          <Badge variant="secondary" className="mb-3 text-xs">{place.category}</Badge>
        )}
        <Button asChild variant="ghost" className="p-0 h-auto text-primary hover:text-primary/80 mt-2">
          <Link to={`/place/${placeId}`}>
            View Details <ChevronRight className="size-4 ml-1" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default PlaceCard;
