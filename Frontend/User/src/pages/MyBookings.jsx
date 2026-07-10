import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, CalendarCheck, Users, MapPin } from "lucide-react";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/bookings/my-bookings");
      setBookings(data);
    } catch (err) {
      toast.error("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const statusColor = (status) => {
    const colors = {
      pending: "bg-amber-100 text-amber-700 border-amber-200",
      confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
      completed: "bg-blue-100 text-blue-700 border-blue-200",
    };
    return colors[status] || "bg-gray-100 text-gray-700 border-gray-200";
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
          <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-3">My Bookings</h1>
          <p className="text-white/80 text-lg">Manage your tour reservations</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {bookings.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <CalendarCheck className="size-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No bookings yet</h3>
              <p className="text-muted-foreground mb-6">You haven&apos;t made any bookings yet. Start exploring our tours!</p>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link to="/tours">Browse Tours</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {booking.tour?.name || booking.selectedTour || "Tour"}
                        </h3>
                        <Badge className={`border ${statusColor(booking.status)}`}>
                          {booking.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Booked on {new Date(booking.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Users className="size-3.5" />
                          <span>{booking.userType === "pakistani" ? "Pakistani" : "Foreigner"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="size-3.5" />
                          <span>{booking.guests?.adults || 1} Adult{(booking.guests?.adults || 1) > 1 ? "s" : ""}</span>
                        </div>
                        {booking.guests?.children > 0 && (
                          <div className="flex items-center gap-1.5">
                            <Users className="size-3.5" />
                            <span>{booking.guests.children} Child{booking.guests.children > 1 ? "ren" : ""}</span>
                          </div>
                        )}
                      </div>
                      {booking.notes && (
                        <p className="text-sm text-muted-foreground mt-2 italic">"{booking.notes}"</p>
                      )}
                    </div>
                    {booking.payment?.amount > 0 && (
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary">PKR {booking.payment.amount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Total</p>
                      </div>
                    )}
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

export default MyBookings;
