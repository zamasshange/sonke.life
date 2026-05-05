"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Home,
  Menu,
  Play,
  Sparkles,
  Wallet,
  Wifi,
} from "lucide-react";
import { InputSection } from "@/components/input-section";
import { ResultsCard } from "@/components/results-card";
import { BreakdownList } from "@/components/breakdown-list";
import { ComparisonCard } from "@/components/comparison-card";
import { EarningsSuggestions } from "@/components/earnings-suggestions";
import { CostInsights } from "@/components/cost-insights";
import { ShareCard } from "@/components/share-card";
import { AiBudgetAdvisor } from "@/components/ai-budget-advisor";
import { SonkeChatbot } from "@/components/sonke-chatbot";
import { CostTips } from "@/components/cost-tips";
import { Marquee } from "@/components/marquee";
import {
  Country,
  Mode,
  JobType,
  SubscriptionItem,
  ToolItem,
  LivingCosts,
  CostBreakdown,
  MODE_PRESETS,
  LIVING_PRESETS,
  COUNTRIES,
  convertCurrency,
  convertLivingCosts,
  convertSubscriptions,
  convertTools,
  scaleCurrency,
  scaleLivingCosts,
  scaleSubscriptions,
  scaleTools,
} from "@/lib/types";

type CostProfile = {
  id: string;
  title: string;
  monthlyRange: { min: number; max: number };
  notes: string[];
};

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=1600&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1600&q=85&auto=format&fit=crop",
];

