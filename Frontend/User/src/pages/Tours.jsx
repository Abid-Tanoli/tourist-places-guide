import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import FallbackImage from "../components/FallbackImage";
import api from "../api/axios";
import TourMap from "../components/TourMap";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Eye,
  Info,
  ListChecks,
  Loader2,
  MapPin,
  MessageSquare,
  Route,
  Search,
  SlidersHorizontal,
  Star,
  Users,
  X,
  XCircle,
} from "lucide-react";

const fallbackTourImage = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80";

const getRoutePlaces = (tour) =>
  (tour.route || []).map((stop) => stop.place).filter(Boolean);

const getTourImage = (tour) =>
  tour.image || tour.images?.[0] || tour.route?.find((stop) => stop.place?.image)?.place?.image || fallbackTourImage;

const getGalleryImages = (tour) => {
  const images = [tour.image, ...(tour.images || []), ...(tour.route || []).map((stop) => stop.place?.image)];
  return [...new Set(images.filter(Boolean))].slice(0, 6);
};

const getDiscountedPrice = (tour) => {
  const price = Number(tour?.pakistaniPrice || tour?.price || 0);
  const discount = Number(tour?.discount || 0);
  return discount > 0 ? Math.round(price * (1 - discount / 100)) : price;
};

const formatPKR = (value) => `PKR ${Number(value || 0).toLocaleString()}`;

const groupRouteByDay = (tour) => {
  const grouped = new Map();
  (tour.route || [])
    .slice()
    .sort((a, b) => (a.day || 1) - (b.day || 1) || (a.order || 1) - (b.order || 1))
    .forEach((stop) => {
      const day = stop.day || 1;
      if (!grouped.has(day)) grouped.set(day, []);
      grouped.get(day).push(stop);
    });
  return [...grouped.entries()];
};

