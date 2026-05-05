"use client";

import { useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CostBreakdown, Country, COUNTRIES } from "@/lib/types";

interface AiBudgetAdvisorProps {
  breakdown: CostBreakdown;
  monthlyIncome: number;
  country: Country;
}

export function AiBudgetAdvisor({ breakdown, monthlyIncome, country }: AiBudgetAdvisorProps) {
  const [advice, setAdvice] = useState<string[]>([]);
  const [source, setSource] = useState<"ai" | "fallback" | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const countryInfo = COUNTRIES[country];
  const difference = monthlyIncome - breakdown.total;

  const payload = useMemo(
    () => ({
      countryName: countryInfo.name,
      currencySymbol: countryInfo.symbol,
      monthlyIncome,
      totalExpenses: breakdown.total,
      difference,
      living: [
        { name: "Rent", amount: breakdown.living.rent },
        { name: "Groceries", amount: breakdown.living.groceries },
        { name: "Transport", amount: breakdown.living.transport },
        { name: "Electricity", amount: breakdown.living.electricity },
        { name: "Airtime / Data", amount: breakdown.living.airtime },
      ],
      digital: [
        { name: "Internet", amount: breakdown.digital.internet },
        { name: "Subscriptions", amount: breakdown.digital.subscriptions },
        { name: "Tools", amount: breakdown.digital.tools },
        { name: "Device Cost", amount: breakdown.digital.hardware },
      ],
    }),
    [breakdown, countryInfo.name, countryInfo.symbol, difference, monthlyIncome]
  );

  const getAdvice = async () => {
    setIsLoading(true);
    setError("");
    setNote(null);

    try {
      const response = await fetch("/api/ai-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Could not generate advice");
      }

      const data = (await response.json()) as {
        source: "ai" | "fallback";
        advice: string[];
        note?: string;
      };

      setAdvice(data.advice);
      setSource(data.source);
      setNote(typeof data.note === "string" ? data.note : null);
    } catch {
      setError("Sonke could not load advice right now. Try again in a moment.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.5 }}
      className="border border-primary/30 bg-primary/5 p-6"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <img src="/images/favicon.png" alt="Sonke mark" className="h-7 w-7 object-contain" />
            <h3 className="text-xs font-semibold uppercase tracking-widest text-primary">
              Sonke AI Budget Advisor
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Get a practical read on what to cut, pause, or rethink this month.
          </p>
        </div>
      </div>

      <Button
        onClick={getAdvice}
        disabled={isLoading}
        className="h-11 w-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {isLoading ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Thinking...
          </>
        ) : (
          "Generate Budget Advice"
        )}
      </Button>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      {advice.length > 0 && (
        <div className="mt-5 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {source === "ai" ? "AI suggestions" : "Rule-based suggestions"}
          </p>
          {note && <p className="text-xs text-muted-foreground">{note}</p>}
          {advice.map((item, index) => (
            <motion.div
              key={`${item}-${index}`}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border border-border bg-background p-4 text-sm leading-relaxed text-foreground"
            >
              {item}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
