"use client";

import { Lightbulb, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import { CostBreakdown, SubscriptionItem, ToolItem, LivingCosts, Country, COUNTRIES, scaleCurrency } from "@/lib/types";

interface CostInsightsProps {
  breakdown: CostBreakdown;
  subscriptions: SubscriptionItem[];
  tools: ToolItem[];
  internetCost: number;
  livingCosts: LivingCosts;
  country: Country;
}

interface Insight {
  text: string;
  savings: number;
}

export function CostInsights({
  breakdown,
  subscriptions,
  tools,
  internetCost,
  livingCosts,
  country,
}: CostInsightsProps) {
  const { symbol } = COUNTRIES[country];
  const threshold = (amount: number) => scaleCurrency(amount, country);

  const getInsights = (): Insight[] => {
    const insights: Insight[] = [];

    // Check for expensive subscriptions
    const expensiveSubs = subscriptions.filter(
      (sub) => sub.enabled && sub.price > threshold(200)
    );
    if (expensiveSubs.length > 0) {
      const totalExpensiveSubs = expensiveSubs.reduce((sum, sub) => sum + sub.price, 0);
      const potentialSavings = Math.round(totalExpensiveSubs * 0.3);
      insights.push({
        text: `Consider family plans for ${expensiveSubs.map((s) => s.name).join(", ")}`,
        savings: potentialSavings,
      });
    }

    // Check for many subscriptions
    const activeSubs = subscriptions.filter((sub) => sub.enabled);
    if (activeSubs.length >= 3) {
      insights.push({
        text: "Review subscriptions you rarely use",
        savings: Math.round(breakdown.digital.subscriptions * 0.2),
      });
    }

    // Check expensive internet
    if (internetCost > threshold(1000)) {
      insights.push({
        text: "Compare internet providers for better deals",
        savings: Math.round(internetCost * 0.15),
      });
    }

    // Check for high transport costs
    if (livingCosts.transport > threshold(1500)) {
      insights.push({
        text: "Consider carpooling or public transport options",
        savings: Math.round(livingCosts.transport * 0.25),
      });
    }

    // Check high electricity costs
    if (livingCosts.electricity > threshold(800)) {
      insights.push({
        text: "Use energy-saving practices to lower electricity",
        savings: Math.round(livingCosts.electricity * 0.2),
      });
    }

    // Check for expensive tools
    const expensiveTools = tools.filter((tool) => tool.enabled && tool.price > threshold(200));
    if (expensiveTools.length > 0) {
      insights.push({
        text: "Look for free alternatives or student discounts for tools",
        savings: Math.round(breakdown.digital.tools * 0.25),
      });
    }

    // Hardware optimization
    if (breakdown.digital.hardware > threshold(500)) {
      insights.push({
        text: "Extend your device lifespan to reduce monthly cost",
        savings: Math.round(breakdown.digital.hardware * 0.33),
      });
    }

    // High groceries
    if (livingCosts.groceries > threshold(4000)) {
      insights.push({
        text: "Plan meals and buy in bulk to reduce grocery spending",
        savings: Math.round(livingCosts.groceries * 0.15),
      });
    }

    // General advice if total is high
    if (breakdown.total > threshold(15000)) {
      insights.push({
        text: "Bundle services where possible for bulk discounts",
        savings: Math.round(breakdown.total * 0.05),
      });
    }

    return insights.slice(0, 4);
  };

  const insights = getInsights();

  if (insights.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="p-6 rounded-xl border border-emerald-500/30 bg-emerald-500/5 backdrop-blur-sm"
    >
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb className="h-4 w-4 text-emerald-400" />
        <h3 className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
          WHERE YOU CAN SAVE MONEY
        </h3>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Simple changes to reduce your monthly expenses:
      </p>
      
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-emerald-500/20"
          >
            <div className="p-1.5 rounded-md bg-emerald-500/10 mt-0.5">
              <ArrowDown className="h-3 w-3 text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground">{insight.text}</p>
              <p className="text-xs font-mono font-semibold text-emerald-400 mt-1">
                Save {symbol}{insight.savings.toLocaleString()}/month
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
