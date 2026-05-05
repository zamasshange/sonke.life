"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, ChevronUp, Menu } from "lucide-react";
import { Marquee } from "@/components/marquee";
import { InputSection } from "@/components/input-section";
import { ResultsCard } from "@/components/results-card";
import { CostTips } from "@/components/cost-tips";
import { BreakdownList } from "@/components/breakdown-list";
import { EarningsSuggestions } from "@/components/earnings-suggestions";
import { CostInsights } from "@/components/cost-insights";
import { AiBudgetAdvisor } from "@/components/ai-budget-advisor";
import { SonkeChatbot } from "@/components/sonke-chatbot";
import { ComparisonCard } from "@/components/comparison-card";
import { ShareCard } from "@/components/share-card";
import { LiveKnowledgePanel } from "@/components/live-knowledge-panel";
import { CurrencyConverterCard } from "@/components/currency-converter-card";
import { CountryFlag } from "@/components/country-flag";
import {
  Country,
  Mode,
  JobType,
  SubscriptionItem,
  ToolItem,
  LivingCosts,
  CostBreakdown,
  COUNTRIES,
} from "@/lib/types";
import { CostProfile } from "@/components/sections/featured-works-section";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=800&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=85&auto=format&fit=crop",
];

const FEATURE_IMAGES = [
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=600&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=85&auto=format&fit=crop",
];

const tickerItems = [
  "Rent",
  "Groceries",
  "Transport",
  "Internet",
  "Subscriptions",
  "Tools",
  "Hardware",
  "Income",
];

const darkMarqueeItems = ["Work smarter", "Spend clearer", "Plan stronger", "Live better", "Earn greater"];

const FEATURED_COUNTRY_CODES: Country[] = ["ZA", "US", "GB", "NG"];

