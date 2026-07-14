import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  CreditCard,
  Smartphone,
  Banknote,
  Loader2,
} from "lucide-react";

const getApiError = (error, fallback) => {
  const apiErrors = error.response?.data?.errors;
  if (apiErrors?.length) return apiErrors[0].message;
  return error.response?.data?.message || fallback;
};

const getTourPrice = (tour, userType) => {
  const basePrice = userType === "foreigner"
    ? (Number(tour?.foreignerPrice || 0) || Number(tour?.price || 0))
    : (Number(tour?.pakistaniPrice || 0) || Number(tour?.price || 0));
  const discount = Number(tour?.discount || 0);
  return discount > 0 ? Math.round(basePrice * (1 - discount / 100)) : basePrice;
};

const Booking = () => {
  const { user, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const [tours, setTours] = useState([]);
  const [selectedTour, setSelectedTour] = useState("");
  const [selectedDeparture, setSelectedDeparture] = useState("");
  const [userType, setUserType] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [passport, setPassport] = useState("");
  const [cnic, setCnic] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [createdBooking, setCreatedBooking] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await api.get("/tours");
        const toursArray = Array.isArray(data) ? data : data.tours || [];
        setTours(toursArray);
        const tourParam = searchParams.get("tour");
        if (tourParam && toursArray.some((t) => t._id === tourParam)) {
          setSelectedTour(tourParam);
        }
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load tours.");
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, [searchParams]);

  const resetForm = () => {
    setSelectedTour("");
    setSelectedDeparture("");
    setUserType("");
    if (!isAuthenticated) {
      setName("");
      setEmail("");
      setPhone("");
    }
    setPassport("");
    setCnic("");
    setAdults(1);
    setChildren(0);
    setNotes("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedTour || !userType || !name.trim() || !email || !phone) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (userType === "pakistani" && !cnic) {
      toast.error("CNIC is required for Pakistani visitors.");
      return;
    }
    if (userType === "foreigner" && !passport) {
      toast.error("Passport number is required for foreign visitors.");
      return;
    }

    const selectedTourDetails = tours.find((tour) => tour._id === selectedTour);

    // Build departure data
    let departureData = {};
    if (selectedDeparture && selectedTourDetails?.departures) {
      const dep = selectedTourDetails.departures.find((d) => d._id === selectedDeparture);
      if (dep) {
        departureData = {
          departure: {
            departureId: dep._id,
            date: dep.date,
            time: dep.time || "",
          },
        };
      }
    }

    try {
      setSubmitting(true);
      const { data } = await api.post("/bookings", {
        tour: selectedTour,
        selectedTour: selectedTourDetails?.name,
        userType,
        name,
        email,
        phone,
        cnic,
        passport,
        guests: { adults: Number(adults), children: Number(children) },
        notes,
        ...departureData,
      });
      setCreatedBooking({ ...data, tour: selectedTourDetails });
      toast.success("Booking created! Choose a payment method below.");
    } catch (requestError) {
      toast.error(getApiError(requestError, "Unable to submit booking."));
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayment = async () => {
    if (!createdBooking) return;
    setProcessingPayment(true);

    try {
      if (paymentMethod === "cod") {
        await api.post("/payment/confirm-cod", { bookingId: createdBooking._id });
        toast.success("Booking confirmed! Pay on arrival.");
        setCreatedBooking(null);
        resetForm();
      } else if (paymentMethod === "stripe") {
        const { data } = await api.post("/payment/create-intent", { bookingId: createdBooking._id });
        toast.success(`Stripe payment of PKR ${data.amount.toLocaleString()} initiated. (Demo mode)`);
        await api.post("/payment/confirm", { paymentIntentId: data.paymentIntentId });
        toast.success("Payment confirmed!");
        setCreatedBooking(null);
        resetForm();
      } else if (paymentMethod === "easypaisa") {
        const { data } = await api.post("/payment/easypaisa", { bookingId: createdBooking._id, phone });
        toast.success(data.instructions || "EasyPaisa payment initiated.");
        setCreatedBooking(null);
        resetForm();
      } else if (paymentMethod === "jazzcash") {
        const { data } = await api.post("/payment/jazzcash", { bookingId: createdBooking._id, phone });
        toast.success(data.instructions || "JazzCash payment initiated.");
        setCreatedBooking(null);
        resetForm();
      }
    } catch (requestError) {
      toast.error(getApiError(requestError, "Payment failed."));
    } finally {
      setProcessingPayment(false);
    }
  };

  const selectedTourDetails = tours.find((tour) => tour._id === selectedTour);
  const availableDepartures = selectedTourDetails?.departures?.filter((d) => d.status === "active" && (d.capacity - d.bookedSeats) > 0) || [];
  const adultCount = Number(adults || 0);
  const guestLabel = `${adultCount} adult${adultCount === 1 ? "" : "s"}`;
  const totalPrice = selectedTourDetails ? getTourPrice(selectedTourDetails, userType) * adultCount : 0;

  return (
    <div className="min-h-screen bg-sand-50">
      <div className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-3">Book Your Tour</h1>
          <p className="text-white/80 text-lg">Complete the form below to reserve your spot</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {loading && (
          <Card>
            <CardContent className="p-6 text-center">
              <Loader2 className="size-6 animate-spin text-primary mx-auto mb-2" />
              <p className="text-muted-foreground">Loading tours...</p>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="border-destructive">
            <CardContent className="p-4 text-destructive text-center">{error}</CardContent>
          </Card>
        )}

        {createdBooking ? (
          <div className="space-y-6">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="size-6 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-800">Booking Created Successfully!</h3>
                    <p className="text-sm text-green-700 mt-1">
                      Tour: {createdBooking.tour?.name || createdBooking.selectedTour} | Total: PKR {totalPrice.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Select Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { id: "cod", label: "Cash on Arrival", desc: "Pay when you arrive at the destination", icon: Banknote },
                  { id: "stripe", label: "Credit/Debit Card", desc: "Pay securely online via Stripe", icon: CreditCard },
                  { id: "easypaisa", label: "EasyPaisa", desc: "Mobile wallet payment", icon: Smartphone },
                  { id: "jazzcash", label: "JazzCash", desc: "Mobile wallet payment", icon: Smartphone },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left ${
                      paymentMethod === method.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-border/80"
                    }`}
                  >
                    <div className={`size-10 rounded-lg flex items-center justify-center ${
                      paymentMethod === method.id ? "bg-primary text-white" : "bg-muted"
                    }`}>
                      <method.icon className="size-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{method.label}</p>
                      <p className="text-sm text-muted-foreground">{method.desc}</p>
                    </div>
                    <div className={`size-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === method.id ? "border-primary" : "border-border"
                    }`}>
                      {paymentMethod === method.id && (
                        <div className="size-2.5 rounded-full bg-primary" />
                      )}
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setCreatedBooking(null)}>
                Edit Booking
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90"
                onClick={handlePayment}
                disabled={processingPayment}
              >
                {processingPayment ? (
                  <><Loader2 className="size-4 mr-2 animate-spin" /> Processing...</>
                ) : paymentMethod === "cod" ? (
                  "Confirm Booking"
                ) : (
                  `Pay PKR ${totalPrice.toLocaleString()}`
                )}
              </Button>
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label>Select Tour *</Label>
                  <Select value={selectedTour} onValueChange={setSelectedTour} disabled={loading || tours.length === 0}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a tour package" />
                    </SelectTrigger>
                    <SelectContent>
                      {tours.map((tour) => (
                        <SelectItem key={tour._id} value={tour._id}>
                          {tour.name} ({tour.days} days) - PKR {(tour.pakistaniPrice || tour.price || 0).toLocaleString()}
                          {tour.foreignerPrice ? ` / $${Math.round(tour.foreignerPrice / 280)}` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {availableDepartures.length > 0 && (
                  <div className="space-y-2">
                    <Label>Select Departure Date *</Label>
                    <Select value={selectedDeparture} onValueChange={setSelectedDeparture}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a departure date" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDepartures.map((dep) => {
                          const remaining = dep.capacity - dep.bookedSeats;
                          const dateStr = new Date(dep.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
                          return (
                            <SelectItem key={dep._id} value={dep._id}>
                              {dateStr}{dep.time ? ` at ${dep.time}` : ""} — {remaining} seat{remaining !== 1 ? "s" : ""} left
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    {selectedDeparture && (() => {
                      const dep = availableDepartures.find((d) => d._id === selectedDeparture);
                      if (!dep) return null;
                      const remaining = dep.capacity - dep.bookedSeats;
                      return (
                        <p className="text-xs text-muted-foreground">
                          {remaining} seat{remaining !== 1 ? "s" : ""} remaining for this departure
                        </p>
                      );
                    })()}
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Visitor Type *</Label>
                  <Select value={userType} onValueChange={setUserType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select visitor type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pakistani">Pakistani</SelectItem>
                      <SelectItem value="foreigner">Foreigner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Mobile Number *</Label>
                  <Input
                    type="tel"
                    placeholder="03xx-xxxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                {userType === "pakistani" && (
                  <div className="space-y-2">
                    <Label>CNIC *</Label>
                    <Input
                      type="text"
                      placeholder="12345-1234567-1"
                      value={cnic}
                      onChange={(e) => setCnic(e.target.value)}
                      required
                    />
                  </div>
                )}

                {userType === "foreigner" && (
                  <div className="space-y-2">
                    <Label>Passport Number *</Label>
                    <Input
                      type="text"
                      placeholder="Enter passport number"
                      value={passport}
                      onChange={(e) => setPassport(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Adults *</Label>
                    <Input
                      type="number"
                      min="1"
                      value={adults}
                      onChange={(e) => setAdults(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Children</Label>
                    <Input
                      type="number"
                      min="0"
                      value={children}
                      onChange={(e) => setChildren(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    placeholder="Any special requirements or notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                {selectedTour && totalPrice > 0 && (
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Total: <span className="font-bold text-foreground text-lg">PKR {totalPrice.toLocaleString()}</span>
                      {userType && ` (${userType === "foreigner" ? "Foreigner visitor" : "Pakistani visitor"}, ${guestLabel})`}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={submitting || loading}
                  className="w-full bg-primary hover:bg-primary/90 h-11"
                >
                  {submitting ? (
                    <><Loader2 className="size-4 mr-2 animate-spin" /> Creating Booking...</>
                  ) : (
                    "Create Booking & Pay"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Booking;
