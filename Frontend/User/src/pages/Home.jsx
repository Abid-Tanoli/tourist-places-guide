import React, { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import HeroSlider from "../components/HeroSlider";
import api from "../api/axios";
import {
  ArrowRight,
  ChevronRight,
  Clock,
  Compass,
  MapPin,
  Mountain,
  Shield,
  Star,
  Users,
} from "lucide-react";

const features = [
  { icon: Shield, title: "Verified Tours", desc: "All tours verified for quality and safety" },
  { icon: Users, title: "Expert Guides", desc: "Local guides with deep knowledge" },
  { icon: Compass, title: "Custom Trips", desc: "Tailored to your preferences" },
];

const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80",
    alt: "Karakoram mountain peaks above a green valley",
    badge: "Discover Pakistan",
    heading: "Explore the Land of",
    headingAccent: "Pure Beauty",
    subheading:
      "From the majestic peaks of the Karakoram to the serene valleys of Hunza, begin your journey through Pakistan's most breathtaking northern landscapes.",
  },
  {
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1600&q=80",
    alt: "Badshahi Mosque and Lahore heritage architecture",
    badge: "Ancient Heritage",
    heading: "Walk Through",
    headingAccent: "Living History",
    subheading:
      "Step into Lahore's Mughal courtyards, grand mosques, and fortress walls where centuries-old culture still fills the streets.",
  },
  {
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600&q=80",
    alt: "High altitude lake and mountain landscape",
    badge: "Alpine Escape",
    heading: "Chase the",
    headingAccent: "Sky-High Lakes",
    subheading:
      "Follow the road to Skardu, Deosai, and turquoise alpine waters framed by high plains, wildflowers, and snow-bright horizons.",
  },
  {
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1600&q=80",
    alt: "Green mountain valley with river and forest",
    badge: "Switzerland of the East",
    heading: "Wander Through",
    headingAccent: "Emerald Valleys",
    subheading:
      "Let Swat and Kalam slow the pace with rivers, pine forests, cool meadows, and mountain villages tucked into every bend.",
  },
  {
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=1600&q=80",
    alt: "Historic desert fort and warm sandstone architecture",
    badge: "Desert Legends",
    heading: "Uncover the",
    headingAccent: "Desert Kingdom",
    subheading:
      "Cross Cholistan's golden dunes toward Derawar Fort, where desert silence, caravan routes, and old royal stories meet.",
  },
  {
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80",
    alt: "Sunlit coastline and ocean waves",
    badge: "Coastal Charm",
    heading: "Feel the",
    headingAccent: "Ocean Breeze",
    subheading:
      "Trace Karachi and Sindh's coast through beach evenings, island escapes, seafood tables, and the laid-back rhythm of the Arabian Sea.",
  },
];
const fallbackTourImage = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80";

const getTourImage = (tour) =>
  tour.image || tour.images?.[0] || tour.route?.find((stop) => stop.place?.image)?.place?.image || fallbackTourImage;

const getDiscountedPrice = (tour) => {
  const price = Number(tour?.pakistaniPrice || tour?.price || 0);
  const discount = Number(tour?.discount || 0);
  return discount > 0 ? Math.round(price * (1 - discount / 100)) : null;
};

