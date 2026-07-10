import React, { useEffect, useState } from "react";
import api from "../api/axios";
import FeedBackList from "../components/FeedBackList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Loader2, CheckCircle } from "lucide-react";

const getApiError = (error, fallback) => {
  const apiErrors = error.response?.data?.errors;
  if (apiErrors?.length) return apiErrors[0].message;
  return error.response?.data?.message || fallback;
};

const emptyFeedback = {
  name: "",
  email: "",
  country: "",
  rating: "",
  feedBackText: "",
};

const Feedback = () => {
  const [feedBack, setFeedBack] = useState(emptyFeedback);
  const [allFeedBack, setAllFeedBack] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [warning, setWarning] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await api.get("/feedback");
        setAllFeedBack(data);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message || "Unable to load feedback."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedBack((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedBack.name.trim() || !feedBack.feedBackText.trim()) {
      setWarning("Name and feedback cannot be empty!");
      setTimeout(() => setWarning(""), 4000);
      return;
    }

    try {
      setSubmitted(true);
      setWarning("");
      const { data } = await api.post("/feedback", {
        ...feedBack,
        rating: feedBack.rating ? Number(feedBack.rating) : undefined,
      });
      setAllFeedBack((prev) => [data, ...prev]);
      setFeedBack(emptyFeedback);
      setTimeout(() => setSubmitted(false), 2000);
    } catch (requestError) {
      setWarning(getApiError(requestError, "Unable to submit feedback."));
      setSubmitted(false);
      setTimeout(() => setWarning(""), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-sand-50">
      <div className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-3">Share Your Experience</h1>
          <p className="text-white/80 text-lg">Help other travelers by sharing your feedback</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Leave Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                {warning && (
                  <div className="mb-4 p-3 text-sm bg-destructive/10 text-destructive rounded-lg">
                    {warning}
                  </div>
                )}
                {submitted && (
                  <div className="mb-4 p-3 text-sm bg-primary/10 text-primary rounded-lg flex items-center gap-2">
                    <CheckCircle className="size-4" />
                    Feedback submitted successfully!
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Name *</Label>
                    <Input
                      name="name"
                      value={feedBack.name}
                      onChange={handleChange}
                      placeholder="Your name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      name="email"
                      value={feedBack.email}
                      onChange={handleChange}
                      type="email"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Input
                      name="country"
                      value={feedBack.country}
                      onChange={handleChange}
                      placeholder="Your country"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Your Rating</Label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setFeedBack((prev) => ({ ...prev, rating: String(value) }))}
                          className="p-1 transition-transform hover:scale-110"
                        >
                          <Star
                            className={`size-7 ${
                              feedBack.rating === String(value)
                                ? "fill-terracotta-500 text-terracotta-500"
                                : "text-muted-foreground/30 hover:text-terracotta-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Feedback *</Label>
                    <Textarea
                      name="feedBackText"
                      value={feedBack.feedBackText}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Tell us about your experience..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitted}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    {submitted ? (
                      <><Loader2 className="size-4 mr-2 animate-spin" /> Submitting...</>
                    ) : (
                      "Submit Feedback"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Recent Reviews</h2>
            {loading && (
              <div className="text-center py-8">
                <Loader2 className="size-6 animate-spin text-primary mx-auto" />
              </div>
            )}
            {error && <p className="text-destructive text-center">{error}</p>}
            {!loading && !error && allFeedBack.length === 0 && (
              <p className="text-muted-foreground text-center py-8">No feedback submitted yet.</p>
            )}
            {!loading && !error && allFeedBack.length > 0 && (
              <FeedBackList feedBacks={allFeedBack} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
