"use client";

import { motion } from "framer-motion";
import { Lightbulb, TrendingDown, Zap, Wifi, ShoppingCart, Smartphone, Target, Sparkles } from "lucide-react";
import { CostBreakdown, Country, COUNTRIES } from "@/lib/types";

interface CostTipsProps {
  breakdown: CostBreakdown;
  subscriptions: { id: string; name: string; price: number; enabled: boolean }[];
  tools: { id: string; name: string; price: number; enabled: boolean }[];
  internetCost: number;
  livingCosts: {
    rent: number;
    groceries: number;
    transport: number;
    electricity: number;
    airtime: number;
  };
  country: Country;
}

const tips = [
  {
    icon: "💡",
    title: "Review Subscriptions",
    text: "Cancel unused subscriptions to save up",
    condition: (props: CostTipsProps) => props.subscriptions.filter(s => s.enabled && s.price > 0).length > 2,
  },
  {
    icon: "🚌",
    title: "Optimize Transport",
    text: "Public transport can cut costs by 60%",
    condition: (props: CostTipsProps) => props.livingCosts.transport > 1000,
  },
  {
    icon: "⚡",
    title: "Save Electricity",
    text: "LED bulbs use 75% less energy",
    condition: (props: CostTipsProps) => props.livingCosts.electricity > 500,
  },
  {
    icon: "📱",
    title: "Check Data Bundles",
    text: "Bundle deals save up to 30% monthly",
    condition: (props: CostTipsProps) => props.livingCosts.airtime > 200,
  },
  {
    icon: "🌐",
    title: "Review Internet Plan",
    text: "Unlimited plans aren't always best",
    condition: (props: CostTipsProps) => props.internetCost > 1000,
  },
  {
    icon: "🛒",
    title: "Meal Planning",
    text: "Plan meals to reduce food waste",
    condition: (props: CostTipsProps) => props.livingCosts.groceries > 3000,
  },
  {
    icon: "💻",
    title: "Hardware Longevity",
    text: "Extend device life to 4+ years",
    condition: (props: CostTipsProps) => props.breakdown.digital.hardware > 500,
  },
  {
    icon: "🔧",
    title: "Free Alternatives",
    text: "Explore free tools before subscribing",
    condition: (props: CostTipsProps) => props.tools.filter(t => t.enabled && t.price > 0).length > 1,
  },
];

const savingsTips = [
  "Track every expense for 30 days",
  "Set up automatic savings",
  "Use the 50/30/20 budget rule",
  "Review recurring charges weekly",
  "Cook at home more often",
  "Use public transport when possible",
  "Cancel free trials before they charge",
  "Buy generic brands at groceries",
];

export function CostTips({ breakdown, subscriptions, tools, internetCost, livingCosts, country }: CostTipsProps) {
  const { symbol } = COUNTRIES[country];

  const formatCurrency = (amount: number) => {
    return `${symbol}${Math.abs(amount).toLocaleString()}`;
  };

  const activeTips = tips.filter(tip => tip.condition({ breakdown, subscriptions, tools, internetCost, livingCosts, country }));

  // Deterministic tip selection based on country to avoid hydration mismatch
  const countryIndex = Object.keys(COUNTRIES).indexOf(country);
  const randomTip = savingsTips[countryIndex % savingsTips.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="border border-border bg-gradient-to-br from-secondary/80 to-secondary p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="text-xs font-semibold uppercase tracking-widest text-primary">
          Smart Money Tips
        </h3>
      </div>

      {/* Active tips based on user data */}
      {activeTips.length > 0 && (
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
            Personalized for you
          </p>
          <div className="grid gap-2">
            {activeTips.slice(0, 3).map((tip, index) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-3 p-3 bg-white/60 border border-border/50"
              >
                <span className="text-xl">{tip.icon}</span>
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-wide text-foreground">{tip.title}</p>
                  <p className="text-[10px] text-muted-foreground">{tip.text}</p>
                </div>
                <Lightbulb className="h-4 w-4 text-amber-500" />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Quick savings calculator */}
      <div className="mb-6 p-4 bg-primary/10 border border-primary/20">
        <div className="flex items-center gap-2 mb-3">
          <Target className="h-4 w-4 text-primary" />
          <p className="text-xs font-bold uppercase tracking-wider text-primary">
            Savings Potential
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-white/50">
            <p className="text-2xl font-black text-foreground font-mono">
              {formatCurrency(
                subscriptions.filter(s => s.enabled && s.price > 0).reduce((sum, s) => sum + s.price, 0) +
                tools.filter(t => t.enabled && t.price > 0).reduce((sum, t) => sum + t.price, 0)
              )}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Monthly Subs</p>
          </div>
          <div className="text-center p-3 bg-white/50">
            <p className="text-2xl font-black text-primary font-mono">
              {formatCurrency(
                (subscriptions.filter(s => s.enabled && s.price > 0).reduce((sum, s) => sum + s.price, 0) +
                tools.filter(t => t.enabled && t.price > 0).reduce((sum, t) => sum + t.price, 0)) * 12
              )}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Yearly Savings</p>
          </div>
        </div>
      </div>

      {/* Daily inspiration */}
      <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-emerald-500/20">
            <TrendingDown className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-1">
              Money Wisdom
            </p>
            <p className="text-sm italic text-foreground">"{randomTip}"</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}