const Home = (props) => {
  const navigate = useNavigate();
  const context = useOutletContext() || {};
  const {
    places = [],
    loadingPlaces: loading = false,
    placesError: error = "",
    regionFilter = "All",
    categoryFilter = "All",
    query = "",
  } = { ...context, ...props };

  const [tours, setTours] = useState([]);
  const [loadingTours, setLoadingTours] = useState(true);
  const [heroSearch, setHeroSearch] = useState("");
  const [regions, setRegions] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [heroStats, setHeroStats] = useState({ totalPlaces: 0, averageRating: 4.8, happyTravelers: 0 });

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoadingTours(true);
        const { data } = await api.get("/tours");
        setTours(Array.isArray(data) ? data : data.tours || []);
      } catch {
        setTours([]);
      } finally {
        setLoadingTours(false);
      }
    };
    fetchTours();
  }, []);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const { data } = await api.get("/regions?status=active");
        setRegions(Array.isArray(data) ? data : []);
      } catch {
        setRegions([]);
      }
    };
    fetchRegions();
  }, []);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data } = await api.get("/feedback?featured=true&limit=6");
        const feedbackArr = Array.isArray(data) ? data : [];
        if (feedbackArr.length > 0) {
          setTestimonials(feedbackArr);
        } else {
          const { data: allFeedback } = await api.get("/feedback?limit=6");
          setTestimonials(Array.isArray(allFeedback) ? allFeedback : []);
        }
      } catch {
        setTestimonials([]);
      }
    };
    fetchTestimonials();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/auth/public-stats");
        setHeroStats(data);
      } catch {
        // Keep defaults
      }
    };
    fetchStats();
  }, []);

  const filteredPlaces = places.filter((place) => {
    const matchesRegion = regionFilter === "All" || place.region === regionFilter;
    const matchesCategory = categoryFilter === "All" || place.category === categoryFilter;
    const matchesSearch =
      query === "" ||
      place.name?.toLowerCase().includes(query.toLowerCase()) ||
      place.description?.toLowerCase().includes(query.toLowerCase());
    return matchesRegion && matchesCategory && matchesSearch;
  });

  const featuredTours = tours.filter((tour) => tour.featured || tour.discount > 0).slice(0, 3);
  const displayTours = featuredTours.length > 0 ? featuredTours : tours.slice(0, 3);
  const popularPlaces = filteredPlaces.filter((place) => place.rating >= 4.5).slice(0, 6);

  const handleHeroSearch = (event) => {
    event.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/tours?q=${encodeURIComponent(heroSearch.trim())}`);
    }
  };

  return (
    <div>
      <HeroSlider
        slides={heroSlides}
        searchValue={heroSearch}
        onSearchChange={setHeroSearch}
        onSearchSubmit={handleHeroSearch}
        stats={heroStats}
      />
      <section className="border-b bg-white py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="flex items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <feature.icon className="size-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-sand-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">Popular Tour Packages</h2>
              <p className="mt-2 text-muted-foreground">Handpicked experiences across Pakistan</p>
            </div>
            <Button asChild variant="outline" className="hidden sm:flex">
              <Link to="/tours">View All <ArrowRight className="ml-2 size-4" /></Link>
            </Button>
          </div>

          {loadingTours ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <Card key={item} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-5">
                    <Skeleton className="mb-3 h-6 w-3/4" />
                    <Skeleton className="mb-2 h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {displayTours.map((tour) => {
                const discountedPrice = getDiscountedPrice(tour);
                return (
                  <Card key={tour._id || tour.id} className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
                    <div className="relative h-48 overflow-hidden">
                      <img src={getTourImage(tour)} alt={tour.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      {tour.discount > 0 && <Badge className="absolute left-3 top-3 border-0 bg-terracotta-500 text-white">{tour.discount}% OFF</Badge>}
                      {tour.featured && !tour.discount && <Badge className="absolute left-3 top-3 border-0 bg-primary text-white">Featured</Badge>}
                    </div>
                    <CardContent className="p-5">
                      <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="size-3.5" />
                        <span>{tour.days} {tour.days > 1 ? "days" : "day"}</span>
                        <span className="text-muted-foreground/50">|</span>
                        <MapPin className="size-3.5" />
                        <span>{tour.route?.length || 0} stops</span>
                      </div>
                      <h3 className="mb-2 text-lg font-semibold text-foreground">{tour.name}</h3>
                      <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{tour.shortDescription || tour.description}</p>
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          {discountedPrice ? (
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xl font-bold text-primary">PKR {discountedPrice.toLocaleString()}</span>
                              <span className="text-sm text-muted-foreground line-through">PKR {(tour.pakistaniPrice || tour.price || 0).toLocaleString()}</span>
                            </div>
                          ) : (
                            <span className="text-xl font-bold text-primary">PKR {(tour.pakistaniPrice || tour.price || 0).toLocaleString()}</span>
                          )}
                          <p className="text-xs text-muted-foreground">
                            per person
                            {tour.foreignerPrice && (
                              <span className="ml-1">| ~${Math.round(tour.foreignerPrice / 280)} USD for foreigners</span>
                            )}
                          </p>
                        </div>
                        <Button asChild size="sm" className="bg-terracotta-500 text-white hover:bg-terracotta-600">
                          <Link to="/booking">Book Now</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">Explore by Region</h2>
            <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
              From the icy peaks of Gilgit-Baltistan to the deserts of Balochistan, each region offers a unique experience.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {regions.map((region) => (
              <Link key={region._id || region.name} to={`/?region=${encodeURIComponent(region.name)}`} className="group relative h-48 overflow-hidden rounded-xl sm:h-56">
                <img src={region.image || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80"} alt={region.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-semibold text-white">{region.name}</h3>
                  <p className="text-sm text-white/70">{region.placeCount || 0} places</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {popularPlaces.length > 0 && (
        <section className="bg-sand-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-8">
              <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">Top Rated Destinations</h2>
              <p className="mt-2 text-muted-foreground">Most loved places by our travelers</p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {popularPlaces.map((place) => (
                <Card key={place._id || place.id} className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <div className="relative h-52 overflow-hidden">
                    <img src={place.image} alt={place.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <Badge className="absolute right-3 top-3 border-0 bg-white/90 text-foreground backdrop-blur-sm">
                      <Star className="mr-1 size-3 fill-terracotta-500 text-terracotta-500" />{place.rating}
                    </Badge>
                  </div>
                  <CardContent className="p-5">
                    <div className="mb-2 flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin className="size-3.5" />{place.region}</div>
                    <h3 className="mb-1 text-lg font-semibold text-foreground">{place.name}</h3>
                    <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{place.shortDescription || place.description?.substring(0, 100)}</p>
                    <Button asChild variant="ghost" className="h-auto p-0 text-primary hover:text-primary/80">
                      <Link to={`/place/${place._id || place.id}`}>View Details <ChevronRight className="ml-1 size-4" /></Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-teal-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">What Our Travelers Say</h2>
            <p className="mt-2 text-teal-200">Real experiences from real travelers</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.length > 0 ? testimonials.slice(0, 3).map((testimonial) => (
              <Card key={testimonial._id || testimonial.name} className="border-white/10 bg-white/10 text-white">
                <CardContent className="p-6">
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className={`size-4 ${index < (testimonial.rating || 5) ? "fill-terracotta-400 text-terracotta-400" : "text-white/30"}`} />
                    ))}
                  </div>
                  <p className="mb-4 text-sm leading-relaxed text-white/80">&quot;{testimonial.feedBackText || testimonial.text || testimonial.comment}&quot;</p>
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-white/20 text-sm font-semibold">{(testimonial.name || "A").charAt(0)}</div>
                    <div>
                      <p className="text-sm font-medium">{testimonial.name}</p>
                      <p className="text-xs text-white/60">{testimonial.country || "Pakistan"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="col-span-3 text-center text-white/60">
                <p>No reviews yet. Be the first to share your experience!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="font-heading mb-4 text-3xl font-bold text-foreground sm:text-4xl">Ready to Explore Pakistan?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
            Whether you seek adventure in the mountains, culture in ancient cities, or peace in serene valleys, we have the perfect tour for you.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90"><Link to="/tours">Browse All Tours</Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/booking">Book Custom Trip</Link></Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
