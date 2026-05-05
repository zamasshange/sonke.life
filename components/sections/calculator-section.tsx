"use client";

import React, { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import {
  Country,
  Mode,
  JobType,
  SubscriptionItem,
  ToolItem,
  LivingCosts,
  CostBreakdown,
} from "@/lib/types";
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

export interface CalculatorSectionProps {
  // Input props
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
}

export function CalculatorSection({
  // Input props
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
}: CalculatorSectionProps) {
  return (
    <section id="calculator" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-[1480px] px-5 sm:px-8">
        <FadeInSection>
          <div className="mb-14 grid gap-7 lg:grid-cols-[0.55fr_0.45fr] lg:items-end">
            <div>
              <SectionLabel>Calculator</SectionLabel>
              <h2 className="text-5xl font-black uppercase leading-[0.92] tracking-normal sm:text-7xl lg:text-8xl">
                Enter your monthly costs.
              </h2>
            </div>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
              Choose a mode, tune the real amounts, then use the result as a practical snapshot
              of what your life costs before savings, surprises or ambition.
            </p>
          </div>
        </FadeInSection>

        <FadeInSection delay={0.04}>
          <div className="mb-8 grid gap-4 lg:grid-cols-2">
            <CurrencyConverterCard defaultCountry={country} />
            <LiveKnowledgePanel breakdown={breakdown} monthlyIncome={monthlyIncome} country={country} />
          </div>
        </FadeInSection>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <FadeInSection>
            <div className="border border-black/15 bg-[#f6f6f6] p-2 sm:p-4 md:p-5">
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
          </FadeInSection>

          <FadeInSection delay={0.08}>
            <div className="sticky top-20 sm:top-28 space-y-4 sm:space-y-6">
              <ResultsCard
                breakdown={breakdown}
                monthlyIncome={monthlyIncome}
                country={country}
                budgetPeriod={budgetPeriod}
              />
              <CostTips
                breakdown={breakdown}
                subscriptions={subscriptions}
                tools={tools}
                internetCost={internetCost}
                livingCosts={livingCosts}
                country={country}
              />
              <BreakdownList breakdown={breakdown} country={country} />
              <EarningsSuggestions breakdown={breakdown} monthlyIncome={monthlyIncome} country={country} />
              <CostInsights
                breakdown={breakdown}
                subscriptions={subscriptions}
                tools={tools}
                internetCost={internetCost}
                livingCosts={livingCosts}
                country={country}
              />
              <AiBudgetAdvisor
                breakdown={breakdown}
                monthlyIncome={monthlyIncome}
                country={country}
              />
              <SonkeChatbot
                breakdown={breakdown}
                monthlyIncome={monthlyIncome}
                country={country}
              />
              <ComparisonCard breakdown={breakdown} currentCountry={country} />
              <ShareCard breakdown={breakdown} monthlyIncome={monthlyIncome} country={country} />
            </div>
          </FadeInSection>
        </div>
      </div>
    </section>
  );
}