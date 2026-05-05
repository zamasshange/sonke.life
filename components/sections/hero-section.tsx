"use client";

import React, { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Country, CostBreakdown, COUNTRIES } from "@/lib/types";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1800&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1800&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1800&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1800&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1800&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1800&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1800&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1800&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1800&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1800&q=85&auto=format&fit=crop",
];

interface HeroStats {
  label: string;
  value: string;
}

export interface HeroSectionProps {
  breakdown: CostBreakdown;
  monthlyIncome: number;
  country: Country;
  isSurviving: boolean;
}

export function HeroSection({ breakdown, monthlyIncome, country, isSurviving }: HeroSectionProps) {
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const sym = COUNTRIES[country].symbol;
  const remaining = monthlyIncome - breakdown.total;
  const incomeUsed = monthlyIncome > 0 ? Math.round((breakdown.total / monthlyIncome) * 100) : 0;

  const heroStats: HeroStats[] = useMemo(
    () => [
      {
        label: "Monthly expenses",
        value: `${sym}${breakdown.total.toLocaleString()}`,
      },
      {
        label: isSurviving ? "Money left" : "Monthly gap",
        value: `${sym}${Math.abs(remaining).toLocaleString()}`,
      },
      {
        label: "Income used",
        value: `${incomeUsed}%`,
      },
    ],
    [breakdown.total, incomeUsed, isSurviving, remaining, sym]
  );

  const goToPrevHeroImage = () => {
    setHeroImageIndex((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
  };

  const goToNextHeroImage = () => {
    setHeroImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
  };

  const handleHeroTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleHeroTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current == null) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const deltaX = endX - touchStartX.current;
    if (Math.abs(deltaX) > 45) {
      if (deltaX < 0) {
        goToNextHeroImage();
      } else {
        goToPrevHeroImage();
      }
    }
    touchStartX.current = null;
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary/50 via-background to-background pt-[6.5rem] sm:pt-[7rem]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(255,77,0,0.09),transparent)]"
      />
      <div className="relative mx-auto max-w-[1480px] px-5 pb-10 sm:px-8 lg:pb-16">
        <div className="grid gap-9 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
          <div className="pt-6 lg:pt-10">
            <motion.div
              initial={{ opacity: 0, y: 70 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-7 inline-flex items-center gap-3 border border-black/15 bg-secondary px-4 py-3 text-xs font-black uppercase tracking-[0.2em]">
                <span className={`h-3 w-3 ${isSurviving ? "bg-emerald-500" : "bg-red-500"}`} />
                Live money mirror
              </div>
              <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
                Sonke helps everyday people see the full cost of life: rent, groceries, transport,
                data, digital tools and the income pressure behind every month.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 70 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="mt-8 select-none text-[18vw] font-black uppercase leading-[0.82] tracking-[-0.02em] sm:mt-10 sm:text-[12vw] lg:text-[9.2vw]">
                <span className="relative inline-block text-foreground [text-shadow:0_2px_0_rgba(0,0,0,0.06)]">
                  Sonke
                </span>
                <span className="mx-2 inline-block align-middle text-[0.35em] font-light text-primary/40 sm:mx-3">
                  /
                </span>
                <span className="bg-gradient-to-r from-primary via-orange-500 to-amber-600 bg-clip-text text-transparent [text-shadow:none]">
                  Sees.
                </span>
              </h1>
              <p className="mt-4 max-w-lg text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
                Full monthly reality — living + digital — in one place.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 70 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#calculator"
                  className="inline-flex items-center justify-center gap-3 bg-primary px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-white transition-transform hover:-translate-y-1"
                >
                  Start your check <ArrowUpRight className="h-5 w-5" />
                </a>
                <a
                  href="#services"
                  className="inline-flex items-center justify-center border border-black/15 px-7 py-4 text-sm font-black uppercase tracking-[0.14em] transition-colors hover:bg-black hover:text-white"
                >
                  Explore costs
                </a>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 70 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="mb-5 flex items-center justify-between gap-4 text-xs font-black uppercase tracking-[0.22em]">
              <span>Real life index</span>
              <span>{isSurviving ? "Surplus" : "At risk"}</span>
            </div>
            <motion.div
              className="relative aspect-[16/10] overflow-hidden bg-[#111]"
              whileHover={{ scale: 0.985 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              onTouchStart={handleHeroTouchStart}
              onTouchEnd={handleHeroTouchEnd}
            >
              <motion.img
                key={heroImageIndex}
                src={HERO_IMAGES[heroImageIndex]}
                alt="Abstract digital cost interface"
                className="h-full w-full object-cover opacity-85"
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              />
              <div className="absolute inset-0 bg-black/20" />
              <button
                type="button"
                onClick={goToPrevHeroImage}
                className="absolute left-3 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center bg-white/90 text-black transition hover:bg-white"
                aria-label="Previous hero image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={goToNextHeroImage}
                className="absolute right-3 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center bg-white/90 text-black transition hover:bg-white"
                aria-label="Next hero image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <button
                className="absolute left-6 top-6 grid h-20 w-20 place-items-center bg-white text-primary transition-transform hover:scale-105"
                aria-label="Preview Sonke"
              >
                <Play className="h-8 w-8 translate-x-0.5 fill-current" />
              </button>
              <div className="absolute bottom-24 left-1/2 z-20 flex -translate-x-1/2 gap-2">
                {HERO_IMAGES.map((_, index) => (
                  <button
                    key={`hero-dot-${index}`}
                    type="button"
                    onClick={() => setHeroImageIndex(index)}
                    aria-label={`Go to hero image ${index + 1}`}
                    className={`h-2.5 w-2.5 rounded-full transition ${
                      heroImageIndex === index ? "bg-white" : "bg-white/45"
                    }`}
                  />
                ))}
              </div>
              <div className="absolute right-4 top-4 grid gap-3 sm:right-6 sm:top-6">
                {heroStats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + index * 0.1 }}
                    className="min-w-40 bg-white/95 p-4 text-black shadow-2xl"
                  >
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-black/45">
                      {stat.label}
                    </p>
                    <p className="mt-1 font-mono text-2xl font-black">{stat.value}</p>
                  </motion.div>
                ))}
              </div>
              <motion.div
                className={`absolute bottom-0 left-0 right-0 p-5 text-white sm:p-7 ${
                  isSurviving ? "bg-emerald-600" : "bg-primary"
                }`}
                initial={{ y: 80 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.45, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-xs font-bold uppercase tracking-[0.22em]">Reality insight</p>
                <p className="mt-2 text-2xl font-black uppercase tracking-normal sm:text-4xl">
                  {isSurviving ? "You can breathe this month." : "Your budget needs backup."}
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}