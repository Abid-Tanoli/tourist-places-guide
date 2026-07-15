import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import FallbackImage from "./FallbackImage";
import { ChevronLeft, ChevronRight, Mountain, Search, Star, Users } from "lucide-react";

const SLIDE_INTERVAL_MS = 5500;

const HeroSlider = ({
  slides = [],
  searchValue,
  onSearchChange,
  onSearchSubmit,
  stats = {},
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const pauseReasonsRef = useRef(new Set());
  const timerRef = useRef(null);

  const hasSlides = slides.length > 0;

  const isPaused = pauseReasonsRef.current.size > 0;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    timerRef.current = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, SLIDE_INTERVAL_MS);
  }, [clearTimer, slides.length]);

  useEffect(() => {
    clearTimer();
    if (hasSlides && !isPaused) {
      startTimer();
    }
    return clearTimer;
  }, [hasSlides, isPaused, startTimer, clearTimer]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        pauseReasonsRef.current.add("hidden");
      } else {
        pauseReasonsRef.current.delete("hidden");
      }
      pauseReasonsRef.current = new Set(pauseReasonsRef.current);
      if (pauseReasonsRef.current.size === 0 && hasSlides) {
        startTimer();
      } else {
        clearTimer();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [hasSlides, startTimer, clearTimer]);

  const addPause = (reason) => {
    pauseReasonsRef.current.add(reason);
    pauseReasonsRef.current = new Set(pauseReasonsRef.current);
    clearTimer();
  };

  const removePause = (reason) => {
    pauseReasonsRef.current.delete(reason);
    pauseReasonsRef.current = new Set(pauseReasonsRef.current);
    if (pauseReasonsRef.current.size === 0 && hasSlides) {
      startTimer();
    }
  };

  const navigateTo = (index) => {
    setActiveIndex(index);
    startTimer();
  };

  const goToPrevious = () => navigateTo((activeIndex - 1 + slides.length) % slides.length);
  const goToNext = () => navigateTo((activeIndex + 1) % slides.length);

  if (!hasSlides) return null;

  return (
    <section className="relative flex h-[85vh] min-h-[500px] sm:min-h-[600px] items-center overflow-hidden">
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <FallbackImage
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
                <h1 className="font-heading mb-4 text-4xl font-bold leading-tight text-white sm:mb-6 sm:text-5xl md:text-6xl lg:text-7xl">
                  {slide.heading}
                  <span className="block text-terracotta-400">{slide.headingAccent}</span>
                </h1>
                <p className="mb-8 max-w-lg text-base leading-relaxed text-white/80 sm:text-lg">
                  {slide.subheading}
                </p>
              </div>
            ))}
          </div>

          <div
            className="max-w-lg rounded-xl border border-white/20 bg-white/10 p-2 backdrop-blur-md"
            onMouseEnter={() => addPause("controls")}
            onMouseLeave={() => removePause("controls")}
          >
            <form onSubmit={onSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/50" />
                <Input
                  type="text"
                  placeholder="Where do you want to go?"
                  value={searchValue}
                  onChange={(event) => onSearchChange(event.target.value)}
                  onFocus={() => addPause("search")}
                  onBlur={() => removePause("search")}
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

      <div
        className="absolute inset-x-0 bottom-6 z-10 flex items-center justify-center gap-2 px-4"
        onMouseEnter={() => addPause("controls")}
        onMouseLeave={() => removePause("controls")}
      >
        {slides.map((slide, index) => (
          <button
            key={slide.badge}
            type="button"
            aria-label={`Show ${slide.badge} slide`}
            onClick={() => navigateTo(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === activeIndex ? "w-9 bg-terracotta-400" : "w-2.5 bg-white/45 hover:bg-white/80"
            }`}
          />
        ))}
      </div>

      <div
        className="absolute left-0 right-0 top-1/2 z-10 flex -translate-y-1/2 justify-between px-3 sm:px-6"
        onMouseEnter={() => addPause("controls")}
        onMouseLeave={() => removePause("controls")}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Previous hero slide"
          onClick={goToPrevious}
          className="size-11 rounded-full bg-black/25 text-white backdrop-blur-sm hover:bg-black/40 hover:text-white"
        >
          <ChevronLeft className="size-6" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Next hero slide"
          onClick={goToNext}
          className="size-11 rounded-full bg-black/25 text-white backdrop-blur-sm hover:bg-black/40 hover:text-white"
        >
          <ChevronRight className="size-6" />
        </Button>
      </div>
    </section>
  );
};

export default HeroSlider;
