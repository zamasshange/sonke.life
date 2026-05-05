"use client";

import { useMemo, useState } from "react";
import { ArrowRightLeft, Banknote, Sparkles, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRIES, Country } from "@/lib/types";
import { CountryFlag } from "@/components/country-flag";

type CurrencyConverterCardProps = {
  defaultCountry: Country;
};

export function CurrencyConverterCard({ defaultCountry }: CurrencyConverterCardProps) {
  const [amountInput, setAmountInput] = useState("");
  const [fromCurrency, setFromCurrency] = useState(COUNTRIES[defaultCountry].currency);
  const [toCurrency, setToCurrency] = useState("USD");
  const [converted, setConverted] = useState<number | null>(null);
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const quickAmounts = [100, 500, 1000, 5000];

  const currencyOptions = useMemo(() => {
    const unique = new Map<string, { code: string; country: Country; name: string }>();
    Object.values(COUNTRIES).forEach((item) => {
      if (!unique.has(item.currency)) {
        unique.set(item.currency, {
          code: item.currency,
          country: item.code,
          name: item.name,
        });
      }
    });
    return Array.from(unique.values()).sort((a, b) => a.code.localeCompare(b.code));
  }, []);

  const handleConvert = async () => {
    const amount = Number.parseFloat(amountInput);
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter a valid amount greater than zero.");
      setConverted(null);
      setRate(null);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/currency-convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          from: fromCurrency,
          to: toCurrency,
        }),
      });
      const data = (await response.json()) as {
        converted?: number;
        rate?: number;
        error?: string;
      };
      if (!response.ok) {
        throw new Error(data.error || "Conversion failed.");
      }
      setConverted(typeof data.converted === "number" ? data.converted : null);
      setRate(typeof data.rate === "number" ? data.rate : null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not convert right now.");
    } finally {
      setLoading(false);
    }
  };

  const swap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="rounded-xl border border-border bg-card/50 p-6 backdrop-blur-sm"
    >
      <div className="mb-4 rounded-lg border border-primary/20 bg-gradient-to-r from-primary/10 via-orange-500/10 to-amber-500/10 p-3">
        <div className="mb-1 flex items-center gap-2">
          <Banknote className="h-4 w-4 text-primary" />
          <h3 className="text-xs font-semibold uppercase tracking-widest text-primary">
            Live Currency Converter
          </h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Convert any amount instantly with live exchange rates.
        </p>
      </div>

      <div className="grid gap-3">
        <div className="rounded-lg border border-black/10 bg-white/70 p-3">
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-black/60">
            Amount
          </label>
          <Input
            type="number"
            min={0}
            step="0.01"
            value={amountInput}
            onChange={(e) => setAmountInput(e.target.value)}
            placeholder="Enter amount"
            className="h-11 text-base font-semibold"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {quickAmounts.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setAmountInput(String(value))}
              className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] transition ${
                amountInput === String(value)
                  ? "border-primary bg-primary text-white"
                  : "border-black/15 bg-white/80 text-black/70 hover:border-primary hover:text-primary"
              }`}
            >
              {value.toLocaleString()}
            </button>
          ))}
        </div>

        <div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
          <div className="rounded-lg border border-black/10 bg-white/70 p-3">
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-black/60">
              From
            </label>
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger className="h-11 w-full">
                <SelectValue placeholder="From currency" />
              </SelectTrigger>
              <SelectContent>
                {currencyOptions.map((item) => (
                  <SelectItem key={item.code} value={item.code}>
                    <span className="flex items-center gap-2">
                      <CountryFlag country={item.country} className="h-4 w-6 object-cover" />
                      <span>{item.code} - {item.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="button" variant="outline" size="icon" className="mx-auto h-11 w-11" onClick={swap}>
            <ArrowRightLeft className="h-4 w-4" />
          </Button>

          <div className="rounded-lg border border-black/10 bg-white/70 p-3">
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-black/60">
              To
            </label>
            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger className="h-11 w-full">
                <SelectValue placeholder="To currency" />
              </SelectTrigger>
              <SelectContent>
                {currencyOptions.map((item) => (
                  <SelectItem key={item.code} value={item.code}>
                    <span className="flex items-center gap-2">
                      <CountryFlag country={item.country} className="h-4 w-6 object-cover" />
                      <span>{item.code} - {item.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button className="h-11 font-black uppercase tracking-[0.12em]" onClick={handleConvert} disabled={loading}>
          {loading ? "Converting..." : "Convert now"}
        </Button>
      </div>

      <div className="mt-4 rounded-lg border border-black/10 bg-gradient-to-r from-primary/10 via-orange-500/10 to-amber-500/10 p-4">
        {error ? (
          <p className="text-sm font-medium text-red-600">{error}</p>
        ) : converted !== null ? (
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-black/60">
              Converted amount
            </p>
            <p className="mt-1 text-2xl font-black text-black">
              {toCurrency} {converted.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
            {rate !== null && (
              <p className="mt-1 flex items-center gap-1 text-xs text-black/60">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                1 {fromCurrency} = {rate.toLocaleString(undefined, { maximumFractionDigits: 6 })} {toCurrency}
              </p>
            )}
          </div>
        ) : (
          <p className="flex items-center gap-2 text-sm text-black/70">
            <Sparkles className="h-4 w-4 text-primary" />
            Pick currencies and convert to see live output.
          </p>
        )}
      </div>
    </motion.div>
  );
}
