"use client";

import React, { Dispatch, SetStateAction } from "react";
import { LucideIcon } from "lucide-react";
import { Marquee } from "@/components/marquee";
import {
  Header,
  HeroSection,
  CalculatorSection,
  ServicesSection,
  AboutSection,
  BenefitsSection,
  FeaturedWorksSection,
  FaqSection,
  CtaSection,
  FooterSection,
  CostProfile,
} from "@/components/sections";
import {
  Country,
  Mode,
  JobType,
  SubscriptionItem,
  ToolItem,
  LivingCosts,
  CostBreakdown,
} from "@/lib/types";

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

export interface DesktopLayoutProps {
  // Calculator state props
  country: Country;
  setCountry: Dispatch<SetStateAction<Country>>;
  jobType: JobType;
  setJobType: Dispatch<SetStateAction<JobType>>;
  customJobTitle: string;
  setCustomJobTitle: Dispatch<SetStateAction<string>>;
  monthlyIncome: number;
  setMonthlyIncome: Dispatch<SetStateAction<number>>;
  mode: Mode;
  setMode: Dispatch<SetStateAction<Mode>>;
  livingCosts: LivingCosts;
  setLivingCosts: Dispatch<SetStateAction<LivingCosts>>;
  internetCost: number;
  setInternetCost: Dispatch<SetStateAction<number>>;
  subscriptions: SubscriptionItem[];
  setSubscriptions: Dispatch<SetStateAction<SubscriptionItem[]>>;
  tools: ToolItem[];
  setTools: Dispatch<SetStateAction<ToolItem[]>>;
  laptopPrice: number;
  setLaptopPrice: Dispatch<SetStateAction<number>>;
  laptopMonths: number;
  setLaptopMonths: Dispatch<SetStateAction<number>>;
  budgetPeriod: "weekly" | "monthly" | "yearly";

  // Computed props
  breakdown: CostBreakdown;
  isSurviving: boolean;

  // Content props
  services: Array<{ icon: LucideIcon; title: string; text: string }>;
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

export function DesktopLayout({
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
}: DesktopLayoutProps) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <HeroSection
        breakdown={breakdown}
        monthlyIncome={monthlyIncome}
        country={country}
        isSurviving={isSurviving}
      />

      {/* Calculator Section */}
      <CalculatorSection
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
        breakdown={breakdown}
      />

      {/* Marquee */}
      <div className="border-y border-black bg-secondary py-5">
        <Marquee
          items={tickerItems}
          separator="*"
          className="text-3xl font-black uppercase tracking-normal text-black/25 sm:text-5xl"
        />
      </div>

      {/* About Section */}
      <AboutSection description={aboutDescription} heading={aboutHeading} />

      {/* Services Section */}
      <ServicesSection services={services} />

      {/* Dark Marquee */}
      <section className="overflow-hidden bg-[#141414] py-12 text-white">
        <Marquee
          items={darkMarqueeItems}
          separator="*"
          className="text-5xl font-black uppercase tracking-normal text-white sm:text-7xl lg:text-8xl"
        />
      </section>

      {/* Benefits Section */}
      <BenefitsSection
        heading={benefitsHeading}
        description={benefitsDescription}
        benefits={benefits}
      />

      {/* Featured Works Section */}
      <FeaturedWorksSection
        profiles={profiles}
        defaultWorks={defaultWorks}
        country={country}
        profilesSource={profilesSource}
      />

      {/* FAQ Section */}
      <FaqSection faqs={faqs} />

      {/* CTA Section */}
      <CtaSection heading={ctaHeading} />

      {/* Footer */}
      <FooterSection />
    </main>
  );
}