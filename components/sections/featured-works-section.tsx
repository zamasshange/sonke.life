"use client";

import React from "react";
import { motion } from "framer-motion";
import { Country, COUNTRIES } from "@/lib/types";

export interface CostProfile {
  id: string;
  title: string;
  monthlyRange: { min: number; max: number };
  notes: string[];
}

const FEATURE_IMAGES = [
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=900&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=900&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=900&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&q=85&auto=format&fit=crop",
];

function FadeInSection({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = React.useRef(null);
  const isInView = React.useMemo(() => true, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 70 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 70 }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-primary">
      <span className="h-2 w-2 bg-primary" />
      {children}
    </div>
  );
}

export interface FeaturedWorksSectionProps {
  profiles: CostProfile[];
  defaultWorks?: Array<[string, string, string]>;
  country: Country;
  profilesSource: "ai" | "fallback" | null;
}

export function FeaturedWorksSection({
  profiles,
  defaultWorks,
  country,
  profilesSource,
}: FeaturedWorksSectionProps) {
  const displayProfiles =
    profiles.length > 0
      ? profiles
      : (defaultWorks || []).map((w) => ({
          id: w[0],
          title: w[0],
          monthlyRange: { min: 0, max: 0 },
          notes: [w[2]],
        }));

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-[1480px] px-5 sm:px-8">
        <div className="mb-12 grid gap-8 lg:grid-cols-2 lg:items-end">
          <FadeInSection>
            <SectionLabel>Featured works</SectionLabel>
            <h2 className="text-5xl font-black uppercase leading-[0.92] tracking-normal sm:text-7xl">
              Cost profiles for real online lives.
            </h2>
          </FadeInSection>
          <FadeInSection delay={0.08}>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
              These cards adapt to your selected country. They are generated live when possible,
              and fall back to practical defaults when not.
            </p>
          </FadeInSection>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {displayProfiles.map((profile, index) => (
            <FadeInSection key={profile.id} delay={index * 0.05}>
              <a href="#calculator" className="group block">
                <div className="relative aspect-[1.35] overflow-hidden bg-secondary">
                  <img
                    src={FEATURE_IMAGES[index % FEATURE_IMAGES.length]}
                    alt={`${profile.title} profile`}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/70">
                      {profilesSource === "ai" ? "Live profile" : "Default profile"}
                    </p>
                    <h3 className="mt-2 text-2xl font-black uppercase tracking-normal">
                      {profile.title}
                    </h3>
                    {profile.monthlyRange.max > 0 && (
                      <p className="mt-2 font-mono text-sm font-bold">
                        {COUNTRIES[country].symbol}
                        {profile.monthlyRange.min.toLocaleString()} – {COUNTRIES[country].symbol}
                        {profile.monthlyRange.max.toLocaleString()} / month
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid gap-2 border-b border-black/15 py-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-sm font-bold uppercase text-muted-foreground">
                      Tap to compare with your calculator numbers
                    </span>
                    <span className="text-xs font-black uppercase tracking-[0.22em] text-primary">
                      {COUNTRIES[country].flag} {COUNTRIES[country].currency}
                    </span>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {(profile.notes || []).slice(0, 3).map((note: string) => (
                      <div
                        key={note}
                        className="border border-black/10 bg-secondary/40 p-3 text-sm text-foreground"
                      >
                        {note}
                      </div>
                    ))}
                  </div>
                </div>
              </a>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}