"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

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

export interface BenefitsSectionProps {
  heading: string;
  description: string;
  benefits: string[];
}

export function BenefitsSection({ heading, description, benefits }: BenefitsSectionProps) {
  return (
    <section className="bg-secondary py-20 sm:py-28">
      <div className="mx-auto max-w-[1480px] px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.6fr_0.4fr]">
          <FadeInSection>
            <SectionLabel>Benefits</SectionLabel>
            <h2 className="text-5xl font-black uppercase leading-[0.92] tracking-normal sm:text-7xl">
              {heading}
            </h2>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {description}
            </p>
          </FadeInSection>
          <FadeInSection delay={0.08}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-4 border border-black/15 bg-white p-5"
                >
                  <span className="grid h-10 w-10 place-items-center bg-primary text-white">
                    <Check className="h-5 w-5" />
                  </span>
                  <span className="text-lg font-black uppercase tracking-normal">{benefit}</span>
                </div>
              ))}
            </div>
          </FadeInSection>
        </div>
      </div>
    </section>
  );
}