"use client";

import { Home, ShoppingCart, Car, Zap, Smartphone, Wifi, Tv, Wrench, Monitor } from "lucide-react";
import { motion } from "framer-motion";
import { CostBreakdown, Country, COUNTRIES } from "@/lib/types";

interface BreakdownListProps {
  breakdown: CostBreakdown;
  country: Country;
}

export function BreakdownList({ breakdown, country }: BreakdownListProps) {
  const { symbol } = COUNTRIES[country];

  const formatCurrency = (amount: number) => {
    return `${symbol}${amount.toLocaleString()}`;
  };

  const getPercentage = (amount: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((amount / total) * 100);
  };

  const livingItems = [
    { key: "rent", label: "RENT", value: breakdown.living.rent, icon: Home, color: "bg-blue-500" },
    { key: "groceries", label: "GROCERIES", value: breakdown.living.groceries, icon: ShoppingCart, color: "bg-green-500" },
    { key: "transport", label: "TRANSPORT", value: breakdown.living.transport, icon: Car, color: "bg-orange-500" },
    { key: "electricity", label: "ELECTRICITY", value: breakdown.living.electricity, icon: Zap, color: "bg-yellow-500" },
    { key: "airtime", label: "AIRTIME / DATA", value: breakdown.living.airtime, icon: Smartphone, color: "bg-pink-500" },
  ].filter(item => item.value > 0);

  const digitalItems = [
    { key: "internet", label: "INTERNET", value: breakdown.digital.internet, icon: Wifi, color: "bg-cyan-500" },
    { key: "subscriptions", label: "SUBSCRIPTIONS", value: breakdown.digital.subscriptions, icon: Tv, color: "bg-purple-500" },
    { key: "tools", label: "TOOLS", value: breakdown.digital.tools, icon: Wrench, color: "bg-indigo-500" },
    { key: "hardware", label: "HARDWARE", value: breakdown.digital.hardware, icon: Monitor, color: "bg-rose-500" },
  ].filter(item => item.value > 0);

  const renderSection = (
    title: string, 
    items: typeof livingItems, 
    total: number,
    startIndex: number
  ) => {
    if (items.length === 0) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {title}
          </h4>
          <span className="text-xs font-mono font-semibold text-foreground">
            {formatCurrency(total)}
          </span>
        </div>
        <div className="space-y-4">
          {items.map((item, index) => {
            const percentage = getPercentage(item.value, total);
            const Icon = item.icon;
            
            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (startIndex + index) * 0.05 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-md ${item.color}/20`}>
                      <Icon className={`h-3.5 w-3.5 ${item.color.replace('bg-', 'text-')}`} />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-muted-foreground">
                      {percentage}%
                    </span>
                    <span className="text-sm font-bold font-mono text-foreground min-w-[80px] text-right">
                      {formatCurrency(item.value)}
                    </span>
                  </div>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: (startIndex + index) * 0.05, ease: [0.25, 0.4, 0.25, 1] }}
                    className={`h-full rounded-full ${item.color}`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm"
    >
      <h3 className="text-xs font-semibold uppercase tracking-widest text-primary mb-6">
        COST BREAKDOWN
      </h3>
      
      <div className="space-y-6">
        {renderSection("Living Costs", livingItems, breakdown.totalLiving, 0)}
        
        {livingItems.length > 0 && digitalItems.length > 0 && (
          <div className="border-t border-border/50" />
        )}
        
        {renderSection("Digital Costs", digitalItems, breakdown.totalDigital, livingItems.length)}
      </div>
    </motion.div>
  );
}
