"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Home, Wifi, Calendar, TrendingUp as TrendingUpIcon } from "lucide-react";
import { CostBreakdown, Country, COUNTRIES } from "@/lib/types";

interface ResultsCardProps {
  breakdown: CostBreakdown;
  monthlyIncome: number;
  country: Country;
  budgetPeriod?: "weekly" | "monthly" | "yearly";
}

const periodLabels = {
  weekly: { label: "WEEKLY", short: "Week", multiplier: 1 / 4.33 },
  monthly: { label: "MONTHLY", short: "Month", multiplier: 1 },
  yearly: { label: "YEARLY", short: "Year", multiplier: 12 },
};

export function ResultsCard({ breakdown, monthlyIncome, country, budgetPeriod = "monthly" }: ResultsCardProps) {
  const { symbol } = COUNTRIES[country];
  const period = periodLabels[budgetPeriod];

  const formatCurrency = (amount: number) => {
    return `${symbol}${Math.abs(Math.round(amount)).toLocaleString()}`;
  };

  const difference = monthlyIncome - breakdown.total;
  const isPositive = difference >= 0;
  const percentageUsed = monthlyIncome > 0 ? Math.round((breakdown.total / monthlyIncome) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Budget Period Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-primary/10 to-orange-500/10 border border-primary/20"
      >
        <Calendar className="h-3 w-3 text-primary" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
          {period.label} VIEW
        </span>
      </motion.div>

      {/* Main Totals */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
        className="relative overflow-hidden border border-primary/30 bg-gradient-to-br from-card via-card to-primary/5"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />

        <div className="relative p-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">
            TOTAL {period.label} EXPENSES
          </div>

          <motion.div
            key={breakdown.total}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="mb-4"
          >
            <p className="text-5xl sm:text-6xl font-bold text-foreground tracking-tight font-mono">
              {formatCurrency(breakdown.total)}
            </p>
            <p className="text-muted-foreground mt-1 text-sm uppercase tracking-wider">
              PER {period.short.toUpperCase()}
            </p>
          </motion.div>

          {/* Living vs Digital Split */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10">
                <Home className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Living</p>
                <p className="font-mono font-semibold text-foreground">{formatCurrency(breakdown.totalLiving)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10">
                <Wifi className="h-4 w-4 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Digital</p>
                <p className="font-mono font-semibold text-foreground">{formatCurrency(breakdown.totalDigital)}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Income vs Expenses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 border border-border bg-card/50"
      >
        <div className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">
          INCOME VS EXPENSES
        </div>

        <div className="space-y-4">
          {/* Income */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span className="text-sm text-muted-foreground">Income</span>
            </div>
            <span className="font-mono font-semibold text-emerald-400">{formatCurrency(monthlyIncome)}</span>
          </div>

          {/* Expenses */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-400" />
              <span className="text-sm text-muted-foreground">Expenses</span>
            </div>
            <span className="font-mono font-semibold text-red-400">-{formatCurrency(breakdown.total)}</span>
          </div>

          {/* Divider */}
          <div className="border-t border-border/50" />

          {/* Difference */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Remaining</span>
            <span className={`font-mono font-bold text-lg ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
              {isPositive ? "+" : "-"}{formatCurrency(difference)}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Reality Insight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`p-6 border ${
          isPositive
            ? "border-emerald-500/30 bg-emerald-500/5"
            : "border-red-500/30 bg-red-500/5"
        }`}
      >
        <div className="flex items-start gap-4">
          <div className={`p-2 ${isPositive ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
            {isPositive ? (
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-400" />
            )}
          </div>
          <div className="flex-1">
            <h4 className={`text-sm font-semibold uppercase tracking-wider mb-1 ${
              isPositive ? "text-emerald-400" : "text-red-400"
            }`}>
              REALITY INSIGHT
            </h4>
            <p className="text-foreground">
              {isPositive ? (
                <>
                  You have <span className="font-mono font-semibold text-emerald-400">{formatCurrency(difference)}</span> remaining each {period.short.toLowerCase()}.
                  {percentageUsed > 80 && (
                    <span className="text-muted-foreground"> Consider saving more if possible.</span>
                  )}
                </>
              ) : (
                <>
                  You are short by <span className="font-mono font-semibold text-red-400">{formatCurrency(Math.abs(difference))}</span> per {period.short.toLowerCase()}.
                  <span className="text-muted-foreground"> See suggestions below to close the gap.</span>
                </>
              )}
            </p>
            {monthlyIncome > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                You&apos;re using <span className="font-mono font-semibold">{percentageUsed}%</span> of your income on expenses.
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Period Projections */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-3 gap-3"
      >
        <div className="p-4 border border-border bg-card/30">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Weekly</span>
          </div>
          <p className="font-mono text-lg font-bold text-foreground">
            {formatCurrency(breakdown.total / 4.33)}
          </p>
        </div>
        <div className="p-4 bg-black text-white">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUpIcon className="h-3 w-3 text-white/70" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-white/70">Yearly</span>
          </div>
          <p className="font-mono text-lg font-bold text-white">
            {formatCurrency(breakdown.total * 12)}
          </p>
        </div>
        <div className="p-4 border border-border bg-card/30">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Daily</span>
          </div>
          <p className="font-mono text-lg font-bold text-foreground">
            {formatCurrency(breakdown.total / 30)}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
