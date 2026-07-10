import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import TourMap from "../components/TourMap";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  CalendarDays,
  CheckCircle2,
  Clock,
  Info,
  MapPin,
  Route,
  Search,
  SlidersHorizontal,
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
  const price = Number(tour?.price || 0);
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

  const TourDetailsDialog = () => {
    if (!detailTour) return null;

    const gallery = getGalleryImages(detailTour);
    const routePlaces = getRoutePlaces(detailTour);
    const routeDays = groupRouteByDay(detailTour);
    const salePrice = getDiscountedPrice(detailTour);
    const hasDiscount = Number(detailTour.discount || 0) > 0;

    return (
      <Dialog open={Boolean(detailTour)} onOpenChange={(open) => !open && setDetailTour(null)}>
        <DialogContent className="max-h-[92vh] max-w-6xl overflow-y-auto p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>{detailTour.name}</DialogTitle>
            <DialogDescription>{detailTour.shortDescription || detailTour.description}</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px]">
            <div className="min-w-0">
              <Carousel className="relative">
                <CarouselContent>
                  {gallery.map((image, index) => (
                    <CarouselItem key={`${image}-${index}`}>
                      <div className="relative h-72 sm:h-96">
                        <img src={image} alt={`${detailTour.name} ${index + 1}`} className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-5 left-5 right-5 text-white">
                          <div className="mb-3 flex flex-wrap gap-2">
                            {detailTour.featured && <Badge className="border-0 bg-primary text-white">Featured</Badge>}
                            {hasDiscount && <Badge className="border-0 bg-terracotta-500 text-white">{detailTour.discount}% off</Badge>}
                            <Badge className="border-0 bg-white/20 text-white backdrop-blur-sm">{detailTour.location || "Pakistan"}</Badge>
                          </div>
                          <h2 className="font-heading text-3xl font-bold sm:text-5xl">{detailTour.name}</h2>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {gallery.length > 1 && (
                  <>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                  </>
                )}
              </Carousel>

              <div className="space-y-8 p-5 sm:p-8">
                <div>
                  <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                    {detailTour.shortDescription || detailTour.description}
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-lg border bg-white p-3">
                      <Clock className="mb-2 size-4 text-primary" />
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="font-semibold">{detailTour.days} days</p>
                    </div>
                    <div className="rounded-lg border bg-white p-3">
                      <Route className="mb-2 size-4 text-primary" />
                      <p className="text-xs text-muted-foreground">Route</p>
                      <p className="font-semibold">{detailTour.route?.length || 0} stops</p>
                    </div>
                    <div className="rounded-lg border bg-white p-3">
                      <Users className="mb-2 size-4 text-primary" />
                      <p className="text-xs text-muted-foreground">Seats</p>
                      <p className="font-semibold">{detailTour.availableSeats ?? detailTour.capacity} left</p>
                    </div>
                    <div className="rounded-lg border bg-white p-3">
                      <CalendarDays className="mb-2 size-4 text-primary" />
                      <p className="text-xs text-muted-foreground">Capacity</p>
                      <p className="font-semibold">{detailTour.capacity || 20} guests</p>
                    </div>
                  </div>
                </div>

                {routeDays.length > 0 && (
                  <section>
                    <h3 className="font-heading mb-4 text-2xl font-bold">Day-by-Day Route</h3>
                    <Accordion type="single" collapsible defaultValue={`day-${routeDays[0][0]}`} className="rounded-lg border bg-white px-4">
                      {routeDays.map(([day, stops]) => (
                        <AccordionItem key={day} value={`day-${day}`}>
                          <AccordionTrigger>Day {day}: {stops.map((stop) => stop.place?.name).filter(Boolean).join(" to ")}</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3 pt-1">
                              {stops.map((stop, index) => (
                                <div key={`${day}-${index}`} className="flex gap-3">
                                  <div className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                                    {index + 1}
                                  </div>
                                  <div>
                                    <p className="font-medium text-foreground">{stop.place?.name || `Stop ${index + 1}`}</p>
                                    <p className="text-sm text-muted-foreground">
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
                  </section>
                )}

                <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-lg border bg-white p-5">
                    <h3 className="mb-4 flex items-center gap-2 font-semibold"><CheckCircle2 className="size-5 text-primary" /> Included</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {(detailTour.included || []).map((item) => (
                        <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" /> {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg border bg-white p-5">
                    <h3 className="mb-4 flex items-center gap-2 font-semibold"><XCircle className="size-5 text-terracotta-500" /> Excluded</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {(detailTour.excluded || []).map((item) => (
                        <li key={item} className="flex gap-2"><XCircle className="mt-0.5 size-4 shrink-0 text-terracotta-500" /> {item}</li>
                      ))}
                    </ul>
                  </div>
                </section>

                {routePlaces.length > 0 && (
                  <section>
                    <h3 className="font-heading mb-4 text-2xl font-bold">Route Map</h3>
                    <div className="overflow-hidden rounded-lg border bg-white">
                      <TourMap route={routePlaces} />
                    </div>
                  </section>
                )}
              </div>
            </div>

            <aside className="border-t bg-white p-5 lg:border-l lg:border-t-0">
              <div className="sticky top-4 space-y-5">
                <div>
                  <p className="text-sm text-muted-foreground">From</p>
                  <div className="flex flex-wrap items-end gap-2">
                    <span className="text-3xl font-bold text-primary">{formatPKR(salePrice)}</span>
                    {hasDiscount && <span className="pb-1 text-sm text-muted-foreground line-through">{formatPKR(detailTour.price)}</span>}
                  </div>
                  <p className="text-xs text-muted-foreground">per person</p>
                </div>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4"><span className="text-muted-foreground">Duration</span><span className="font-medium">{detailTour.days} days</span></div>
                  <div className="flex justify-between gap-4"><span className="text-muted-foreground">Seats available</span><span className="font-medium">{detailTour.availableSeats ?? detailTour.capacity}</span></div>
                  <div className="flex justify-between gap-4"><span className="text-muted-foreground">Region</span><span className="font-medium text-right">{detailTour.location || "Pakistan"}</span></div>
                </div>

                <div className="rounded-lg bg-primary/5 p-4 text-sm text-muted-foreground">
                  <div className="mb-2 flex items-center gap-2 font-medium text-foreground"><Info className="size-4 text-primary" /> Booking note</div>
                  Reserve now and our team will confirm schedule, pickup details, and payment status.
                </div>

                <Button asChild className="w-full bg-terracotta-500 text-white hover:bg-terracotta-600" size="lg" onClick={() => setDetailTour(null)}>
                  <Link to="/booking">Book This Tour</Link>
                </Button>
              </div>
            </aside>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

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
                      <img
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
                          <div className="mb-4">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                              <MapPin className="size-3" />
                              <span>{tour.route.length} stops on the route</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {tour.route.slice(0, 3).map((stop, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {stop.place?.name || `Stop ${index + 1}`}
                                </Badge>
                              ))}
                              {tour.route.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{tour.route.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {tour.included?.length > 0 && (
                          <div className="text-xs text-muted-foreground mb-4">
                            <span className="font-medium">Includes: </span>
                            {tour.included.slice(0, 2).join(", ")}
                            {tour.included.length > 2 && ` +${tour.included.length - 2} more`}
                          </div>
                        )}
                      </div>

                      <Separator className="mb-4" />

                      <div className="flex items-end justify-between gap-3">
                        <div>
                          {discountedPrice ? (
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xl font-bold text-primary">{formatPKR(discountedPrice)}</span>
                              <span className="text-sm text-muted-foreground line-through">{formatPKR(tour.price)}</span>
                            </div>
                          ) : (
                            <span className="text-xl font-bold text-primary">{formatPKR(tour.price)}</span>
                          )}
                          <p className="text-xs text-muted-foreground">per person</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setDetailTour(tour)}>
                            Details
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedTour(getRoutePlaces(tour));
                              setSelectedTourName(tour.name);
                            }}
                            disabled={getRoutePlaces(tour).length === 0}
                          >
                            <MapPin className="size-3.5" />
                          </Button>
                          <Button asChild size="sm" className="bg-terracotta-500 hover:bg-terracotta-600 text-white">
                            <Link to="/booking">Book</Link>
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
          <div className="mt-10">
            <Card className="overflow-hidden">
              <div className="p-4 flex items-center justify-between border-b">
                <h2 className="font-semibold text-lg text-foreground">{selectedTourName} - Route Map</h2>
                <Button variant="ghost" size="sm" onClick={() => setSelectedTour(null)}>
                  <X className="size-4" />
                </Button>
              </div>
              <div className="p-0">
                <TourMap route={selectedTour} />
              </div>
            </Card>
          </div>
        )}
      </div>

      <TourDetailsDialog />
    </div>
  );
};

export default Tours;