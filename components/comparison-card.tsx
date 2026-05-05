"use client";

import { useMemo, useState } from "react";
import { Globe } from "lucide-react";
import { motion } from "framer-motion";
import { Country, COUNTRIES, CostBreakdown } from "@/lib/types";
import { CountryFlag } from "@/components/country-flag";

interface ComparisonCardProps {
  breakdown: CostBreakdown;
  currentCountry: Country;
}

export function ComparisonCard({ breakdown, currentCountry }: ComparisonCardProps) {
  const [showAllCountries, setShowAllCountries] = useState(false);

  const formatCurrency = (amount: number, country: Country) => {
    const info = COUNTRIES[country];
    return `${info.symbol}${Math.round(amount).toLocaleString()}`;
  };

  // Get equivalent costs in other countries based on multipliers
  const getEquivalentCost = (country: Country) => {
    const baseInZAR = breakdown.total;
    const info = COUNTRIES[country];
    // Apply multiplier relative to ZAR base
    return Math.round(baseInZAR * info.multiplier);
  };

  const allCountries = useMemo(() => Object.values(COUNTRIES), []);
  const topCountryCodes: Country[] = ["ZA", "US", "GB", "NG"];
  const visibleCountries = showAllCountries
    ? allCountries
    : allCountries.filter(
        (item) => item.code === currentCountry || topCountryCodes.includes(item.code)
      );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm"
    >
      <div className="flex items-center gap-2 mb-2">
        <Globe className="h-4 w-4 text-primary" />
        <h3 className="text-xs font-semibold uppercase tracking-widest text-primary">
          GLOBAL COMPARISON
        </h3>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Equivalent costs in different countries:
      </p>
      
      <div className="space-y-2 sm:space-y-3">
        {visibleCountries.map((country, index) => {
          const isCurrentCountry = country.code === currentCountry;
          const equivalentCost = getEquivalentCost(country.code);
          
          return (
            <motion.div
              key={country.code}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-3 sm:p-4 rounded-lg transition-all duration-200 ${
                isCurrentCountry
                  ? "bg-primary/10 border border-primary/30"
                  : "bg-secondary/50 border border-border/50 hover:border-border"
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <CountryFlag country={country.code} className="h-6 w-9 object-cover" />
                <div>
                  <p className="font-semibold text-foreground text-xs sm:text-sm">{country.name}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground font-mono">{country.currency}</p>
                </div>
              </div>
              <div className="text-right">
                <motion.p
                  key={equivalentCost}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`font-bold font-mono text-sm sm:text-lg ${isCurrentCountry ? "text-primary" : "text-foreground"}`}
                >
                  {formatCurrency(equivalentCost, country.code)}
                </motion.p>
                {isCurrentCountry && (
                  <span className="text-[8px] sm:text-xs text-primary font-semibold uppercase tracking-wider">
                    YOUR LOCATION
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
      <div className="mt-4">
        <button
          type="button"
          onClick={() => setShowAllCountries((prev) => !prev)}
          className="inline-flex items-center border border-border px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          {showAllCountries ? "Show fewer countries" : "See all countries"}
        </button>
      </div>
    </motion.div>
  );
}
