"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Home,
  Wifi,
  Wallet,
  Sparkles,
} from "lucide-react";
import { DesktopLayout, MobileLayout } from "@/components/layouts";
import { useIsMobile } from "@/hooks/use-is-mobile";
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
import { CostProfile } from "@/components/sections/featured-works-section";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=1600&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1600&q=85&auto=format&fit=crop",
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

const works: Array<[string, string, string]> = [
  ["Student setup", "2026", "Lean budget"],
  ["Remote worker", "2026", "Stable stack"],
  ["Freelance studio", "2026", "Tool heavy"],
  ["First apartment", "2026", "Living costs"],
];

const FEATURED_COUNTRY_CODES: Country[] = ["ZA", "US", "GB", "NG"];

const faqs = [
  {
    question: "What does Sonke calculate?",
    answer: "It combines everyday living costs with the digital costs required to study, work or build online.",
  },
  {
    question: "Can I change every amount?",
    answer: "Yes. The presets give you a starting point, then every cost can be edited to match your real month.",
  },
  {
    question: "Why include hardware?",
    answer: "Your laptop or phone may be paid once, but it still has a monthly cost when spread across its useful life.",
  },
  {
    question: "Is this only for South Africa?",
    answer: "No. You can switch countries and compare the same cost profile across currencies and presets.",
  },
];

const aboutDescription =
  "A calculator built like a hard conversation with your budget: simple inputs, direct numbers, and no hiding place for monthly leakage.";

const aboutHeading =
  "Your online life has a price. This makes it visible.";

const benefitsHeading =
  "Ready to unlock a cleaner money picture?";

const benefitsDescription =
  "Sonke is designed for repeated use, so every change in income, rent or subscription habits can be checked in seconds.";

const ctaHeading =
  "Let Sonke show the money story clearly.";

export default function SonkeCalculator() {
  const isMobile = useIsMobile();
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

  // Common layout props
  const layoutProps = {
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
    defaultWorks: works,
    profilesSource,
    // Content strings
    aboutDescription,
    aboutHeading,
    benefitsHeading,
    benefitsDescription,
    ctaHeading,
  };

  // Render the appropriate layout based on device size
  if (isMobile) {
    return <MobileLayout {...layoutProps} />;
  }

  return <DesktopLayout {...layoutProps} />;
}