const FEATURE_IMAGES = [
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=900&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=900&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=900&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&q=85&auto=format&fit=crop",
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

const services = [
  {
    icon: Home,
    title: "Living costs",
    text: "Rent, food, transport, electricity and airtime shaped into one monthly reality check.",
  },
  {
    icon: Wifi,
    title: "Digital stack",
    text: "Internet, platforms, software, subscriptions and device depreciation counted clearly.",
  },
  {
    icon: Wallet,
    title: "Income fit",
    text: "Compare your earning power against what your lifestyle asks from you every month.",
  },
  {
    icon: Sparkles,
    title: "Next moves",
    text: "Practical ideas for lowering pressure, closing gaps and planning better choices.",
  },
];

const benefits = [
  "Full monthly price",
  "Income pressure score",
  "Country comparison",
  "Digital cost split",
  "Shareable summary",
  "Earning suggestions",
];

const works = [
  ["Student setup", "2026", "Lean budget"],
  ["Remote worker", "2026", "Stable stack"],
  ["Freelance studio", "2026", "Tool heavy"],
  ["First apartment", "2026", "Living costs"],
] as const;

const FEATURED_COUNTRY_CODES: Country[] = ["ZA", "US", "GB", "NG"];

const faqs = [
  [
    "What does Sonke calculate?",
    "It combines everyday living costs with the digital costs required to study, work or build online.",
  ],
  [
    "Can I change every amount?",
    "Yes. The presets give you a starting point, then every cost can be edited to match your real month.",
  ],
  [
    "Why include hardware?",
    "Your laptop or phone may be paid once, but it still has a monthly cost when spread across its useful life.",
  ],
  [
    "Is this only for South Africa?",
    "No. You can switch countries and compare the same cost profile across currencies and presets.",
  ],
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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-90px" });

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
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-9%", "9%"]);

  return (
    <motion.div
      ref={ref}
      className={`overflow-hidden bg-secondary ${className}`}
      initial={{ clipPath: "inset(10% 0 10% 0)", opacity: 0 }}
      whileInView={{ clipPath: "inset(0% 0 0% 0)", opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.img src={src} alt={alt} style={{ y }} className="h-[120%] w-full object-cover" />
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

export default function SonkeCalculator() {
  const [country, setCountry] = useState<Country>("ZA");
  const [jobType, setJobType] = useState<JobType>("civil_servant");
  const [customJobTitle, setCustomJobTitle] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState(28000);
  const [mode, setMode] = useState<Mode>("worker");
  const [livingCosts, setLivingCosts] = useState<LivingCosts>(LIVING_PRESETS.worker);
  const [internetCost, setInternetCost] = useState(799);
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([
    { id: "netflix", name: "Netflix", price: 199, enabled: true },
    { id: "spotify", name: "Spotify", price: 60, enabled: true },
    { id: "chatgpt", name: "ChatGPT", price: 0, enabled: false },
  ]);
  const [tools, setTools] = useState<ToolItem[]>([
    { id: "canva", name: "Canva", price: 0, enabled: false },
    { id: "hosting", name: "Hosting", price: 0, enabled: false },
    { id: "domains", name: "Domains", price: 0, enabled: false },
  ]);
  const [laptopPrice, setLaptopPrice] = useState(12000);
  const [laptopMonths, setLaptopMonths] = useState(36);
  const [budgetPeriod, setBudgetPeriod] = useState<"weekly" | "monthly" | "yearly">("monthly");

  const [profiles, setProfiles] = useState<CostProfile[]>([]);
  const [profilesSource, setProfilesSource] = useState<"ai" | "fallback" | null>(null);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const preset = MODE_PRESETS[mode];
    setInternetCost(scaleCurrency(preset.internetCost, country));
    setSubscriptions(scaleSubscriptions(preset.subscriptions, country));
    setTools(scaleTools(preset.tools, country));
    setLaptopPrice(scaleCurrency(preset.laptopPrice, country));
    setLaptopMonths(preset.laptopMonths);
    setLivingCosts(scaleLivingCosts(LIVING_PRESETS[mode], country));
    setJobType(preset.defaultJobType);
    setMonthlyIncome(scaleCurrency(preset.defaultIncome, country));
  }, [mode]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        if (!res.ok) return;
        const data = (await res.json()) as { country_code?: string };
        const code = (data.country_code || "").toUpperCase() as Country;
        if (!cancelled && code && code in COUNTRIES) {
          handleCountryChange(code);
        }
      } catch {
        // ignore
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/cost-profiles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country }),
        });
        const data = (await res.json()) as {
          source?: "ai" | "fallback";
          profiles?: CostProfile[];
        };

        if (cancelled) return;

        if (Array.isArray(data.profiles)) {
          setProfiles(data.profiles);
          setProfilesSource(data.source ?? "fallback");
        }
      } catch {
        // ignore
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [country]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4500);
    return () => window.clearInterval(interval);
  }, []);

  const handleCountryChange = (nextCountry: Country) => {
    if (nextCountry === country) {
      return;
    }

    setInternetCost((value) => convertCurrency(value, country, nextCountry));
    setSubscriptions((value) => convertSubscriptions(value, country, nextCountry));
    setTools((value) => convertTools(value, country, nextCountry));
    setLaptopPrice((value) => convertCurrency(value, country, nextCountry));
    setLivingCosts((value) => convertLivingCosts(value, country, nextCountry));
    setMonthlyIncome((value) => convertCurrency(value, country, nextCountry));
    setCountry(nextCountry);
  };

  const breakdown: CostBreakdown = useMemo(() => {
    const subscriptionTotal = subscriptions
      .filter((sub) => sub.enabled)
      .reduce((sum, sub) => sum + sub.price, 0);
    const toolsTotal = tools
      .filter((tool) => tool.enabled)
      .reduce((sum, tool) => sum + tool.price, 0);
    const hardwareMonthly = laptopMonths > 0 ? Math.round(laptopPrice / laptopMonths) : 0;
    const totalLiving =
      livingCosts.rent +
      livingCosts.groceries +
      livingCosts.transport +
      livingCosts.electricity +
      livingCosts.airtime;
    const totalDigital = internetCost + subscriptionTotal + toolsTotal + hardwareMonthly;

    return {
      living: livingCosts,
      digital: {
        internet: internetCost,
        subscriptions: subscriptionTotal,
        tools: toolsTotal,
        hardware: hardwareMonthly,
      },
      totalLiving,
      totalDigital,
      total: totalLiving + totalDigital,
    };
  }, [internetCost, laptopMonths, laptopPrice, livingCosts, subscriptions, tools]);

  const remaining = monthlyIncome - breakdown.total;
  const isSurviving = remaining >= 0;
  const incomeUsed = monthlyIncome > 0 ? Math.round((breakdown.total / monthlyIncome) * 100) : 0;
  const sym = COUNTRIES[country].symbol;
  const heroStats = useMemo(
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
    <main className="min-h-screen bg-background text-foreground">
      <motion.header
        initial={{ y: -90 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 border-b border-black/[0.08] bg-white/[0.97] shadow-[0_8px_40px_rgba(0,0,0,0.06)] backdrop-blur-xl"
      >
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
        <div className="mx-auto flex min-h-[5rem] max-w-[1480px] items-center justify-between gap-4 px-5 py-3 sm:min-h-[5.5rem] sm:px-8 sm:py-3.5">
          <a href="#" className="group flex min-w-0 items-center gap-3 sm:gap-5">
            <span className="relative grid h-[5.25rem] w-[5.25rem] shrink-0 place-items-center overflow-hidden transition-transform duration-300 group-hover:scale-[1.02] sm:h-[6.25rem] sm:w-[6.25rem]">
              <img
                src="/images/logo.png"
                alt="Sonke logo"
                className="h-full w-full object-contain drop-shadow-sm"
              />
            </span>
            <span className="min-w-0 max-w-[9.5rem] sm:max-w-[11rem]">
              <span className="block text-[9px] font-black uppercase leading-snug tracking-[0.26em] text-primary sm:text-[11px] sm:tracking-[0.28em]">
                Real cost of life
              </span>
            </span>
          </a>
          <nav className="hidden items-center gap-1 text-[11px] font-bold uppercase tracking-[0.16em] text-foreground/80 md:flex">
            {(
              [
                ["#about", "About"],
                ["#services", "Costs"],
                ["#calculator", "Calculator"],
                ["#faq", "FAQ"],
              ] as const
            ).map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="rounded-full px-4 py-2.5 transition-colors hover:bg-secondary hover:text-primary"
              >
                {label}
              </a>
            ))}
          </nav>
          <a
            href="#calculator"
            className="hidden items-center gap-2 rounded-full bg-foreground px-5 py-3 text-[11px] font-black uppercase tracking-[0.14em] text-background shadow-sm transition-colors hover:bg-primary sm:flex"
          >
            Calculate <ArrowUpRight className="h-4 w-4" />
          </a>
          <button
            type="button"
            aria-label="Open menu"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-black/15 bg-white transition-colors hover:bg-secondary md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </motion.header>

      <section className="relative overflow-hidden bg-gradient-to-b from-secondary/50 via-background to-background pt-[6.5rem] sm:pt-[7rem]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(255,77,0,0.09),transparent)]"
        />
        <div className="relative mx-auto max-w-[1480px] px-5 pb-10 sm:px-8 lg:pb-16">
          <div className="grid gap-9 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
            <div className="pt-6 lg:pt-10">
              <FadeInSection>
                <div className="mb-7 inline-flex items-center gap-3 border border-black/15 bg-secondary px-4 py-3 text-xs font-black uppercase tracking-[0.2em]">
                  <span className={`h-3 w-3 ${isSurviving ? "bg-emerald-500" : "bg-red-500"}`} />
                  Live money mirror
                </div>
                <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
                  Sonke helps everyday people see the full cost of life: rent, groceries, transport,
                  data, digital tools and the income pressure behind every month.
                </p>
              </FadeInSection>
              <FadeInSection delay={0.1}>
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
              </FadeInSection>
              <FadeInSection delay={0.18}>
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
              </FadeInSection>
            </div>

            <FadeInSection delay={0.18} className="relative">
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
                <button className="absolute left-6 top-6 grid h-20 w-20 place-items-center bg-white text-primary transition-transform hover:scale-105" aria-label="Preview Sonke">
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
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-black/45">{stat.label}</p>
                      <p className="mt-1 font-mono text-2xl font-black">{stat.value}</p>
                    </motion.div>
                  ))}
                </div>
                <motion.div
                  className={`absolute bottom-0 left-0 right-0 p-5 text-white sm:p-7 ${isSurviving ? "bg-emerald-600" : "bg-primary"}`}
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
            </FadeInSection>
          </div>
        </div>
      </section>

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

          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <FadeInSection>
              <div className="border border-black/15 bg-[#f6f6f6] p-2 sm:p-4 md:p-5">
                <InputSection
                  country={country}
                  setCountry={handleCountryChange}
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
                <ResultsCard breakdown={breakdown} monthlyIncome={monthlyIncome} country={country} budgetPeriod={budgetPeriod} />
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

      <div className="border-y border-black bg-secondary py-5">
        <Marquee
          items={tickerItems}
          separator="*"
          className="text-3xl font-black uppercase tracking-normal text-black/25 sm:text-5xl"
        />
      </div>

      <section id="about" className="bg-white py-20 sm:py-28">
        <div className="mx-auto grid max-w-[1480px] gap-12 px-5 sm:px-8 lg:grid-cols-[0.38fr_0.62fr]">
          <FadeInSection>
            <SectionLabel>About us</SectionLabel>
            <p className="max-w-sm text-lg leading-relaxed text-muted-foreground">
              A calculator built like a hard conversation with your budget: simple inputs, direct
              numbers, and no hiding place for monthly leakage.
            </p>
          </FadeInSection>
          <FadeInSection delay={0.1}>
            <h2 className="text-5xl font-black uppercase leading-[0.92] tracking-normal sm:text-7xl lg:text-8xl">
              Your online life has a price. This makes it visible.
            </h2>
          </FadeInSection>
        </div>
      </section>

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

      <section className="overflow-hidden bg-[#141414] py-12 text-white">
        <Marquee
          items={["Work smarter", "Spend clearer", "Plan stronger", "Live better", "Earn greater"]}
          separator="*"
          className="text-5xl font-black uppercase tracking-normal text-white sm:text-7xl lg:text-8xl"
        />
      </section>

      <section className="bg-secondary py-20 sm:py-28">
        <div className="mx-auto max-w-[1480px] px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.6fr_0.4fr]">
            <FadeInSection>
              <SectionLabel>Benefits</SectionLabel>
              <h2 className="text-5xl font-black uppercase leading-[0.92] tracking-normal sm:text-7xl">
                Ready to unlock a cleaner money picture?
              </h2>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Sonke is designed for repeated use, so every change in income, rent or
                subscription habits can be checked in seconds.
              </p>
            </FadeInSection>
            <FadeInSection delay={0.08}>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-4 border border-black/15 bg-white p-5">
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
            {(profiles.length > 0 ? profiles : works.map((w) => ({
              id: w[0],
              title: w[0],
              monthlyRange: { min: 0, max: 0 },
              notes: [w[2]],
            }))).map((profile, index) => (
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
                      {(profile.notes || []).slice(0, 3).map((note) => (
                        <div key={note} className="border border-black/10 bg-secondary/40 p-3 text-sm text-foreground">
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

      <section id="faq" className="bg-secondary py-20 sm:py-28">
        <div className="mx-auto grid max-w-[1480px] gap-12 px-5 sm:px-8 lg:grid-cols-[0.42fr_0.58fr]">
          <FadeInSection>
            <SectionLabel>Frequently asked questions</SectionLabel>
            <ParallaxImage src={FEATURE_IMAGES[2]} alt="Team reviewing costs" className="mt-8 aspect-[4/5]" />
          </FadeInSection>
          <div className="divide-y divide-black/15 border-y border-black/15">
            {faqs.map(([question, answer], index) => (
              <FadeInSection key={question} delay={index * 0.04}>
                <details className="group py-7">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-2xl font-black uppercase tracking-normal">
                    {question}
                    <ChevronDown className="h-6 w-6 shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{answer}</p>
                </details>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

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
              <p className="mb-6 text-sm font-black uppercase tracking-[0.24em] text-primary">
                Before the month surprises you
              </p>
              <h2 className="max-w-5xl text-5xl font-black uppercase leading-[0.9] tracking-normal sm:text-7xl lg:text-8xl">
                Let Sonke show the money story clearly.
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
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-white/50">Supported countries</p>
                  <p className="mt-1 text-2xl font-black uppercase">Local first, global ready</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {FEATURED_COUNTRY_CODES.map((code) => {
                    const countryItem = COUNTRIES[code];
                    return (
                    <div key={countryItem.code} className="border border-white/10 bg-black/25 p-3">
                      <span className="text-2xl">{countryItem.flag}</span>
                      <p className="mt-2 text-xs font-bold uppercase tracking-wider text-white/80">{countryItem.code}</p>
                      <p className="mt-2 text-xs font-bold uppercase tracking-wider text-white/55">{countryItem.currency}</p>
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

      <footer className="relative overflow-hidden bg-black text-white">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
        <div className="mx-auto max-w-[1480px] px-5 py-14 sm:px-8 sm:py-18">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <img src="/images/favicon.png" alt="Sonke mark" className="mb-6 h-28 w-28 object-contain sm:h-36 sm:w-36 lg:h-44 lg:w-44" />
              <h2 className="text-6xl font-black uppercase leading-[0.82] tracking-normal sm:text-8xl lg:text-9xl">
                Sonke.
              </h2>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/60">
                A financial mirror for real life: income, rent, groceries, transport, data,
                subscriptions, tools, and the choices that shape the month.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="border border-white/10 bg-white/[0.04] p-5">
                <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-primary">Navigate</p>
                <div className="space-y-3 text-sm font-bold uppercase text-white/60">
                  <a href="#about" className="block hover:text-primary">About us</a>
                  <a href="#services" className="block hover:text-primary">Costs</a>
                  <a href="#calculator" className="block hover:text-primary">Calculator</a>
                  <a href="#faq" className="block hover:text-primary">FAQ</a>
                </div>
              </div>
              <div className="border border-white/10 bg-primary p-5 text-white">
                <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-white/70">Contact</p>
                <a href="mailto:sonkebusiness@gmail.com" className="break-words text-lg font-black hover:underline">
                  sonkebusiness@gmail.com
                </a>
                <p className="mt-5 text-sm text-white/75">Available worldwide</p>
                <p className="mt-1 text-sm text-white/75">Mo-Fr / 9am-6pm</p>
              </div>
            </div>
          </div>
          <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs font-bold uppercase tracking-[0.18em] text-white/35 sm:flex-row sm:items-center sm:justify-between">
            <p>sonke.life</p>
            <p>Budget mirror, not bank advice</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
