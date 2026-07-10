import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mountain, Map, CalendarCheck, MessageSquare, ArrowRight } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-sand-50">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1524492449090-1a0636b2e3f4?auto=format&fit=crop&w=1350&q=80"
            alt="Pakistan Mountains"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 via-teal-900/50 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            About Pakistan Explorer
          </h1>
          <p className="text-lg text-white/80 max-w-2xl">
            Your trusted partner for discovering the beauty of Pakistan
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <Card className="mb-8">
          <CardContent className="p-8">
            <p className="text-lg text-foreground leading-relaxed mb-6">
              Discover the beauty of Pakistan through its diverse <strong>regions</strong> and <strong>categories of attractions</strong>. From the breathtaking mountains of the north to the cultural heritage of historic cities, this guide helps you explore everything Pakistan has to offer.
            </p>
            <p className="text-lg text-foreground leading-relaxed">
              With Pakistan Explorer, you can easily <strong>search</strong> and <strong>filter places</strong>, view detailed descriptions with images, ratings, and the best time to visit. You can also explore <strong>recommended tours</strong> that connect multiple destinations into unforgettable journeys.
            </p>
          </CardContent>
        </Card>

        <h2 className="font-heading text-3xl font-bold text-foreground mb-8 text-center">Why Choose Us</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {[
            { icon: Map, title: "Interactive Maps", desc: "Visualize tours and routes with our integrated mapping system" },
            { icon: CalendarCheck, title: "Easy Booking", desc: "Seamless tour booking for local and foreign visitors" },
            { icon: MessageSquare, title: "Real Reviews", desc: "Authentic tourist feedback to help you make informed decisions" },
            { icon: Mountain, title: "Curated Tours", desc: "Expertly designed itineraries covering Pakistan's best destinations" },
          ].map((feat, i) => (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <feat.icon className="size-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{feat.title}</h3>
                  <p className="text-sm text-muted-foreground">{feat.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-primary text-white">
          <CardContent className="p-8 text-center">
            <h3 className="font-heading text-2xl font-bold mb-4">Ready to Start Your Journey?</h3>
            <p className="text-white/80 mb-6 max-w-lg mx-auto">
              Built with modern technologies to provide a smooth, engaging, and memorable travel experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-white text-primary hover:bg-white/90">
                <Link to="/tours">
                  Browse Tours <ArrowRight className="size-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Link to="/feedback">Read Reviews</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
