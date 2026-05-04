"use client";

import { Briefcase, TrendingUp, Users, DollarSign, ArrowUpRight, Package, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { CostBreakdown, Country, COUNTRIES, scaleCurrency } from "@/lib/types";

interface EarningsSuggestionsProps {
  breakdown: CostBreakdown;
  monthlyIncome: number;
  country: Country;
}

interface Suggestion {
  platform: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

export function EarningsSuggestions({ breakdown, monthlyIncome, country }: EarningsSuggestionsProps) {
  const { symbol } = COUNTRIES[country];
  const deficit = breakdown.total - monthlyIncome;
  const hasDeficit = deficit > 0;

  // Only show if there's a deficit
  if (!hasDeficit) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return `${symbol}${Math.abs(amount).toLocaleString()}`;
  };

  const getSuggestions = (): Suggestion[] => {
    const suggestions: Suggestion[] = [];
    const freelanceRate = scaleCurrency(150, country);
    const gigValue = scaleCurrency(500, country);
    const productProfit = scaleCurrency(200, country);
    const affiliateValue = scaleCurrency(300, country);
    const platformRate = scaleCurrency(200, country);

    // Freelancing - based on deficit size
    const freelanceHours = Math.ceil(deficit / freelanceRate);
    suggestions.push({
      platform: "Freelancing",
      description: `${Math.ceil(freelanceHours / 4)}-${Math.ceil(freelanceHours / 3)} hours per week`,
      icon: Briefcase,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
    });

    // Side hustles
    const gigsNeeded = Math.ceil(deficit / gigValue);
    suggestions.push({
      platform: "Side Hustles",
      description: `${gigsNeeded}-${gigsNeeded + 2} small gigs per month`,
      icon: Clock,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    });

    // Selling products
    const salesNeeded = Math.ceil(deficit / productProfit);
    suggestions.push({
      platform: "Selling Products",
      description: `~${salesNeeded} sales per month`,
      icon: Package,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    });

    // Affiliate Marketing
    if (deficit > scaleCurrency(1000, country)) {
      const affiliateSales = Math.ceil(deficit / affiliateValue);
      suggestions.push({
        platform: "Affiliate Marketing",
        description: `~${affiliateSales} referrals per month`,
        icon: TrendingUp,
        color: "text-orange-400",
        bgColor: "bg-orange-500/10",
      });
    }

    // Upwork / Online platforms
    if (deficit > scaleCurrency(2000, country)) {
      const upworkHours = Math.ceil(deficit / platformRate);
      suggestions.push({
        platform: "Upwork / Fiverr",
        description: `${Math.ceil(upworkHours / 4)} hours per week`,
        icon: DollarSign,
        color: "text-cyan-400",
        bgColor: "bg-cyan-500/10",
      });
    }

    // Content creation / sponsorships
    if (deficit > scaleCurrency(3000, country)) {
      suggestions.push({
        platform: "Sponsorships",
        description: `1-2 small brand deals per month`,
        icon: Users,
        color: "text-pink-400",
        bgColor: "bg-pink-500/10",
      });
    }

    return suggestions.slice(0, 4);
  };

  const suggestions = getSuggestions();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="p-6 rounded-xl border border-amber-500/30 bg-amber-500/5 backdrop-blur-sm"
    >
      <h3 className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-2">
        HOW TO CLOSE THE GAP
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        You need to earn an extra{" "}
        <span className="font-mono font-semibold text-amber-400">
          {formatCurrency(deficit)}
        </span>{" "}
        per month. Here are some options:
      </p>
      
      <div className="space-y-3">
        {suggestions.map((suggestion, index) => {
          const Icon = suggestion.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group flex items-center gap-4 p-4 rounded-lg bg-background/50 border border-border/50 hover:border-amber-500/30 hover:bg-background/80 transition-all duration-200 cursor-pointer"
            >
              <div className={`p-2.5 rounded-lg ${suggestion.bgColor}`}>
                <Icon className={`h-4 w-4 ${suggestion.color}`} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground text-sm group-hover:text-amber-400 transition-colors">
                  {suggestion.platform}
                </p>
                <p className="text-sm text-muted-foreground">
                  {suggestion.description}
                </p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-amber-400 transition-colors" />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
