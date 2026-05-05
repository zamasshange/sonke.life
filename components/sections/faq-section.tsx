"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

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

function ParallaxImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <motion.div
      className={`overflow-hidden bg-secondary ${className}`}
      initial={{ clipPath: "inset(10% 0 10% 0)", opacity: 0 }}
      whileInView={{ clipPath: "inset(0% 0 0% 0)", opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.img
        src={src}
        alt={alt}
        className="h-[120%] w-full object-cover"
        initial={{ y: "-9%" }}
        whileInView={{ y: "9%" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      />
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

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqSectionProps {
  faqs: FaqItem[];
}

export function FaqSection({ faqs }: FaqSectionProps) {
  return (
    <section id="faq" className="bg-secondary py-20 sm:py-28">
      <div className="mx-auto max-w-[1480px] px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.42fr_0.58fr]">
          <FadeInSection>
            <SectionLabel>Frequently asked questions</SectionLabel>
            <ParallaxImage src={FEATURE_IMAGES[2]} alt="Team reviewing costs" className="mt-8 aspect-[4/5]" />
          </FadeInSection>
          <div className="divide-y divide-black/15 border-y border-black/15">
            {faqs.map((faq, index) => (
              <FadeInSection key={faq.question} delay={index * 0.04}>
                <details className="group py-7">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-2xl font-black uppercase tracking-normal">
                    {faq.question}
                    <ChevronDown className="h-6 w-6 shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </p>
                </details>
              </FadeInSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}