// Collapsible Section Component for Mobile
function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-black/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="text-lg font-bold uppercase tracking-normal">{title}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 shrink-0" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Mobile Navigation Menu
function MobileNav({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween" }}
            className="fixed left-0 top-0 z-50 h-full w-3/4 max-w-sm bg-white p-6"
          >
            <div className="mb-8 flex items-center justify-between">
              <span className="text-xl font-black uppercase tracking-[0.2em] text-primary">
                Sonke
              </span>
              <button onClick={onClose} aria-label="Close menu">
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-4 text-lg font-bold uppercase tracking-[0.1em]">
              <a href="#about" onClick={onClose} className="py-2">
                About us
              </a>
              <a href="#services" onClick={onClose} className="py-2">
                Costs
              </a>
              <a href="#calculator" onClick={onClose} className="py-2">
                Calculator
              </a>
              <a href="#faq" onClick={onClose} className="py-2">
                FAQ
              </a>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export interface MobileLayoutProps {
  // Calculator state props
  country: Country;
  setCountry: React.Dispatch<React.SetStateAction<Country>>;
  jobType: JobType;
  setJobType: React.Dispatch<React.SetStateAction<JobType>>;
  customJobTitle: string;
  setCustomJobTitle: React.Dispatch<React.SetStateAction<string>>;
  monthlyIncome: number;
  setMonthlyIncome: React.Dispatch<React.SetStateAction<number>>;
  mode: Mode;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
  livingCosts: LivingCosts;
  setLivingCosts: React.Dispatch<React.SetStateAction<LivingCosts>>;
  internetCost: number;
  setInternetCost: React.Dispatch<React.SetStateAction<number>>;
  subscriptions: SubscriptionItem[];
  setSubscriptions: React.Dispatch<React.SetStateAction<SubscriptionItem[]>>;
  tools: ToolItem[];
  setTools: React.Dispatch<React.SetStateAction<ToolItem[]>>;
  laptopPrice: number;
  setLaptopPrice: React.Dispatch<React.SetStateAction<number>>;
  laptopMonths: number;
  setLaptopMonths: React.Dispatch<React.SetStateAction<number>>;
  budgetPeriod: "weekly" | "monthly" | "yearly";

  // Computed props
  breakdown: CostBreakdown;
  isSurviving: boolean;

  // Content props
  services: Array<{ icon: React.ElementType; title: string; text: string }>;
  benefits: string[];
  faqs: Array<{ question: string; answer: string }>;
  profiles: CostProfile[];
  defaultWorks: Array<[string, string, string]>;
  profilesSource: "ai" | "fallback" | null;

  // Content strings
  aboutDescription: string;
  aboutHeading: string;
  benefitsHeading: string;
  benefitsDescription: string;
  ctaHeading: string;
}

export function MobileLayout({
  // Calculator state props
  country,
  setCountry,
  jobType,
  setJobType,
  customJobTitle,
  setCustomJobTitle,
  monthlyIncome,
  setMonthlyIncome,
  mode,
  setMode,
  livingCosts,
  setLivingCosts,
  internetCost,
  setInternetCost,
  subscriptions,
  setSubscriptions,
  tools,
  setTools,
  laptopPrice,
  setLaptopPrice,
  laptopMonths,
  setLaptopMonths,
  budgetPeriod,
  // Computed props
  breakdown,
  isSurviving,
  // Content props
  services,
  benefits,
  faqs,
  profiles,
  defaultWorks,
  profilesSource,
  // Content strings
  aboutDescription,
  aboutHeading,
  benefitsHeading,
  benefitsDescription,
  ctaHeading,
}: MobileLayoutProps) {
  const [navOpen, setNavOpen] = useState(false);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const sym = COUNTRIES[country].symbol;
  const remaining = monthlyIncome - breakdown.total;
  const incomeUsed = monthlyIncome > 0 ? Math.round((breakdown.total / monthlyIncome) * 100) : 0;

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
    <main className="min-h-screen bg-background text-foreground pb-20">
      {/* Mobile Header */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-black/[0.08] bg-white/[0.97] backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <img src="/images/logo.png" alt="Sonke" className="h-10 w-10 object-contain" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">
              Real cost
            </span>
          </div>
          <button
            onClick={() => setNavOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-black/15 bg-white"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <MobileNav isOpen={navOpen} onClose={() => setNavOpen(false)} />

      {/* Mobile Hero - Simplified */}
      <section className="mt-14 bg-gradient-to-b from-secondary/50 to-background px-4 pt-6">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/15 bg-secondary px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em]">
          <span className={`h-2 w-2 rounded-full ${isSurviving ? "bg-emerald-500" : "bg-red-500"}`} />
          {isSurviving ? "Surplus" : "At risk"}
        </div>

        <h1 className="select-none text-[15vw] font-black uppercase leading-[0.8] tracking-[-0.02em]">
          <span className="text-foreground">Sonke</span>
          <span className="mx-1 text-[0.3em] font-light text-primary/40">/</span>
          <span className="bg-gradient-to-r from-primary via-orange-500 to-amber-600 bg-clip-text text-transparent">
            Sees.
          </span>
        </h1>

        <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Full monthly reality in one place
        </p>

        {/* Quick Stats */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-white p-3 shadow-sm">
            <p className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground">
              Expenses
            </p>
            <p className="mt-1 font-mono text-sm font-black">
              {sym}{breakdown.total.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl bg-white p-3 shadow-sm">
            <p className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground">
              {isSurviving ? "Left" : "Gap"}
            </p>
            <p className="mt-1 font-mono text-sm font-black">
              {sym}{Math.abs(remaining).toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl bg-white p-3 shadow-sm">
            <p className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground">
              Used
            </p>
            <p className="mt-1 font-mono text-sm font-black">{incomeUsed}%</p>
          </div>
        </div>

        {/* Hero Image Carousel */}
        <div className="relative mt-4 aspect-[16/9] overflow-hidden rounded-2xl bg-[#111]">
          <img
            src={HERO_IMAGES[heroImageIndex]}
            alt="Hero"
            className="h-full w-full object-cover opacity-85"
          />
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
              Reality insight
            </p>
            <p className="mt-1 text-lg font-black uppercase tracking-normal text-white">
              {isSurviving ? "You can breathe this month." : "Your budget needs backup."}
            </p>
          </div>
          <div className="absolute bottom-2 right-2 flex gap-1">
            {HERO_IMAGES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setHeroImageIndex(idx)}
                className={`h-1.5 w-1.5 rounded-full ${heroImageIndex === idx ? "bg-white" : "bg-white/45"}`}
              />
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mt-4 flex flex-col gap-2">
          <a
            href="#calculator"
            className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-white"
          >
            Start your check
          </a>
          <a
            href="#services"
            className="flex items-center justify-center gap-2 rounded-full border border-black/15 px-6 py-3 text-sm font-black uppercase tracking-[0.12em]"
          >
            Explore costs
          </a>
        </div>
      </section>

      {/* Marquee */}
      <div className="border-y border-black bg-secondary py-3">
        <Marquee
          items={tickerItems}
          separator="*"
          className="text-xl font-black uppercase tracking-normal text-black/25"
        />
      </div>

      {/* Calculator Section - Mobile Optimized */}
      <section id="calculator" className="bg-white px-4 py-8">
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            <span className="h-2 w-2 bg-primary" />
            Calculator
          </div>
          <h2 className="text-3xl font-black uppercase leading-[0.9] tracking-normal">
            Enter your monthly costs
          </h2>
        </div>

        {/* Input Section */}
        <div className="mb-6 rounded-2xl border border-black/15 bg-[#f6f6f6] p-3">
          <InputSection
            country={country}
            setCountry={setCountry}
            jobType={jobType}
            setJobType={setJobType}
            customJobTitle={customJobTitle}
            setCustomJobTitle={setCustomJobTitle}
            monthlyIncome={monthlyIncome}
            setMonthlyIncome={setMonthlyIncome}
            mode={mode}
            setMode={setMode}
            livingCosts={livingCosts}
            setLivingCosts={setLivingCosts}
            internetCost={internetCost}
            setInternetCost={setInternetCost}
            subscriptions={subscriptions}
            setSubscriptions={setSubscriptions}
            tools={tools}
            setTools={setTools}
            laptopPrice={laptopPrice}
            setLaptopPrice={setLaptopPrice}
            laptopMonths={laptopMonths}
            setLaptopMonths={setLaptopMonths}
            budgetPeriod={budgetPeriod}
          />
        </div>

        <div className="mb-6 space-y-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            <span className="h-2 w-2 bg-primary" />
            Money tools
          </div>
          <CurrencyConverterCard defaultCountry={country} />
          <LiveKnowledgePanel
            breakdown={breakdown}
            monthlyIncome={monthlyIncome}
            country={country}
          />
        </div>

        {/* Results and Insights - Collapsible */}
        <div className="space-y-2">
          <CollapsibleSection title="Results" defaultOpen={true}>
            <ResultsCard
              breakdown={breakdown}
              monthlyIncome={monthlyIncome}
              country={country}
              budgetPeriod={budgetPeriod}
            />
          </CollapsibleSection>

          <CollapsibleSection title="Cost Tips">
            <CostTips
              breakdown={breakdown}
              subscriptions={subscriptions}
              tools={tools}
              internetCost={internetCost}
              livingCosts={livingCosts}
              country={country}
            />
          </CollapsibleSection>

          <CollapsibleSection title="Breakdown">
            <BreakdownList breakdown={breakdown} country={country} />
          </CollapsibleSection>

          <CollapsibleSection title="Earning Suggestions">
            <EarningsSuggestions
              breakdown={breakdown}
              monthlyIncome={monthlyIncome}
              country={country}
            />
          </CollapsibleSection>

          <CollapsibleSection title="Cost Insights">
            <CostInsights
              breakdown={breakdown}
              subscriptions={subscriptions}
              tools={tools}
              internetCost={internetCost}
              livingCosts={livingCosts}
              country={country}
            />
          </CollapsibleSection>

          <CollapsibleSection title="AI Budget Advisor">
            <AiBudgetAdvisor
              breakdown={breakdown}
              monthlyIncome={monthlyIncome}
              country={country}
            />
          </CollapsibleSection>

          <CollapsibleSection title="Chat with Sonke">
            <SonkeChatbot
              breakdown={breakdown}
              monthlyIncome={monthlyIncome}
              country={country}
            />
          </CollapsibleSection>

          <CollapsibleSection title="Country Comparison">
            <ComparisonCard breakdown={breakdown} currentCountry={country} />
          </CollapsibleSection>

          <CollapsibleSection title="Share">
            <ShareCard
              breakdown={breakdown}
              monthlyIncome={monthlyIncome}
              country={country}
            />
          </CollapsibleSection>
        </div>
      </section>

      {/* About Section - Mobile */}
      <section id="about" className="bg-white px-4 py-12">
        <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
          <span className="h-2 w-2 bg-primary" />
          About us
        </div>
        <p className="mb-4 text-base leading-relaxed text-muted-foreground">{aboutDescription}</p>
        <h2 className="text-3xl font-black uppercase leading-[0.9] tracking-normal">
          {aboutHeading}
        </h2>
      </section>

      {/* Services Section - Mobile */}
      <section id="services" className="bg-secondary px-4 py-12">
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            <span className="h-2 w-2 bg-primary" />
            What we work on
          </div>
          <h2 className="text-3xl font-black uppercase leading-[0.9] tracking-normal">
            Full cost clarity for modern living
          </h2>
        </div>

        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service.title}
              className="flex items-start gap-4 rounded-xl border border-black/15 bg-white p-4"
            >
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-primary text-white">
                <service.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-normal">
                  {service.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{service.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dark Marquee */}
      <section className="overflow-hidden bg-[#141414] py-8 text-white">
        <Marquee
          items={darkMarqueeItems}
          separator="*"
          className="text-3xl font-black uppercase tracking-normal text-white"
        />
      </section>

      {/* Benefits Section - Mobile */}
      <section className="bg-secondary px-4 py-12">
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            <span className="h-2 w-2 bg-primary" />
            Benefits
          </div>
          <h2 className="text-3xl font-black uppercase leading-[0.9] tracking-normal">
            {benefitsHeading}
          </h2>
        </div>
        <p className="mb-6 text-base leading-relaxed text-muted-foreground">
          {benefitsDescription}
        </p>

        <div className="space-y-3">
          {benefits.map((benefit) => (
            <div
              key={benefit}
              className="flex items-center gap-3 rounded-xl border border-black/15 bg-white p-4"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-white">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="text-base font-black uppercase tracking-normal">{benefit}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Works - Mobile */}
      <section className="bg-white px-4 py-12">
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            <span className="h-2 w-2 bg-primary" />
            Featured works
          </div>
          <h2 className="text-3xl font-black uppercase leading-[0.9] tracking-normal">
            Cost profiles for real online lives
          </h2>
        </div>

        <div className="space-y-4">
          {displayProfiles.map((profile, index) => (
            <a
              key={profile.id}
              href="#calculator"
              className="group block overflow-hidden rounded-2xl bg-secondary"
            >
              <div className="relative aspect-[16/9]">
                <img
                  src={FEATURE_IMAGES[index % FEATURE_IMAGES.length]}
                  alt={profile.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">
                    {profilesSource === "ai" ? "Live profile" : "Default profile"}
                  </p>
                  <h3 className="mt-1 text-xl font-black uppercase tracking-normal">
                    {profile.title}
                  </h3>
                </div>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2">
                  {(profile.notes || []).slice(0, 3).map((note) => (
                    <span
                      key={note}
                      className="rounded-full bg-secondary/60 px-3 py-1 text-xs"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* FAQ Section - Mobile */}
      <section id="faq" className="bg-secondary px-4 py-12">
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            <span className="h-2 w-2 bg-primary" />
            FAQ
          </div>
          <h2 className="text-3xl font-black uppercase leading-[0.9] tracking-normal">
            Frequently asked questions
          </h2>
        </div>

        <div className="space-y-2">
          {faqs.map((faq) => (
            <CollapsibleSection key={faq.question} title={faq.question}>
              <p className="text-base leading-relaxed text-muted-foreground">{faq.answer}</p>
            </CollapsibleSection>
          ))}
        </div>
      </section>

      {/* CTA Section - Mobile */}
      <section className="relative overflow-hidden bg-[#141414] px-4 py-12 text-white">
        <div className="absolute inset-0 opacity-20">
          <img
            src={FEATURE_IMAGES[3]}
            alt="Background"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/80 to-primary/20" />

        <div className="relative">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-primary">
            Before the month surprises you
          </p>
          <h2 className="mb-6 text-3xl font-black uppercase leading-[0.9] tracking-normal">
            {ctaHeading}
          </h2>

          <div className="mb-6 flex flex-col gap-2">
            <a
              href="#calculator"
              className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-white"
            >
              Check my month
            </a>
            <a
              href="#faq"
              className="flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-white"
            >
              Learn more
            </a>
          </div>

          {/* Supported Countries */}
          <div className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-white/50">
              Supported countries
            </p>
            <div className="grid grid-cols-2 gap-2">
              {FEATURED_COUNTRY_CODES.map((code) => {
                const countryItem = COUNTRIES[code];
                return (
                  <div key={code} className="rounded-lg bg-black/25 p-2">
                    <CountryFlag country={code} className="h-5 w-8 object-cover" />
                    <p className="text-[10px] font-bold uppercase text-white/80">
                      {countryItem.code}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Mobile */}
      <footer className="bg-black px-4 py-10 text-white">
        <div className="mb-6">
          <img
            src="/images/favicon.png"
            alt="Sonke"
            className="mb-4 h-20 w-20 object-contain"
          />
          <h2 className="text-5xl font-black uppercase leading-[0.8] tracking-normal">Sonke.</h2>
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            A financial mirror for real life: income, rent, groceries, transport, data,
            subscriptions, tools, and the choices that shape the month.
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              Navigate
            </p>
            <div className="space-y-2 text-xs font-bold uppercase text-white/60">
              <a href="#about" className="block">About</a>
              <a href="#services" className="block">Costs</a>
              <a href="#calculator" className="block">Calculator</a>
              <a href="#faq" className="block">FAQ</a>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-primary p-4">
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/70">
              Contact
            </p>
            <a href="mailto:sonkebusiness@gmail.com" className="text-sm font-black hover:underline">
              sonkebusiness@gmail.com
            </a>
            <p className="mt-2 text-xs text-white/75">Available worldwide</p>
            <p className="text-xs text-white/75">Mo-Fr / 9am-6pm</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 pt-4 text-[10px] font-bold uppercase tracking-[0.15em] text-white/35">
          <p>sonke.life</p>
          <p>Budget mirror, not bank advice</p>
        </div>
      </footer>
    </main>
  );
}