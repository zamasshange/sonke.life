"use client";

import React from "react";
import { motion } from "framer-motion";

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

export interface AboutSectionProps {
  description: string;
  heading: string;
}

export function AboutSection({ description, heading }: AboutSectionProps) {
  return (
    <section id="about" className="bg-white py-20 sm:py-28">
      <div className="mx-auto grid max-w-[1480px] gap-12 px-5 sm:px-8 lg:grid-cols-[0.38fr_0.62fr]">
        <FadeInSection>
          <SectionLabel>About us</SectionLabel>
          <p className="max-w-sm text-lg leading-relaxed text-muted-foreground">{description}</p>
        </FadeInSection>
        <FadeInSection delay={0.1}>
          <h2 className="text-5xl font-black uppercase leading-[0.92] tracking-normal sm:text-7xl lg:text-8xl">
            {heading}
          </h2>
        </FadeInSection>
      </div>
    </section>
  );
}