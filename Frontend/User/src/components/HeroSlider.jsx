import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, MapPin, Mountain, Search, Star, Users } from "lucide-react";

const SLIDE_INTERVAL_MS = 5500;

const HeroSlider = ({
  slides = [],
  searchValue,
  onSearchChange,
  onSearchSubmit,
  stats = {},
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const hasSlides = slides.length > 0;

  useEffect(() => {
    if (!hasSlides || isPaused) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [hasSlides, isPaused, slides.length]);

  const goToPrevious = () => {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
  };

  if (!hasSlides) return null;

  return (
    <section
      className="relative flex h-[85vh] min-h-[600px] items-center overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <img
            key={slide.image}
            src={slide.image}
            alt={slide.alt || `${slide.badge} destination`}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out ${
              index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/85 via-teal-900/55 to-transparent" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <div className="relative min-h-[270px] sm:min-h-[330px]">
            {slides.map((slide, index) => (
              <div
                key={`${slide.badge}-${slide.headingAccent}`}
                className={`absolute inset-0 transition-all duration-700 ease-out ${
                  index === activeIndex
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-4 opacity-0"
                }`}
              >
                <Badge className="mb-4 border-0 bg-terracotta-500 text-white">{slide.badge}</Badge>
                <h1 className="font-heading mb-6 text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">
                  {slide.heading}
                  <span className="block text-terracotta-400">{slide.headingAccent}</span>
                </h1>
                <p className="mb-8 max-w-lg text-lg leading-relaxed text-white/80">
                  {slide.subheading}
                </p>
              </div>
            ))}
          </div>

          <div className="max-w-lg rounded-xl border border-white/20 bg-white/10 p-2 backdrop-blur-md">
            <form onSubmit={onSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/50" />
                <Input
                  type="text"
                  placeholder="Where do you want to go?"
                  value={searchValue}
                  onChange={(event) => onSearchChange(event.target.value)}
                  className="h-11 border-0 bg-transparent pl-10 text-white placeholder:text-white/50 focus-visible:ring-0"
                />
              </div>
              <Button type="submit" className="h-11 bg-terracotta-500 px-6 text-white hover:bg-terracotta-600">
                Explore
              </Button>
            </form>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-white/70">
            <div className="flex items-center gap-2"><Mountain className="size-4 text-terracotta-400" />{stats.totalPlaces || 50}+ Destinations</div>
            <div className="flex items-center gap-2"><Star className="size-4 text-terracotta-400" />{stats.averageRating || 4.8} Average Rating</div>
            <div className="flex items-center gap-2"><Users className="size-4 text-terracotta-400" />{stats.happyTravelers ? `${stats.happyTravelers}+` : "10K+"} Happy Travelers</div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-6 z-10 flex items-center justify-center gap-2 px-4">
        {slides.map((slide, index) => (
          <button
            key={slide.badge}
            type="button"
            aria-label={`Show ${slide.badge} slide`}
            onClick={() => setActiveIndex(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === activeIndex ? "w-9 bg-terracotta-400" : "w-2.5 bg-white/45 hover:bg-white/80"
            }`}
          />
        ))}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Previous hero slide"
        onClick={goToPrevious}
        className="absolute left-3 top-1/2 z-10 size-11 -translate-y-1/2 rounded-full bg-black/25 text-white backdrop-blur-sm hover:bg-black/40 hover:text-white sm:left-6"
      >
        <ChevronLeft className="size-6" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Next hero slide"
        onClick={goToNext}
        className="absolute right-3 top-1/2 z-10 size-11 -translate-y-1/2 rounded-full bg-black/25 text-white backdrop-blur-sm hover:bg-black/40 hover:text-white sm:right-6"
      >
        <ChevronRight className="size-6" />
      </Button>
    </section>
  );
};

export default HeroSlider;
