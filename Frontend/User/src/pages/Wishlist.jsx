import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Loader2, Star } from "lucide-react";

const Wishlist = () => {
  const { user, toggleWishlist } = useAuth();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistPlaces = async () => {
      if (!user?.wishlist?.length) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const results = await Promise.all(
          user.wishlist.map((id) => api.get(`/places/${id}`).then((res) => res.data))
        );
        setPlaces(results);
      } catch {
        toast.error("Failed to load wishlist places.");
      } finally {
        setLoading(false);
      }
    };
    fetchWishlistPlaces();
  }, [user?.wishlist]);

  const handleRemove = async (placeId) => {
    try {
      await toggleWishlist(placeId);
      setPlaces((prev) => prev.filter((p) => p._id !== placeId));
      toast.success("Removed from wishlist.");
    } catch {
      toast.error("Failed to remove from wishlist.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-50">
      <div className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-3">My Wishlist</h1>
          <p className="text-white/80 text-lg">Places you want to visit</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {places.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Heart className="size-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Your wishlist is empty</h3>
              <p className="text-muted-foreground mb-6">Start exploring and save places you love!</p>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link to="/">Explore Places</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {places.map((place) => (
              <Card key={place._id} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={() => handleRemove(place._id)}
                    className="absolute top-3 right-3 size-9 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <Heart className="size-4 fill-red-500 text-red-500" />
                  </button>
                  {place.rating > 0 && (
                    <Badge className="absolute bottom-3 left-3 bg-white/90 text-foreground border-0 backdrop-blur-sm">
                      <Star className="size-3 mr-1 fill-terracotta-500 text-terracotta-500" />
                      {place.rating}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-5">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
                    <MapPin className="size-3.5" />
                    <span>{place.region}</span>
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">{place.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{place.shortDescription || place.description?.substring(0, 100)}</p>
                  <div className="flex items-center justify-between">
                    <Button asChild variant="ghost" className="p-0 h-auto text-primary hover:text-primary/80">
                      <Link to={`/place/${place._id}`}>View Details</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRemove(place._id)}
                    >
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
