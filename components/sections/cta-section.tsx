"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Country, COUNTRIES } from "@/lib/types";
import { CountryFlag } from "@/components/country-flag";

const FEATURE_IMAGES = [
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=900&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=900&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=900&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&q=85&auto=format&fit=crop",
];

const FEATURED_COUNTRY_CODES: Country[] = ["ZA", "US", "GB", "NG"];

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

export interface CtaSectionProps {
  heading: string;
  subheading?: string;
}

export function CtaSection({ heading, subheading }: CtaSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[#141414] py-20 text-white sm:py-28">
      <div className="absolute inset-0 opacity-25">
        <img
          src={FEATURE_IMAGES[3]}
          alt="Financial planning background"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,20,20,0.96),rgba(20,20,20,0.7),rgba(255,77,0,0.25))]" />
      <div className="relative mx-auto max-w-[1480px] px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.68fr_0.32fr] lg:items-end">
          <FadeInSection>
            <SectionLabel>Before the month surprises you</SectionLabel>
            <h2 className="max-w-5xl text-5xl font-black uppercase leading-[0.9] tracking-normal sm:text-7xl lg:text-8xl">
              {heading}
            </h2>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="#calculator"
                className="inline-flex items-center justify-center gap-3 bg-primary px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-white transition-transform hover:-translate-y-1"
              >
                Check my month <ArrowUpRight className="h-5 w-5" />
              </a>
              <a
                href="#faq"
                className="inline-flex items-center justify-center border border-white/20 px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-white transition-colors hover:bg-white hover:text-black"
              >
                Learn more
              </a>
            </div>
          </FadeInSection>
          <FadeInSection delay={0.12}>
            <div className="border border-white/15 bg-white/10 p-5 backdrop-blur-md">
              <div className="mb-5">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-white/50">
                  Supported countries
                </p>
                <p className="mt-1 text-2xl font-black uppercase">Local first, global ready</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {FEATURED_COUNTRY_CODES.map((code) => {
                  const countryItem = COUNTRIES[code];
                  return (
                    <div key={countryItem.code} className="border border-white/10 bg-black/25 p-3">
                      <CountryFlag country={countryItem.code} className="h-6 w-9 object-cover" />
                      <p className="mt-2 text-xs font-bold uppercase tracking-wider text-white/80">
                        {countryItem.code}
                      </p>
                      <p className="mt-2 text-xs font-bold uppercase tracking-wider text-white/55">
                        {countryItem.currency}
                      </p>
                    </div>
                  );
                })}
              </div>
              <a
                href="#calculator"
                className="mt-4 inline-flex items-center gap-2 border border-white/20 px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white/80 transition-colors hover:bg-white hover:text-black"
              >
                See all countries in calculator
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <p className="mt-3 text-xs text-white/55">
                Showing top markets only here to keep layout clean.
              </p>
            </div>
          </FadeInSection>
        </div>
      </div>
    </section>
  );
}