import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FallbackImage from "../components/FallbackImage";
import api from "../api/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  Star,
  Clock,
  Heart,
  ArrowLeft,
  Navigation,
  Phone,
  Mail,
  Globe,
  Ticket,
  Share2,
  ChevronRight,
  Loader2,
  MessageSquare,
} from "lucide-react";

const PlaceDetails = () => {
  const { id } = useParams();
  const { user, toggleWishlist, isAuthenticated } = useAuth();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [wishLoading, setWishLoading] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ avgRating: 0, totalReviews: 0 });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: "", email: "", rating: 5, title: "", comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  const isWishlisted = user?.wishlist?.includes(id);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await api.get(`/places/${id}`);
        setPlace(data);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message || "Unable to load place."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlace();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const fetchReviews = async () => {
      setReviewLoading(true);
      try {
        const { data } = await api.get(`/reviews/place/${id}`);
        setReviews(data.reviews || []);
        setReviewStats(data.stats || { avgRating: 0, totalReviews: 0 });
      } catch {
        // Non-critical
      } finally {
        setReviewLoading(false);
      }
    };
    fetchReviews();
  }, [id]);

  useEffect(() => {
    if (user) {
      setReviewForm((prev) => ({ ...prev, name: user.name || "", email: user.email || "" }));
    }
  }, [user]);

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to add to wishlist.");
      return;
    }
    setWishLoading(true);
    try {
      await toggleWishlist(id);
      toast.success(isWishlisted ? "Removed from wishlist." : "Added to wishlist!");
    } catch {
      toast.error("Failed to update wishlist.");
    } finally {
      setWishLoading(false);
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
      await api.post("/reviews", {
        ...reviewForm,
        place: id,
      });
      toast.success("Review submitted! It will appear after moderation.");
      setReviewForm((prev) => ({ ...prev, rating: 5, title: "", comment: "" }));
      const { data } = await api.get(`/reviews/place/${id}`);
      setReviews(data.reviews || []);
      setReviewStats(data.stats || { avgRating: 0, totalReviews: 0 });
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-50">
        <div className="animate-pulse">
          <div className="h-96 bg-muted w-full" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <div className="h-8 bg-muted rounded w-1/3 mb-4" />
            <div className="h-4 bg-muted rounded w-2/3 mb-2" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive text-lg mb-4">{error}</p>
          <Button asChild variant="outline">
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground text-lg mb-4">Place not found</p>
          <Button asChild variant="outline">
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Hero Image */}
      <div className="relative h-[50vh] min-h-[400px]">
        <FallbackImage
          src={place.image}
          alt={place.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        <div className="absolute top-4 left-4">
          <Button asChild variant="ghost" className="text-white hover:text-white hover:bg-white/20 bg-black/30 backdrop-blur-sm">
            <Link to="/">
              <ArrowLeft className="size-4 mr-2" />
              Back
            </Link>
          </Button>
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-white hover:bg-white/20 bg-black/30 backdrop-blur-sm"
            onClick={handleWishlist}
            disabled={wishLoading}
          >
            <Heart className={`size-5 ${isWishlisted ? "fill-terracotta-500 text-terracotta-500" : ""}`} />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:text-white hover:bg-white/20 bg-black/30 backdrop-blur-sm">
            <Share2 className="size-5" />
          </Button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className="bg-primary text-white border-0">{place.region}</Badge>
              <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">{place.category}</Badge>
              {place.featured && (
                <Badge className="bg-terracotta-500 text-white border-0">Featured</Badge>
              )}
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-2">{place.name}</h1>
            {place.rating > 0 && (
              <div className="flex items-center gap-2 text-white/90">
                <Star className="size-5 fill-terracotta-400 text-terracotta-400" />
                <span className="font-semibold">{place.rating}</span>
                {place.totalReviews > 0 && (
                  <span className="text-white/70">({place.totalReviews} reviews)</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start bg-white border mb-8 h-auto p-1">
            <TabsTrigger value="overview" className="flex-1 sm:flex-none">Overview</TabsTrigger>
            <TabsTrigger value="gallery" className="flex-1 sm:flex-none">Gallery</TabsTrigger>
            <TabsTrigger value="info" className="flex-1 sm:flex-none">Information</TabsTrigger>
            <TabsTrigger value="location" className="flex-1 sm:flex-none">Location</TabsTrigger>
            <TabsTrigger value="reviews" className="flex-1 sm:flex-none">
              <MessageSquare className="size-4 mr-1" /> Reviews ({reviewStats.totalReviews || reviews.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    {place.shortDescription && (
                      <p className="text-lg text-muted-foreground italic mb-4">{place.shortDescription}</p>
                    )}
                    <p className="text-foreground leading-relaxed whitespace-pre-line">{place.description}</p>
                  </CardContent>
                </Card>

                {place.bestTime && (
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Clock className="size-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">Best Time to Visit</h3>
                          <p className="text-sm text-muted-foreground">{place.bestTime}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {place.facilities?.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-foreground mb-3">Facilities</h3>
                      <div className="flex flex-wrap gap-2">
                        {place.facilities.map((facility, i) => (
                          <Badge key={i} variant="secondary">{facility}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="space-y-4">
                <Card className="sticky top-24">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-4">Quick Info</h3>
                    <div className="space-y-3">
                      {place.region && (
                        <div className="flex items-center gap-3 text-sm">
                          <MapPin className="size-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Region:</span>
                          <span className="font-medium text-foreground ml-auto">{place.region}</span>
                        </div>
                      )}
                      {place.category && (
                        <div className="flex items-center gap-3 text-sm">
                          <Star className="size-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Category:</span>
                          <span className="font-medium text-foreground ml-auto">{place.category}</span>
                        </div>
                      )}
                      {place.bestTime && (
                        <div className="flex items-center gap-3 text-sm">
                          <Clock className="size-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Best Time:</span>
                          <span className="font-medium text-foreground ml-auto">{place.bestTime}</span>
                        </div>
                      )}
                    </div>

                    <Separator className="my-4" />

                    {place.entryFee && (place.entryFee.pakistani > 0 || place.entryFee.foreigner > 0) && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Ticket className="size-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">Entry Fee</span>
                        </div>
                        <div className="space-y-1 text-sm">
                          {place.entryFee.pakistani > 0 && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Pakistani</span>
                              <span className="font-medium">PKR {place.entryFee.pakistani.toLocaleString()}</span>
                            </div>
                          )}
                          {place.entryFee.foreigner > 0 && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Foreigner</span>
                              <span className="font-medium">PKR {place.entryFee.foreigner.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <Button asChild className="w-full bg-primary hover:bg-primary/90">
                      <Link to="/booking">
                        Book a Tour
                        <ChevronRight className="size-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="mt-0">
            <Card>
              <CardContent className="p-6">
                {place.gallery?.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {place.gallery.map((img, i) => (
                      <div key={i} className="relative aspect-video rounded-lg overflow-hidden group">
                        <FallbackImage
                          src={img.url}
                          alt={img.alt || `${place.name} ${i + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No additional photos available.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="info" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {place.address && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <MapPin className="size-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground">Address</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{place.address}</p>
                  </CardContent>
                </Card>
              )}

              {place.contactInfo && (place.contactInfo.phone || place.contactInfo.email || place.contactInfo.website) && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-3">Contact Information</h3>
                    <div className="space-y-3">
                      {place.contactInfo.phone && (
                        <div className="flex items-center gap-3 text-sm">
                          <Phone className="size-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{place.contactInfo.phone}</span>
                        </div>
                      )}
                      {place.contactInfo.email && (
                        <div className="flex items-center gap-3 text-sm">
                          <Mail className="size-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{place.contactInfo.email}</span>
                        </div>
                      )}
                      {place.contactInfo.website && (
                        <div className="flex items-center gap-3 text-sm">
                          <Globe className="size-4 text-muted-foreground" />
                          <a href={place.contactInfo.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            Visit Website
                          </a>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="location" className="mt-0">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Location</h3>
                  <Button asChild variant="outline" size="sm">
                    <a
                      href={place.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Navigation className="size-4 mr-2" />
                      Open in Google Maps
                    </a>
                  </Button>
                </div>
                {place.lat && place.lng && (
                  <div className="rounded-lg overflow-hidden border">
                    <iframe
                      title={`Map of ${place.name}`}
                      width="100%"
                      height="400"
                      frameBorder="0"
                      scrolling="no"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${place.lng - 0.05}%2C${place.lat - 0.05}%2C${place.lng + 0.05}%2C${place.lat + 0.05}&layer=mapnik&marker=${place.lat}%2C${place.lng}`}
                      className="w-full"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-0">
            <div className="space-y-6">
              {reviewStats.totalReviews > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-4xl font-bold text-primary">{reviewStats.avgRating}</p>
                        <div className="flex gap-0.5 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`size-4 ${i < Math.round(reviewStats.avgRating) ? "fill-terracotta-400 text-terracotta-400" : "text-gray-300"}`} />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{reviewStats.totalReviews} reviews</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review._id}>
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                              {review.user?.avatar ? (
                                <img src={review.user.avatar} alt="" className="size-9 rounded-full object-cover" />
                              ) : (
                                (review.name || "A").charAt(0).toUpperCase()
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{review.name}</p>
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
                        </div>
                        {review.title && <p className="font-medium text-foreground mt-3">{review.title}</p>}
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{review.comment}</p>
                        {review.replies?.length > 0 && (
                          <div className="mt-3 ml-4 space-y-2 border-l-2 border-primary/20 pl-3">
                            {review.replies.map((reply, i) => (
                              <div key={i}>
                                <span className="text-xs font-medium text-primary">{reply.name}:</span>
                                <span className="text-xs text-muted-foreground ml-1">{reply.comment}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : !reviewLoading ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <MessageSquare className="size-8 text-muted-foreground/40 mx-auto mb-2" />
                    <p className="text-muted-foreground">No reviews yet. Be the first to share your experience!</p>
                  </CardContent>
                </Card>
              ) : null}

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4">Write a Review</h3>
                  {!isAuthenticated ? (
                    <p className="text-sm text-muted-foreground">
                      <Link to="/login" className="text-primary hover:underline">Sign in</Link> to leave a review.
                    </p>
                  ) : (
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div>
                        <Label>Your Rating *</Label>
                        <div className="flex gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((r) => (
                            <button
                              key={r}
                              type="button"
                              onClick={() => setReviewForm((prev) => ({ ...prev, rating: r }))}
                              className="p-0.5"
                            >
                              <Star className={`size-6 ${r <= reviewForm.rating ? "fill-terracotta-400 text-terracotta-400" : "text-gray-300 hover:text-terracotta-200"}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="review-title">Title (optional)</Label>
                        <Input
                          id="review-title"
                          value={reviewForm.title}
                          onChange={(e) => setReviewForm((prev) => ({ ...prev, title: e.target.value }))}
                          placeholder="Summarize your experience"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="review-comment">Your Review *</Label>
                        <Textarea
                          id="review-comment"
                          value={reviewForm.comment}
                          onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                          placeholder="Tell others about your experience..."
                          rows={4}
                          className="mt-1"
                          required
                        />
                      </div>
                      <Button type="submit" disabled={submittingReview} className="bg-primary hover:bg-primary/90">
                        {submittingReview ? <><Loader2 className="size-4 mr-2 animate-spin" /> Submitting...</> : "Submit Review"}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PlaceDetails;