const TourDetailsDialog = ({ tour, onClose }) => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ avgRating: 0, totalReviews: 0 });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: "", email: "", rating: 5, title: "", comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchTourReviews = useCallback(async (tourId) => {
    setReviewLoading(true);
    try {
      const { data } = await api.get(`/reviews/tour/${tourId}`);
      setReviews(data.reviews || []);
      setReviewStats(data.stats || { avgRating: 0, totalReviews: 0 });
    } catch {
      // Non-critical
    } finally {
      setReviewLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tour?._id) fetchTourReviews(tour._id);
  }, [tour?._id, fetchTourReviews]);

  useEffect(() => {
    if (user) {
      setReviewForm((prev) => ({ ...prev, name: user.name || "", email: user.email || "" }));
    }
  }, [user]);

  if (!tour) return null;

  const gallery = getGalleryImages(tour);
  const routePlaces = getRoutePlaces(tour);
  const routeDays = groupRouteByDay(tour);
  const salePrice = getDiscountedPrice(tour);
  const hasDiscount = Number(tour.discount || 0) > 0;

  const nextDeparture = (tour.departures || [])
    .filter((d) => d.status === "active" && d.capacity - d.bookedSeats > 0)
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

  const seatsDisplay = nextDeparture
    ? `${nextDeparture.capacity - nextDeparture.bookedSeats} of ${nextDeparture.capacity}`
    : "Select at booking";

  const departureLabel = nextDeparture
    ? new Date(nextDeparture.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  const handleClose = (open) => {
    if (!open) {
      setActiveTab("overview");
      onClose();
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.comment.trim()) {
      toast.error("Name and comment are required.");
      return;
    }
    setSubmittingReview(true);
    try {
      await api.post("/reviews", { ...reviewForm, tour: tour._id });
      toast.success("Review submitted! It will appear after moderation.");
      setReviewForm((prev) => ({ ...prev, rating: 5, title: "", comment: "" }));
      fetchTourReviews(tour._id);
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <Dialog open={Boolean(tour)} onOpenChange={handleClose}>
      <DialogContent className="max-h-[95vh] max-w-6xl overflow-y-auto p-0 sm:max-h-[92vh]">
        <DialogHeader className="sr-only">
          <DialogTitle>{tour.name}</DialogTitle>
          <DialogDescription>{tour.shortDescription || tour.description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_380px]">
          <div className="min-w-0 overflow-hidden">
            <Carousel className="relative">
              <CarouselContent>
                {gallery.map((image, index) => (
                  <CarouselItem key={`${image}-${index}`}>
                    <div className="relative h-52 sm:h-72 md:h-80">
                      <FallbackImage src={image} alt={`${tour.name} ${index + 1}`} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-white sm:bottom-6 sm:left-6 sm:right-6">
                        <div className="mb-2 flex flex-wrap gap-2">
                          {tour.featured && <Badge className="border-0 bg-primary text-white">Featured</Badge>}
                          {hasDiscount && <Badge className="border-0 bg-terracotta-500 text-white">{tour.discount}% off</Badge>}
                          <Badge className="border-0 bg-white/20 text-white backdrop-blur-sm">{tour.location || "Pakistan"}</Badge>
                        </div>
                        <h2 className="font-heading text-2xl font-bold sm:text-3xl md:text-4xl">{tour.name}</h2>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {gallery.length > 1 && (
                <>
                  <CarouselPrevious className="left-2 size-9 sm:left-4 sm:size-10" />
                  <CarouselNext className="right-2 size-9 sm:right-4 sm:size-10" />
                </>
              )}
            </Carousel>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="sticky top-0 z-10 border-b bg-white px-4 sm:px-6">
                <TabsList className="w-full justify-start gap-1 rounded-none border-0 bg-transparent p-0 h-auto">
                  <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent px-3 py-3 text-sm font-medium data-[state=active]:border-primary data-[state=active]:shadow-none sm:text-base">
                    <Info className="mr-1.5 size-4" /> Overview
                  </TabsTrigger>
                  <TabsTrigger value="itinerary" className="rounded-none border-b-2 border-transparent px-3 py-3 text-sm font-medium data-[state=active]:border-primary data-[state=active]:shadow-none sm:text-base">
                    <Route className="mr-1.5 size-4" /> Itinerary
                  </TabsTrigger>
                  <TabsTrigger value="details" className="rounded-none border-b-2 border-transparent px-3 py-3 text-sm font-medium data-[state=active]:border-primary data-[state=active]:shadow-none sm:text-base">
                    <ListChecks className="mr-1.5 size-4" /> Included
                  </TabsTrigger>
                  {routePlaces.length > 0 && (
                    <TabsTrigger value="map" className="rounded-none border-b-2 border-transparent px-3 py-3 text-sm font-medium data-[state=active]:border-primary data-[state=active]:shadow-none sm:text-base">
                      <MapPin className="mr-1.5 size-4" /> Map
                    </TabsTrigger>
                  )}
                  <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent px-3 py-3 text-sm font-medium data-[state=active]:border-primary data-[state=active]:shadow-none sm:text-base">
                    <MessageSquare className="mr-1.5 size-4" /> Reviews ({reviewStats.totalReviews || reviews.length || 0})
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-5 sm:p-6 md:p-8">
                <TabsContent value="overview" className="mt-0 space-y-6">
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {tour.shortDescription || tour.description}
                  </p>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
                    <div className="rounded-xl border bg-sand-50 p-3.5 sm:p-4">
                      <Clock className="mb-2 size-5 text-primary" />
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Duration</p>
                      <p className="mt-1 text-base font-semibold text-foreground">{tour.days} days</p>
                    </div>
                    <div className="rounded-xl border bg-sand-50 p-3.5 sm:p-4">
                      <Route className="mb-2 size-5 text-primary" />
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Route</p>
                      <p className="mt-1 text-base font-semibold text-foreground">{tour.route?.length || 0} stops</p>
                    </div>
                    <div className="rounded-xl border bg-sand-50 p-3.5 sm:p-4">
                      <Users className="mb-2 size-5 text-primary" />
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Next Departure</p>
                      <p className="mt-1 text-base font-semibold text-foreground">{departureLabel || "TBA"}</p>
                    </div>
                    <div className="rounded-xl border bg-sand-50 p-3.5 sm:p-4">
                      <CalendarDays className="mb-2 size-5 text-primary" />
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Seats Left</p>
                      <p className="mt-1 text-base font-semibold text-foreground">{seatsDisplay}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="itinerary" className="mt-0">
                  {routeDays.length > 0 ? (
                    <Accordion type="single" collapsible defaultValue={`day-${routeDays[0][0]}`} className="rounded-xl border">
                      {routeDays.map(([day, stops]) => (
                        <AccordionItem key={day} value={`day-${day}`} className="px-4 sm:px-5">
                          <AccordionTrigger className="py-4 text-base font-medium">
                            <span>Day {day}: <span className="ml-1 text-muted-foreground">{stops.map((stop) => stop.place?.name).filter(Boolean).join(" → ")}</span></span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4 pb-4">
                              {stops.map((stop, index) => (
                                <div key={`${day}-${index}`} className="flex gap-3">
                                  <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                                    {index + 1}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-base font-medium text-foreground">{stop.place?.name || `Stop ${index + 1}`}</p>
                                    <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                                      {stop.description || stop.place?.region || "Guided sightseeing and transfer time included."}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <p className="py-8 text-center text-muted-foreground">Detailed itinerary will be shared upon booking.</p>
                  )}
                </TabsContent>

                <TabsContent value="details" className="mt-0">
                  <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                    <div className="rounded-xl border bg-sand-50 p-5 sm:p-6">
                      <h3 className="mb-4 flex items-center gap-2 text-base font-semibold">
                        <CheckCircle2 className="size-5 text-primary" /> Included in Package
                      </h3>
                      <ul className="space-y-2.5">
                        {(tour.included || []).map((item) => (
                          <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" /> {item}
                          </li>
                        ))}
                        {(!tour.included || tour.included.length === 0) && (
                          <li className="text-sm text-muted-foreground/60">No items listed</li>
                        )}
                      </ul>
                    </div>
                    <div className="rounded-xl border bg-sand-50 p-5 sm:p-6">
                      <h3 className="mb-4 flex items-center gap-2 text-base font-semibold">
                        <XCircle className="size-5 text-terracotta-500" /> Not Included
                      </h3>
                      <ul className="space-y-2.5">
                        {(tour.excluded || []).map((item) => (
                          <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                            <XCircle className="mt-0.5 size-4 shrink-0 text-terracotta-500" /> {item}
                          </li>
                        ))}
                        {(!tour.excluded || tour.excluded.length === 0) && (
                          <li className="text-sm text-muted-foreground/60">No exclusions listed</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </TabsContent>

                {routePlaces.length > 0 && (
                  <TabsContent value="map" className="mt-0">
                    <div className="overflow-hidden rounded-xl border">
                      <TourMap route={routePlaces} tourRoute={tour.route} />
                    </div>
                  </TabsContent>
                )}

                <TabsContent value="reviews" className="mt-0">
                  <div className="space-y-5">
                    {reviewStats.totalReviews > 0 && (
                      <div className="flex items-center gap-4 rounded-xl border bg-sand-50 p-4">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-primary">{reviewStats.avgRating}</p>
                          <div className="flex gap-0.5 mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`size-3.5 ${i < Math.round(reviewStats.avgRating) ? "fill-terracotta-400 text-terracotta-400" : "text-gray-300"}`} />
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{reviewStats.totalReviews} reviews</p>
                        </div>
                      </div>
                    )}

                    {reviews.length > 0 ? (
                      <div className="space-y-3">
                        {reviews.map((review) => (
                          <div key={review._id} className="rounded-xl border p-4">
                            <div className="flex items-center gap-3">
                              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                                {(review.name || "A").charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-sm text-foreground">{review.name}</p>
                                <div className="flex items-center gap-2">
                                  <div className="flex gap-0.5">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <Star key={i} className={`size-3 ${i < review.rating ? "fill-terracotta-400 text-terracotta-400" : "text-gray-300"}`} />
                                    ))}
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {review.title && <p className="font-medium text-sm text-foreground mt-2">{review.title}</p>}
                            <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    ) : !reviewLoading ? (
                      <div className="rounded-xl border p-6 text-center">
                        <MessageSquare className="size-6 text-muted-foreground/40 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No reviews yet. Be the first!</p>
                      </div>
                    ) : null}

                    <div className="rounded-xl border p-5">
                      <h3 className="font-medium text-foreground mb-3">Write a Review</h3>
                      {!isAuthenticated ? (
                        <p className="text-sm text-muted-foreground">
                          <Link to="/login" className="text-primary hover:underline">Sign in</Link> to leave a review.
                        </p>
                      ) : (
                        <form onSubmit={handleSubmitReview} className="space-y-3">
                          <div>
                            <Label className="text-sm">Your Rating *</Label>
                            <div className="flex gap-1 mt-1">
                              {[1, 2, 3, 4, 5].map((r) => (
                                <button key={r} type="button" onClick={() => setReviewForm((prev) => ({ ...prev, rating: r }))} className="p-0.5">
                                  <Star className={`size-5 ${r <= reviewForm.rating ? "fill-terracotta-400 text-terracotta-400" : "text-gray-300 hover:text-terracotta-200"}`} />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm">Title (optional)</Label>
                            <Input value={reviewForm.title} onChange={(e) => setReviewForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Summarize your experience" className="mt-1" />
                          </div>
                          <div>
                            <Label className="text-sm">Your Review *</Label>
                            <Textarea value={reviewForm.comment} onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))} placeholder="Tell others about your experience..." rows={3} className="mt-1" required />
                          </div>
                          <Button type="submit" disabled={submittingReview} size="sm" className="bg-primary hover:bg-primary/90">
                            {submittingReview ? <><Loader2 className="size-3.5 mr-1.5 animate-spin" /> Submitting...</> : "Submit Review"}
                          </Button>
                        </form>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          <aside className="border-t bg-white p-5 sm:p-6 lg:border-l lg:border-t-0 lg:min-w-[380px]">
            <div className="space-y-5 sm:sticky sm:top-4">
              <div>
                <p className="text-sm text-muted-foreground">From</p>
                <div className="mt-1 flex flex-wrap items-end gap-2">
                  <span className="text-3xl font-bold text-primary">{formatPKR(salePrice)}</span>
                  {hasDiscount && <span className="pb-1 text-sm text-muted-foreground line-through">{formatPKR(tour.pakistaniPrice || tour.price)}</span>}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  per person (Pakistani)
                  {tour.foreignerPrice && (
                    <span className="block mt-0.5">~${Math.round(tour.foreignerPrice / 280)} USD for international visitors</span>
                  )}
                </p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-sand-50 p-3">
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-medium mt-0.5">{tour.days} days</p>
                </div>
                <div className="rounded-lg bg-sand-50 p-3">
                  <p className="text-xs text-muted-foreground">Next departure</p>
                  <p className="font-medium mt-0.5">{departureLabel || "TBA"}</p>
                </div>
                <div className="rounded-lg bg-sand-50 p-3">
                  <p className="text-xs text-muted-foreground">Seats left</p>
                  <p className={`font-medium mt-0.5 ${nextDeparture ? "text-primary" : "text-muted-foreground"}`}>{seatsDisplay}</p>
                </div>
                <div className="rounded-lg bg-sand-50 p-3">
                  <p className="text-xs text-muted-foreground">Region</p>
                  <p className="font-medium mt-0.5">{tour.location || "Pakistan"}</p>
                </div>
              </div>

              <div className="rounded-xl bg-primary/5 p-4 text-sm text-muted-foreground">
                <div className="mb-2 flex items-center gap-2 font-medium text-foreground"><Info className="size-4 text-primary" /> Booking note</div>
                <p>Reserve now and our team will confirm schedule, pickup details, and payment status.</p>
              </div>

              <Button asChild className="w-full bg-terracotta-500 text-white hover:bg-terracotta-600" size="lg" onClick={onClose}>
                <Link to={`/booking?tour=${tour._id || tour.id}`}>Book This Tour</Link>
              </Button>
            </div>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null);
  const [selectedTourName, setSelectedTourName] = useState("");
  const [detailTour, setDetailTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [filterDays, setFilterDays] = useState("all");
  const [filterPrice, setFilterPrice] = useState("all");

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await api.get("/tours");
        setTours(Array.isArray(data) ? data : data.tours || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load tours.");
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  const filteredTours = useMemo(() => {
    let result = [...tours];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (tour) =>
          tour.name?.toLowerCase().includes(q) ||
          tour.description?.toLowerCase().includes(q) ||
          tour.location?.toLowerCase().includes(q)
      );
    }

    if (filterDays !== "all") {
      const [min, max] = filterDays.split("-").map(Number);
      result = result.filter((tour) => (max ? tour.days >= min && tour.days <= max : tour.days >= min));
    }

    if (filterPrice !== "all") {
      const [min, max] = filterPrice.split("-").map(Number);
      result = result.filter((tour) => {
        const price = getDiscountedPrice(tour);
        return max ? price >= min && price <= max : price >= min;
      });
    }

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => getDiscountedPrice(a) - getDiscountedPrice(b));
        break;
      case "price-high":
        result.sort((a, b) => getDiscountedPrice(b) - getDiscountedPrice(a));
        break;
      case "days":
        result.sort((a, b) => a.days - b.days);
        break;
      case "featured":
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return result;
  }, [tours, searchQuery, sortBy, filterDays, filterPrice]);

  const activeFilters = [
    filterDays !== "all" && { label: `${filterDays} days`, clear: () => setFilterDays("all") },
    filterPrice !== "all" && { label: `PKR ${filterPrice.replace("-", " - ")}`, clear: () => setFilterPrice("all") },
  ].filter(Boolean);

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Duration</label>
        <Select value={filterDays} onValueChange={setFilterDays}>
          <SelectTrigger>
            <SelectValue placeholder="Any duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Duration</SelectItem>
            <SelectItem value="1-3">1-3 Days</SelectItem>
            <SelectItem value="4-5">4-5 Days</SelectItem>
            <SelectItem value="6-7">6-7 Days</SelectItem>
            <SelectItem value="8-999">8+ Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Budget (PKR)</label>
        <Select value={filterPrice} onValueChange={setFilterPrice}>
          <SelectTrigger>
            <SelectValue placeholder="Any budget" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Budget</SelectItem>
            <SelectItem value="0-35000">Under 35,000</SelectItem>
            <SelectItem value="35000-60000">35,000 - 60,000</SelectItem>
            <SelectItem value="60000-100000">60,000 - 100,000</SelectItem>
            <SelectItem value="100000-999999">100,000+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Sort By</label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="days">Duration</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-sand-50">
      <div className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-3">Tour Packages</h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Carefully crafted itineraries to explore Pakistan's most breathtaking destinations
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search tours..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="bg-white">
                <SlidersHorizontal className="size-4 mr-2" />
                Filters
                {activeFilters.length > 0 && (
                  <Badge className="ml-2 bg-primary text-white border-0 size-5 p-0 flex items-center justify-center text-xs">
                    {activeFilters.length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetTitle className="text-lg font-semibold">Filters</SheetTitle>
              <Separator className="my-4" />
              <FilterContent />
              <div className="mt-6">
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setFilterDays("all");
                    setFilterPrice("all");
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {activeFilters.map((filter, index) => (
              <Badge key={index} variant="secondary" className="gap-1 pl-3">
                {filter.label}
                <button type="button" onClick={filter.clear} className="ml-1 hover:text-destructive">
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Card key={item} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-5">
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-16">
            <p className="text-destructive text-lg">{error}</p>
          </div>
        )}

        {!loading && !error && filteredTours.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-4">No tours match your filters.</p>
            <Button variant="outline" onClick={() => { setSearchQuery(""); setFilterDays("all"); setFilterPrice("all"); }}>
              Clear Filters
            </Button>
          </div>
        )}

        {!loading && !error && filteredTours.length > 0 && (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              Showing {filteredTours.length} of {tours.length} tours
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTours.map((tour) => {
                const discountedPrice = Number(tour.discount || 0) > 0 ? getDiscountedPrice(tour) : null;

                return (
                  <Card key={tour._id || tour.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300 flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                      <FallbackImage
                        src={getTourImage(tour)}
                        alt={tour.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {tour.discount > 0 && (
                        <Badge className="absolute top-3 left-3 bg-terracotta-500 text-white border-0">
                          {tour.discount}% OFF
                        </Badge>
                      )}
                      {tour.featured && !tour.discount && (
                        <Badge className="absolute top-3 left-3 bg-primary text-white border-0">
                          Featured
                        </Badge>
                      )}
                      <div className="absolute bottom-3 right-3">
                        <Badge className="bg-black/60 text-white border-0 backdrop-blur-sm">
                          <Clock className="size-3 mr-1" />
                          {tour.days} {tour.days > 1 ? "days" : "day"}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-5 flex flex-col flex-1">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-foreground mb-2">{tour.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {tour.shortDescription || tour.description}
                        </p>

                        {tour.route?.length > 0 && (
                          <div className="mb-3">
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-1.5">
                              <MapPin className="size-3.5" />
                              <span>{tour.route.length} stops on the route</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {tour.route.slice(0, 3).map((stop, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {stop.place?.name || `Stop ${index + 1}`}
                                </Badge>
                              ))}
                              {tour.route.length > 3 && (
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-primary/10 transition-colors">
                                      +{tour.route.length - 3} more
                                    </Badge>
                                  </PopoverTrigger>
                                  <PopoverContent align="start" side="top" className="w-64 p-3">
                                    <p className="text-xs font-medium text-muted-foreground mb-2">All route stops:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {tour.route.map((stop, i) => (
                                        <Badge key={i} variant="outline" className="text-xs">
                                          {stop.place?.name || `Stop ${i + 1}`}
                                        </Badge>
                                      ))}
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              )}
                            </div>
                          </div>
                        )}

                        {tour.included?.length > 0 && (
                          <div className="text-sm text-muted-foreground mb-4 leading-relaxed">
                            <span className="font-medium text-foreground">Includes: </span>
                            {tour.included.slice(0, 2).join(", ")}
                            {tour.included.length > 2 && (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <span className="text-primary font-medium cursor-pointer hover:underline ml-0.5">+{tour.included.length - 2} more</span>
                                </PopoverTrigger>
                                <PopoverContent align="start" side="top" className="w-72 p-3">
                                  <p className="text-xs font-medium text-muted-foreground mb-2">Full inclusion list:</p>
                                  <ul className="space-y-1">
                                    {tour.included.map((item, i) => (
                                      <li key={i} className="flex items-start gap-1.5 text-sm">
                                        <CheckCircle2 className="size-3.5 mt-0.5 shrink-0 text-primary" />
                                        <span>{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </PopoverContent>
                              </Popover>
                            )}
                          </div>
                        )}
                      </div>

                      <Separator className="mb-4" />

                      <div className="space-y-3">
                        <div>
                          {discountedPrice ? (
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xl font-bold text-primary">{formatPKR(discountedPrice)}</span>
                              <span className="text-sm text-muted-foreground line-through">{formatPKR(tour.pakistaniPrice || tour.price)}</span>
                            </div>
                          ) : (
                            <span className="text-xl font-bold text-primary">{formatPKR(tour.pakistaniPrice || tour.price)}</span>
                          )}
                          <p className="text-xs text-muted-foreground">
                            per person
                            {tour.foreignerPrice && (
                              <span className="ml-1">| ~${Math.round(tour.foreignerPrice / 280)} USD</span>
                            )}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" className="min-h-9" onClick={() => setDetailTour(tour)}>
                            Details
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="min-h-9"
                            onClick={() => {
                              setSelectedTour(getRoutePlaces(tour));
                              setSelectedTourName(tour.name);
                            }}
                            disabled={getRoutePlaces(tour).length === 0}
                            aria-label="View route on map"
                          >
                            <MapPin className="size-3.5" />
                          </Button>
                          <Button asChild size="sm" className="bg-terracotta-500 hover:bg-terracotta-600 text-white min-h-9">
                            <Link to={`/booking?tour=${tour._id || tour.id}`}>Book</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}

        {selectedTour && (
          <Dialog open={Boolean(selectedTour)} onOpenChange={(open) => { if (!open) setSelectedTour(null); }}>
            <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden p-0">
              <DialogHeader className="p-5 pb-0">
                <DialogTitle>{selectedTourName} — Route Map</DialogTitle>
                <DialogDescription>Interactive map showing all route stops for this tour.</DialogDescription>
              </DialogHeader>
              <div className="p-0">
                <TourMap route={selectedTour} />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <TourDetailsDialog tour={detailTour} onClose={() => setDetailTour(null)} />
    </div>
  );
};

export default Tours;