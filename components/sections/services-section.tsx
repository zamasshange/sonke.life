"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

const FEATURE_IMAGES = [
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=900&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=900&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=900&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&q=85&auto=format&fit=crop",
];

interface Service {
  icon: LucideIcon;
  title: string;
  text: string;
}

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

export interface ServicesSectionProps {
  services: Service[];
}

export function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <section id="services" className="bg-secondary py-20 sm:py-28">
      <div className="mx-auto max-w-[1480px] px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.48fr_0.52fr] lg:items-end">
          <FadeInSection>
            <ParallaxImage src={FEATURE_IMAGES[0]} alt="Budget planning workspace" className="aspect-[4/5]" />
          </FadeInSection>
          <div>
            <FadeInSection>
              <SectionLabel>What we work on</SectionLabel>
              <h2 className="max-w-3xl text-5xl font-black uppercase leading-[0.92] tracking-normal sm:text-7xl">
                Full cost clarity for modern living.
              </h2>
            </FadeInSection>
            <div className="mt-12 divide-y divide-black/15 border-y border-black/15">
              {services.map((service, index) => (
                <FadeInSection key={service.title} delay={index * 0.04}>
                  <div className="grid gap-5 py-7 sm:grid-cols-[72px_0.8fr_1fr] sm:items-start">
                    <div className="grid h-14 w-14 place-items-center bg-primary text-white">
                      <service.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-normal">{service.title}</h3>
                    <p className="text-muted-foreground">{service.text}</p>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}